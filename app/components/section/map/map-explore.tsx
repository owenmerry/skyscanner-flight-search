import { Wrapper } from "@googlemaps/react-wrapper";
import { useState } from "react";
import {
  MapControls,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import { getAllParents } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MapExploreProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  search: IndicativeQuotesSDK[];
  level?: "city" | "country" | "continent" | "everywhere";
}
export const MapExplore = ({
  search,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: MapExploreProps) => {
  const [map, setMap] = useState<google.maps.Map>();
  const parents = to ? getAllParents(to.parentId) : [];
  const getMarkers = (search: IndicativeQuotesSDK[]): Markers[] => {
    const markers: Markers[] = [];

    //locations
    const searchFiltered = search.filter((item) =>
      to ? item.parentsString.includes(to.entityId) : true
    );
    for (const flight of searchFiltered) {
      const check = markers.filter(
        (item) =>
          item.location.lat === flight.query.to.coordinates.latitude &&
          item.location.lng === flight.query.to.coordinates.longitude
      );
      if (check.length === 0) {
        markers.push({
          location: {
            lat: flight.query.to.coordinates.latitude,
            lng: flight.query.to.coordinates.longitude,
          },
          label: `
              <div class="relative bg-blue-700 p-2 rounded-lg ">
              <div class=" text-white text-sm">
                <svg class="w-4 h-4 text-gray-800 dark:text-white inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z" clip-rule="evenodd"/>
                </svg>
                <div class='font-bold'>${flight.price.display}</div>
              </div>
              <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-blue-700 "></div>
              </div>`,
          link: `/search/${flight.query.from.iata}/${flight.query.to.iata}/${flight.query.depart}/${flight.query.return}`,
          icon: "\ue539",
        });
      }
    }

    return markers;
  };
  const [markers] = useState<Markers[]>(getMarkers(search));

  const centerMap = () => {
    if (!map) return;

    map.panTo({
      lat: to ? to.coordinates.latitude : from.coordinates.latitude,
      lng: to ? to.coordinates.longitude : from.coordinates.longitude,
    });
  };
  const moveToMarker = (map: google.maps.Map, marker: MapMarker) => {
    console.log("run marker");
    if (!map) return;
    console.log("move marker");

    map.panTo({
      lat: marker.location.lat,
      lng: marker.location.lng,
    });
    console.log("zoom to marker");
    map.setZoom(16);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-20 p-2">
        <div className="flex justify-end gap-2">
          <div
            className="text-white inline-block rounded-xl px-3 py-2 text-sm bg-blue-600 font-bold"
            onClick={centerMap}
          >
            Center Map
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 bottom-0 w-full h-full z-10">
        <Wrapper apiKey={googleApiKey}>
          <MapControls
            googleMapId={googleMapId}
            center={{
              lat: to ? to.coordinates.latitude : from.coordinates.latitude,
              lng: to ? to.coordinates.longitude : from.coordinates.longitude,
            }}
            height="100vh"
            markers={markers}
            zoom={level === "everywhere" ? 5 : 0}
            fitAddress={
              to
                ? `${to?.name}${parents[0] ? `, ${parents[0].name}` : ""}`
                : `${getAllParents(from.parentId)[0]}`
            }
            onMarkerClick={(map, marker) => moveToMarker(map, marker)}
            onMapLoaded={(map) => setMap(map)}
          />
        </Wrapper>
      </div>
    </div>
  );
};
