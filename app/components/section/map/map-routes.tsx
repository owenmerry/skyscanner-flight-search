import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { Loading } from "~/components/ui/loading";
import { Map as GoogleMap } from "~/components/ui/map";
import { getFlightSearch } from "~/helpers/map";
import {
  FlightSDK,
  LegSDK,
  SegmentSDK,
} from "~/helpers/sdk/flight/flight-functions";
import { getPlaceFromIata, Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { QueryPlace } from "~/types/search";

export const MapRoutes = ({
  apiUrl,
  googleApiKey,
  googleMapId,
  flightQuery,
  height = 300,
  itineraryId,
  flight,
}: {
  apiUrl: string;
  googleApiKey: string;
  googleMapId: string;
  flightQuery: QueryPlace;
  height?: number;
  itineraryId?: string;
  flight?: FlightSDK[];
}) => {
  const [search, setSearch] = useState<FlightSDK[] | undefined>(flight);
  useEffect(() => {
    if (!search) runSearch();
  }, []);

  useEffect(() => {
    if(!flight) return;
    setSearch([...flight]);
  }, [flight]);

  const runSearch = async () => {
    const res = await skyscanner().flight().create({
      apiUrl,
      query: flightQuery,
    });
    if ("error" in res) return;
    const flight = res.best.filter(
      (flight) => flight.itineraryId === itineraryId
    );
    if (flight.length === 0) {
      runPoll({ sessionToken: res.sessionToken });
      return;
    }
    setSearch(flight);
  };

  const runPoll = async ({ sessionToken }: { sessionToken: string }) => {
    const res = await skyscanner().flight().poll({
      apiUrl,
      token: sessionToken,
    });
    if ("error" in res) return;
    const flight = res.best.filter(
      (flight) => flight.itineraryId === itineraryId
    );
    if (flight.length === 0) {
      runPoll({ sessionToken: res.sessionToken });
      return;
    }
    setSearch(flight);
  };

  if (!search)
    return (
      <div className="text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
        Generating Map... <Loading />
      </div>
    );

  const getSegmentsLatAndLng = (
    segments: SegmentSDK[],
    type: "to" | "from"
  ) => {
    return segments.map((segment) => {
      const location = getPlaceFromIata(
        String(type === "to" ? segment.toIata : segment.fromIata)
      );
      return {
        lat: (location && location.coordinates.latitude) || 0,
        lng: (location && location.coordinates.longitude) || 0,
        name: (location && location.name) || 0,
      };
    });
  };

  const getLegLatAndLng = (leg: LegSDK, type: "to" | "from") => {
    const location = getPlaceFromIata(
      String(type === "to" ? leg.toIata : leg.fromIata)
    );
    return {
      lat: (location && location.coordinates.latitude) || 0,
      lng: (location && location.coordinates.longitude) || 0,
      name: (location && location.name) || 0,
    };
  };

  const routesLines = search.map((route) => {
    return [
      getLegLatAndLng(route.legs[0], "from"),
      ...getSegmentsLatAndLng(route.legs[0].segments, "to"),
      ...(flightQuery.return
        ? getSegmentsLatAndLng(route.legs[1].segments, "to")
        : []),
      ...(flightQuery.return ? [getLegLatAndLng(route.legs[1], "to")] : []),
    ];
  });

  const getUniqueLocations = (locationArrays: Place[][]): Place[] => {
    const locationMap = new Map<string, Place>();

    locationArrays.flat().forEach((location) => {
      if (!locationMap.has(location.entityId)) {
        locationMap.set(location.entityId, location);
      }
    });

    return Array.from(locationMap.values());
  };

  const routesStopovers = () => {
    const stopovers = search.map((route) => {
      return route.route;
    });

    return getUniqueLocations(stopovers);
  };

  return (
    <div className="mb-2">
      <Wrapper apiKey={googleApiKey} key="map-component-wrapper">
        <GoogleMap
          googleMapId={googleMapId}
          key="map-component-map"
          center={{
            lat: flightQuery.to.coordinates.latitude,
            lng: flightQuery.to.coordinates.longitude,
          }}
          height={`${height}px`}
          zoom={5}
          lines={routesLines}
          markers={getFlightSearch([
            flightQuery.to,
            flightQuery.from,
            ...routesStopovers(),
          ])}
        />
      </Wrapper>
    </div>
  );
};
