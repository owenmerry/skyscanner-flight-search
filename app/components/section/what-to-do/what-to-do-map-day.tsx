import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { getPlaceFromEntityId, type Place } from "~/helpers/sdk/place";
import { useEffect, useState } from "react";
import type { Activity, Trip } from "./what-to-do-map-flight";
import { LocationPlaces } from "~/components/ui/location-places";
import type { PlaceGoogle } from "~/components/section/map/map-planner";

interface WhatToDoMapDayProps {
  googleApiKey: string;
  googleMapId: string;
  trip: Trip;
  mapLocation?: Place;
  apiUrl: string;
  onUpdateTrip?: (trip: Trip) => void;
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

function FitBounds({ markers }: { markers: google.maps.LatLngLiteral[] }) {
  const map = useMap();

  useEffect(() => {
    if (map && markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker));
      map.fitBounds(bounds);
      // if (markers.length === 1) {
      //   map.setZoom(10); // Adjust zoom level if it's too high
      // }
    }
  }, [map, markers]);

  return null;
}

export const WhatToDoMapDay = ({
  googleApiKey,
  googleMapId,
  trip,
  mapLocation,
  apiUrl,
  onUpdateTrip
}: WhatToDoMapDayProps) => {
  const [selected, setSelected] = useState<number>(0);
  //const days = trip.destinations.reduce((a, b) => a + b.days.length, 0);
  const selectedDestination = trip.destinations[selected].place
    ? trip.destinations[selected]
    : undefined;
  if (!selectedDestination) return null;
  const selectedPlace = selectedDestination.place;
  if (!selectedPlace) return null;
  const activities = selectedDestination.days
    .map((day) => day.activities)
    .flat();
  const mapCenter =
    selectedPlace.type === "PLACE_TYPE_AIRPORT" &&
    getPlaceFromEntityId(selectedPlace.parentId)
      ? getPlaceFromEntityId(selectedPlace.parentId)
      : selectedPlace;
  if (!mapCenter) return null;
  const markers = activities.map(activities => {
    if (!activities?.googlePlace) return null;
    return {
      lat: activities.googlePlace.location.latitude,
      lng: activities.googlePlace.location.longitude,
    };
  }).filter(marker => marker !== null);

  const handlePlaceSelect = async ({
    placeGoogle,
  }: {
    placeGoogle: PlaceGoogle;
  }) => {
    const existingPlace = selectedDestination.days[0].activities?.find(
      (activity) => activity.googlePlace?.id === placeGoogle.id
    );
    if (existingPlace) {
      return;
    }

    const newActivity: Activity = {
      googlePlace: placeGoogle,
    };
    const updatedActivities = [
      ...selectedDestination.days[0].activities || [],
      newActivity,
    ];

    onUpdateTrip && onUpdateTrip({
      ...trip,
      destinations: trip.destinations.map((destination, index) => {
        if (index === selected) {
          return {
            ...destination,
            days: destination.days.map((day, dayIndex) => {
              if (dayIndex === 0) {
                return {
                  ...day,
                  activities: updatedActivities,
                };
              }
              return day;
            }),
          };
        }
        return destination;
      }),
    });



    // setPlaces(updatedPlace);
    // updateTrip({ trip: updatedPlace });
  };

  const handleActivityDelete = (index: number) => {
    if (!selectedDestination || !selectedDestination.days[0].activities) return;
    const updatedActivities = selectedDestination.days[0].activities.filter(
      (_, i) => i !== index
    );

    onUpdateTrip && onUpdateTrip({
      ...trip,
      destinations: trip.destinations.map((destination, destIndex) => {
        if (destIndex === selected) {
          return {
            ...destination,
            days: destination.days.map((day, dayIndex) => {
              if (dayIndex === 0) {
                return {
                  ...day,
                  activities: updatedActivities,
                };
              }
              return day;
            }),
          };
        }
        return destination;
      }),
    });
  };

  return (
    <div className="h-[500px]">
      <div className="flex">
        {trip.destinations
          .filter((destination) => destination.place)
          .map((destination, index) => (
            <div key={index} className="mb-4">
              <div
                className={`cursor-pointer py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${
                  selected === index ? `bg-primary-700` : `bg-primary-900`
                }`}
                onClick={() => setSelected(index)}
              >
                {destination.place?.name} ({destination.days.length} Days)
              </div>
            </div>
          ))}

        {/* {Array.from({ length: days }, (_, i) => i).map((day, index) => (
          <div key={index} className="mb-4">
            <div >Day {day + 1}</div>
          </div>
        ))} */}
      </div>
      <div className="mb-4">
      <LocationPlaces
        apiUrl={apiUrl}
        onSelect={({ placeGoogle }: { placeGoogle: PlaceGoogle }) =>
          handlePlaceSelect({ placeGoogle })
        }
        place={mapLocation}
      />
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
          {activities.map((activity, index) => {
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
                    <div>{activity.googlePlace.name}</div>
                    <div onClick={() => handleActivityDelete(index)}>delete</div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        <MapController location={mapCenter} />
        <FitBounds markers={markers} />
      </APIProvider>
    </div>
  );
};
