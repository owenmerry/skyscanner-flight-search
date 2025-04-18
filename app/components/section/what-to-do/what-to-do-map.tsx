import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import type { PlaceGoogle } from "../map/map-planner";
import type { Place } from "~/helpers/sdk/place";
import { useEffect } from "react";

export interface WhatToDoPlace {
  place: PlaceGoogle;
  fullPrice: number;
}

interface WhatToDoMapProps {
  googleApiKey: string;
  googleMapId: string;
  places: WhatToDoPlace[];
  mapLocation?: Place;
}

const MapController = ({ location }: { location?: Place }) => {
  const map = useMap();

  useEffect(() => {
    if (map && location) {
      map.panTo({
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude,
      });
      map.setZoom(12);
    }
  }, [map, location]);

  return null; // this component only controls the map
};

export const WhatToDoMap = ({
  googleApiKey,
  googleMapId,
  places,
  mapLocation,
}: WhatToDoMapProps) => {
  return (
    <div className="h-[500px]">
      <APIProvider apiKey={googleApiKey} libraries={["marker"]}>
        <Map
          mapId={googleMapId}
          defaultZoom={3}
          defaultCenter={
            mapLocation
              ? {
                  lat: mapLocation?.coordinates.latitude,
                  lng: mapLocation?.coordinates.longitude,
                }
              : undefined
          }
          gestureHandling={"greedy"}
          disableDefaultUI
        >
          {places.map((place) => {
            return (
              <AdvancedMarker
                key={place.place.id}
                position={{
                  lat: place.place.location.latitude,
                  lng: place.place.location.longitude,
                }}
                title={"AdvancedMarker with customized pin."}
              >
                <div className="relative bg-primary-700 p-2 rounded-lg">
                  <div className="text-white text-sm">
                    <div>
                      {place.place.name}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        <MapController location={mapLocation} />
      </APIProvider>
    </div>
  );
};
