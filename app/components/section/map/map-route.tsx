import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { Loading } from "~/components/ui/loading";
import { Map } from "~/components/ui/map";
import { getFlightSearch } from "~/helpers/map";
import {
  FlightSDK,
  LegSDK,
  SegmentSDK,
} from "~/helpers/sdk/flight/flight-functions";
import { getPlaceFromEntityId, getPlaceFromIata } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { QueryPlace } from "~/types/search";

export const MapRoute = ({
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
  flight?: FlightSDK;
}) => {
  const [search, setSearch] = useState<FlightSDK | undefined>(flight);
  useEffect(() => {
    if (!search) runSearch();
  }, []);

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
    setSearch(flight[0]);
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
    setSearch(flight[0]);
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

  const routeLocations = [
    getLegLatAndLng(search.legs[0], "from"),
    ...getSegmentsLatAndLng(search.legs[0].segments, "to"),
    ...(flightQuery.return
      ? getSegmentsLatAndLng(search.legs[1].segments, "to")
      : []),
    ...(flightQuery.return ? [getLegLatAndLng(search.legs[1], "to")] : []),
  ];

  return (
    <div className="mb-2">
      <Wrapper apiKey={googleApiKey} key="map-component-wrapper">
        <Map
          googleMapId={googleMapId}
          key="map-component-map"
          center={{
            lat: flightQuery.to.coordinates.latitude,
            lng: flightQuery.to.coordinates.longitude,
          }}
          height={`${height}px`}
          zoom={5}
          line={routeLocations}
          // line={[
          //   {
          //     lat: flightQuery.from.coordinates.latitude,
          //     lng: flightQuery.from.coordinates.longitude,
          //   },
          //   {
          //     lat: flightQuery.to.coordinates.latitude,
          //     lng: flightQuery.to.coordinates.longitude,
          //   },
          // ]}
          markers={getFlightSearch([flightQuery.to, flightQuery.from])}
        />
      </Wrapper>
    </div>
  );
};
