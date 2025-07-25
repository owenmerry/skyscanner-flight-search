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
import type { AiActivities } from "~/helpers/ai/openai";
import { getAIActivities } from "~/helpers/ai/openai";
import { Loading } from "~/components/ui/loading";
import { FaRobot } from "react-icons/fa6";
import { LuRefreshCw } from "react-icons/lu";

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
      markers.forEach((marker) => bounds.extend(marker));
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
  onUpdateTrip,
}: WhatToDoMapDayProps) => {
  const [selected, setSelected] = useState<number>(0);
  const [activitySuggestions, setActivitiySuggestions] = useState<
    AiActivities[]
  >([]);
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

  const markers = activities
    .map((activities) => {
      if (!activities?.googlePlace) return null;
      return {
        lat: activities.googlePlace.location.latitude,
        lng: activities.googlePlace.location.longitude,
      };
    })
    .filter((marker) => marker !== null);

  const refreshAiSuggestions = () => {
    setActivitiySuggestions([]);
    getSuggestions();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSuggestions = async () => {
    const aiActivities = await getAIActivities({
      location: selectedPlace.name,
      apiUrl,
      addedActivities: activities.map(
        (activity) => activity?.googlePlace?.name || ""
      ),
    });
    console.log("suggestion endpoint called...");

    setActivitiySuggestions(aiActivities.activities);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getSuggestions();
    console.log("suggestion effect...");
  }, [selectedPlace]);

  const handleActivityDelete = (index: number) => {
    if (!selectedDestination || !selectedDestination.days[0].activities) return;
    const updatedActivities = selectedDestination.days[0].activities.filter(
      (_, i) => i !== index
    );

    onUpdateTrip &&
      onUpdateTrip({
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
    <div className="">
      <div className="flex">
        {trip.destinations
          .filter((destination) => destination.place)
          .map((destination, index) => (
            <div key={index} className="mb-4">
              <div
                className={`cursor-pointer py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${
                  selected === index ? `bg-primary-700` : `bg-primary-900`
                }`}
                onClick={() => {
                  setSelected(index);
                  setActivitiySuggestions([]);
                }}
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
      <div className="h-[500px]">
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
                      <div onClick={() => handleActivityDelete(index)}>
                        delete
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                  </div>
                </AdvancedMarker>
              );
            })}
            {activitySuggestions.map((activity, index) => {
              if (!activity.location.latitude || !activity.location.latitude)
                return null;
              return (
                <AdvancedMarker
                  key={activity.name + index}
                  position={{
                    lat: activity.location.latitude,
                    lng: activity.location.longitude,
                  }}
                  title={"AdvancedMarker with customized pin."}
                >
                  <div className="relative bg-indigo-700 p-2 rounded-lg">
                    <div className="text-white text-sm">
                      <div>
                        <FaRobot className="inline-block" />{" "}
                        {activity.googlePlace
                          ? activity.googlePlace.name
                          : activity.name}
                      </div>
                      {activity.googlePlace ? (
                        <div
                          onClick={() =>
                            handlePlaceSelect({
                              placeGoogle: activity.googlePlace,
                            })
                          }
                        >
                          Add Activity
                        </div>
                      ) : (
                        <div className="text-xs text-gray-300">
                          No Google Place found
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-indigo-700"></div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
          <MapController location={mapCenter} />
          <FitBounds markers={markers} />
        </APIProvider>
      </div>
      <div className="my-2">
        <h3 className="text-lg font-semibold mb-2">
          <FaRobot className="inline-block" /> Activity Suggestions (
          {activitySuggestions.length})
        </h3>
        <div
          className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
          onClick={refreshAiSuggestions}
        >
          <LuRefreshCw className="inline-block" /> Refresh
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activitySuggestions.map((activity, index) => {
            const getStatusColor = (status: string) => {
              switch (status) {
                case "low":
                  return "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900";
                case "short":
                  return "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900";
                case "medium":
                  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900";
                case "high":
                  return "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900";
                case "long":
                  return "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900";
                default:
                  return "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900";
              }
            };

            return (
              <div key={index} className="bg-slate-700 p-4 rounded-lg">
                <div>
                  {activity.name}
                  <div className="my-2 text-xs text-gray-400 italic">
                    {activity.types.join(", ")}
                  </div>
                </div>
                {activity.googlePlace ? (
                  <div
                    className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
                    onClick={() =>
                      handlePlaceSelect({ placeGoogle: activity.googlePlace })
                    }
                  >
                    Add Activity
                  </div>
                ) : (
                  <div className="text-xs text-gray-300">
                    No Google Place found
                  </div>
                )}
                <div className="text-sm text-gray-300 mt-2">
                  <div className="mb-1">
                    <div
                      className={`${getStatusColor(
                        activity.intensity
                      )} inline-block text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap`}
                    >
                      Intensity: {activity.intensity}
                    </div>
                  </div>
                  <div className="mb-1">
                    <div
                      className={`${getStatusColor(
                        activity.cost
                      )} inline-block text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap`}
                    >
                      Cost: {activity.cost}
                    </div>
                  </div>
                  <div className="mb-1">
                    <div
                      className={`${getStatusColor(
                        activity.time
                      )} inline-block text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap`}
                    >
                      Time: {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {activitySuggestions.length === 0 && <Loading />}
        </div>
      </div>
    </div>
  );
};
