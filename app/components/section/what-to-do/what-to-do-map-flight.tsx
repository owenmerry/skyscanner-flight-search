import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import type { Place } from "~/helpers/sdk/place";
import { useEffect } from "react";
import type { PlaceGoogle } from "../map/map-planner";
import { Polyline } from "@react-google-maps/api";

export interface Flight {
  to: Place
}
export interface Accomidation {
  place?: Place;
  googlePlace?: PlaceGoogle;
  checkIn: string;
  fullPrice: number;
  nights: number;
}
export interface Activity {
  googlePlace?: PlaceGoogle;
}
export interface Day {
  activities?: Activity[];
  flight?: Flight[];
}
export interface Destination {
  accomidation?: Accomidation[];
  place?: Place;
  days: Day[];
}
export interface Trip {
  name: string;
  startDate: string;
  destinations: Destination[];
}

interface WhatToDoMapFlightProps {
  googleApiKey: string;
  googleMapId: string;
  trip: Trip;
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

function FitBounds({ markers }: { markers: google.maps.LatLngLiteral[] }) {
  const map = useMap();

  useEffect(() => {
    if (map && markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker));
      map.fitBounds(bounds);
      if (Number(map.getZoom()) > 10) {
        map.setZoom(10); // Adjust zoom level if it's too high
      }
    }
  }, [map, markers]);

  return null;
}

export const WhatToDoMapFlight = ({
  googleApiKey,
  googleMapId,
  trip,
  mapLocation,
}: WhatToDoMapFlightProps) => {
  const markers = trip.destinations.map(destination => {
    if (!destination.place) return null;
    return {
      lat: destination.place.coordinates.latitude,
      lng: destination.place.coordinates.longitude,
    };
  }).filter(marker => marker !== null);

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
          {trip.destinations.map((destination) => {
            if (!destination.place) return null;
            return (
              <AdvancedMarker
                key={destination.place.entityId}
                position={{
                  lat: destination.place.coordinates.latitude,
                  lng: destination.place.coordinates.longitude,
                }}
                title={"AdvancedMarker with customized pin."}
              >
                <div className="relative bg-primary-700 p-2 rounded-lg">
                  <div className="text-white text-sm">
                    <div>
                      {destination.place.name}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        <MapController location={mapLocation} />
        <FitBounds markers={markers} />
        {/* <Polyline
          path={markers}
          options={{
            strokeColor: '#4285F4',
            strokeOpacity: 0.8,
            strokeWeight: 3,
          }}
        /> */}
      </APIProvider>
    </div>
  );
};
