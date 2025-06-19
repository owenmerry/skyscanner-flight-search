import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { getPlaceFromEntityId, type Place } from "~/helpers/sdk/place";
import { useEffect, useState } from "react";
import type { Trip } from "./what-to-do-map-flight";

interface WhatToDoMapFlightProps {
  googleApiKey: string;
  googleMapId: string;
  trip: Trip;
  mapLocation?: Place;
}

const MapController = ({ location }: { location?: Place }) => {
  const map = useMap();

  useEffect(() => {
    console.log("MapController location", location);
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

export const WhatToDoMapDay = ({
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
  const [selected, setSelected] = useState<number>(0);
  const days = trip.destinations.reduce((a, b) => a + b.days.length, 0);
  const selectedDestination = trip.destinations[selected].place ? trip.destinations[selected] : undefined;
  if (!selectedDestination) return null;
  const selectedPlace = selectedDestination.place;
  if (!selectedPlace) return null;
  const activities = selectedDestination.days.map(day => day.activities).flat();
  const mapCenter = selectedPlace.type === "PLACE_TYPE_AIRPORT" && getPlaceFromEntityId(selectedPlace.parentId) ? getPlaceFromEntityId(selectedPlace.parentId) : selectedPlace;
  if(!mapCenter) return null;

  return (
    <div className="h-[500px]">
      <div className="flex">
        {trip.destinations.filter(destination => destination.place).map((destination, index) => (
          <div key={index} className="mb-4">
            <div className={`py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${selected === index ? `bg-primary-700` : `bg-primary-900`}`} onClick={() => setSelected(index)}>{destination.place?.name}</div>
          </div>
        ))}
        {/* {Array.from({ length: days }, (_, i) => i).map((day, index) => (
          <div key={index} className="mb-4">
            <div >Day {day + 1}</div>
          </div>
        ))} */}
      </div>
      <APIProvider apiKey={googleApiKey} libraries={["marker"]}>
        <Map
          mapId={googleMapId}
          defaultZoom={3}
          defaultCenter={
            mapLocation
              ? {
                  lat: mapCenter.coordinates.latitude,
                  lng: mapCenter.coordinates.longitude,
                }
              : undefined
          }
          gestureHandling={"greedy"}
          disableDefaultUI
        >
          {activities.map((activity) => {
            if (!activity?.googlePlace) return null;
            return (
              <AdvancedMarker
                key={activity.googlePlace.id}
                position={{
                  lat: activity.googlePlace.location.latitude,
                  lng: activity.googlePlace.location.longitude,
                }}
                title={"AdvancedMarker with customized pin."}
              >
                <div className="relative bg-primary-700 p-2 rounded-lg">
                  <div className="text-white text-sm">
                    <div>
                      {activity.googlePlace.name}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        <MapController location={mapCenter} />
      </APIProvider>
    </div>
  );
};
