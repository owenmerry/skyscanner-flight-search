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
  city?: Place;
  selectedActivities?: (Activity | undefined)[];
  aiSuggestions?: AiActivities[];
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
  console.log("markers", markers);
  const map = useMap();

  useEffect(() => {
    const markersFiltered = markers.filter(
      (item) => item.lat !== 0 || item.lng !== 0
    );
    if (map && markersFiltered.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markersFiltered
        .filter((item) => item.lat !== 0 || item.lng !== 0)
        .forEach((marker) => bounds.extend(marker));
      map.fitBounds(bounds);
      // if (markers.length === 1) {
      //   map.setZoom(10); // Adjust zoom level if it's too high
      // }
    }
  }, [map, markers]);

  return null;
}

export const WhatToDoMapDayApp = ({
  googleApiKey,
  googleMapId,
  trip,
  mapLocation,
  apiUrl,
  city,
  selectedActivities = [],
  aiSuggestions = [],
  onUpdateTrip,
}: WhatToDoMapDayProps) => {
  if (!city) {
    return "no city found";
  }

  const mapCenterPlace =
    city.type === "PLACE_TYPE_AIRPORT" && getPlaceFromEntityId(city.parentId)
      ? getPlaceFromEntityId(city.parentId)
      : city;

  if (!mapCenterPlace) {
    return "no map center place found";
  }

  console.log(mapCenterPlace);

  return (
    <div className="">
      <div style={{ height: "100vh" }}>
        <APIProvider apiKey={googleApiKey} libraries={["marker"]}>
          <Map
            mapId={googleMapId}
            defaultZoom={3}
            defaultCenter={
              mapLocation
                ? {
                    lat: mapCenterPlace.coordinates.latitude,
                    lng: mapCenterPlace.coordinates.longitude,
                  }
                : undefined
            }
            gestureHandling={"greedy"}
            disableDefaultUI
          >
            {selectedActivities.map((activity, index) => {
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
                      {/* <div onClick={() => handleActivityDelete(index)}>
                        delete
                      </div> */}
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
                  </div>
                </AdvancedMarker>
              );
            })}
            {aiSuggestions.map((activity, index) => {
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
                      {/* {activity.googlePlace ? (
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
                      )} */}
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-indigo-700"></div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
          <MapController location={mapCenterPlace} />
          <FitBounds
            markers={[
              ...(selectedActivities
                .map((activity) => ({
                  lat: activity?.googlePlace?.location.latitude || 0,
                  lng: activity?.googlePlace?.location.longitude || 0,
                }))
                .filter(
                  (item) => item
                ) as unknown as google.maps.LatLngLiteral[]),
              ...(aiSuggestions
                .map((activity) => ({
                  lat: activity?.location.latitude || 0,
                  lng: activity?.location.longitude || 0,
                }))
                .filter(
                  (item) => item
                ) as unknown as google.maps.LatLngLiteral[]),
            ].flat()}
          />
        </APIProvider>
      </div>
      <div className="my-2"></div>
    </div>
  );
};
