import type { V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { add, get } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  FaChampagneGlasses,
  FaMapLocationDot,
  FaMapPin,
  FaRobot,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import type { LoaderFunction } from "storybook/internal/types";
import { PlaceGoogle } from "~/components/section/map/map-planner";
import type { WhatToDoPlace } from "~/components/section/what-to-do/what-to-do-map";
import { WhatToDoMapDay } from "~/components/section/what-to-do/what-to-do-map-day";
import { WhatToDoMapDayApp } from "~/components/section/what-to-do/what-to-do-map-day-app";
import type {
  Activity,
  Trip,
} from "~/components/section/what-to-do/what-to-do-map-flight";
import { WhatToDoMapFlight } from "~/components/section/what-to-do/what-to-do-map-flight";
import { Layout } from "~/components/ui/layout/layout";
import { Loading } from "~/components/ui/loading";
import { Location } from "~/components/ui/location";
import { LocationPlaces } from "~/components/ui/location-places";
import { Title } from "~/components/ui/title/title";
import {
  AiActivities,
  AiDestinations,
  getAIActivities,
  getAIDestinations,
} from "~/helpers/ai/openai";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { getCommonMeta } from "~/helpers/meta";
import type { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { TripDetailsResponseSDK } from "~/helpers/sdk/trip-details/trip-details-sdk";
import { derichTrip } from "~/helpers/trip/derich";
import { enrichTrip } from "~/helpers/trip/enrich";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    {
      title: `What to do | Flights.owenmerry.com`,
    },
    {
      name: "description",
      content: `Collection of places to visit in the city`,
    },
    { tagName: "link", rel: "canonical", href: data.canonicalUrl },
    ...getCommonMeta(),
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const canonicalUrl = generateCanonicalUrl({
    origin: url.origin,
    path: url.pathname,
    queryParams,
  });

  const tripDetails = await skyscanner()
    .tripDetails({ apiUrl, id: params.id || "" })
    .getTrip({
      apiUrl,
      id: params.id || "",
    });

  if ("error" in tripDetails) {
    return false;
  }

  if (tripDetails?.trip?.hackTrip) {
    tripDetails.trip.hackTrip = await enrichTrip({
      trip: tripDetails.trip.hackTrip,
      apiUrl,
    });
  }

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    canonicalUrl,
    tripDetails,
  };
};

export default function WhatToDo() {
  const { apiUrl, googleApiKey, googleMapId, tripDetails, openai } =
    useLoaderData<{
      apiUrl: string;
      googleApiKey: string;
      googleMapId: string;
      tripDetails: TripDetailsResponseSDK;
    }>();
  const [mode, setMode] = useState<"fly" | "city">("fly");
  const [activitySuggestions, setActivitySuggestions] = useState<
    AiActivities[]
  >([]);
  const [destinationsSuggestions, setDestinationsSuggestions] = useState<
    AiDestinations[]
  >([]);
  const [selected, setSelected] = useState<number>(0);
  const [similarItems, setSimilarItems] = useState<PlaceGoogle[]>([]);

  if (!tripDetails || !tripDetails.trip || !tripDetails.city) {
    return (
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <Title text="What to do" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            Trip not found:
            {!tripDetails ? `No tripDetails found` : ""}
            {tripDetails && !tripDetails.city ? `No city found` : ""}
            {tripDetails && !tripDetails.trip
              ? `No tripDetails.trip found`
              : ""}
          </h2>
        </div>
      </Layout>
    );
  }

  const [mapLocation, setMapLocation] = useState<Place | undefined>(
    tripDetails.city
  );

  const [places] = useState<WhatToDoPlace[]>(
    tripDetails.trip?.places ? tripDetails.trip.places : []
  );
  const [trip, setTrip] = useState<Trip>(
    tripDetails.trip.hackTrip
      ? tripDetails.trip.hackTrip
      : {
          name: "My Trip",
          startDate: moment().add(7, "days").format("YYYY-MM-DD"),
          destinations: [{ days: [{}] }, { days: [{}] }],
        }
  );
  const tripHack = trip;
  console.log("tripDetails", tripDetails);

  const updateTrip = async ({
    city,
    trip,
    hackTrip,
  }: {
    city?: Place;
    trip?: WhatToDoPlace[];
    hackTrip?: Trip;
  }) => {
    const placesUpdate = trip ? trip : places;
    skyscanner()
      .tripDetails({ apiUrl, id: "" })
      .updateTrip({
        apiUrl,
        id: tripDetails.id,
        editHash: tripDetails.editHash,
        cityEntityId: city
          ? city.entityId
          : tripDetails.cityEntityId
          ? tripDetails.cityEntityId
          : "27537437",
        trip: {
          places: placesUpdate.map((place) => ({
            id: place.place.id,
          })),
          hackTrip: hackTrip ? derichTrip({ trip: hackTrip }) : tripHack,
        },
      });
  };

  const getSuggestions = async ({
    selected = 0,
    addedActivities,
  }: {
    selected?: number;
    addedActivities?: string[];
  } = {}) => {
    if (!trip.destinations[selected] || !trip.destinations[selected].place)
      return;
    const aiActivities = await getAIActivities({
      location: trip.destinations[selected].place?.name,
      addedActivities: addedActivities
        ? addedActivities
        : trip.destinations[selected].days[0].activities?.map(
            (activity) => activity.googlePlace?.name || ""
          ) || [],
      apiUrl,
    });
    console.log("suggestion endpoint called...");

    setActivitySuggestions(aiActivities.activities);
  };

  const getSuggestionsDestinations = async ({
    addedDestinations,
  }: { addedDestinations?: string[] } = {}) => {
    if (!trip.destinations) return;
    console.log("getSuggestionsDestinations called...", addedDestinations);
    const aiDestinations = await getAIDestinations({
      location: trip.destinations[trip.destinations.length - 1].place?.name || "",
      addedDestinations: addedDestinations ? addedDestinations : undefined,
      apiUrl,
    });
    console.log("suggestion endpoint called...");

    setDestinationsSuggestions(aiDestinations.destinations);
  };

  const handleDestinationUpdate = (place: Place, number: number) => {
    const updatedDestinations = [...trip.destinations];
    updatedDestinations[number] = { ...updatedDestinations[number], place };
    const updatedTrip = { ...trip, destinations: updatedDestinations };
    setTrip(updatedTrip);
    updateTrip({ hackTrip: updatedTrip });
  };

  const handleDestinationAdd = () => {
    const updatedTrip = {
      ...trip,
      destinations: [...trip.destinations, { days: [{}] }],
    };
    setTrip(updatedTrip);
    updateTrip({ hackTrip: updatedTrip });
    setDestinationsSuggestions([]);
    getSuggestionsDestinations({
      addedDestinations: updatedTrip.destinations
        .map((destination) => destination.place?.name || "")
        .flat(),
    });
  };
  const handleDestinationRemove = (number: number) => {
    const updatedDestinations = [...trip.destinations];
    updatedDestinations.splice(number, 1);
    const updatedTrip = { ...trip, destinations: updatedDestinations };
    setTrip(updatedTrip);
    updateTrip({ hackTrip: updatedTrip });
  };

  const handleSelectedTabChanged = (tabNumber: number) => {
    setSelected(tabNumber);
    setActivitySuggestions([]);
    getSuggestions({ selected: tabNumber });
  };

  const handlePlaceSelect = async ({
    placeGoogle,
  }: {
    placeGoogle?: PlaceGoogle;
  }) => {
    if (!placeGoogle) return;
    const selectedDestination = trip.destinations[selected];
    const existingPlace = trip.destinations[selected].days[0].activities?.find(
      (activity) => activity.googlePlace?.id === placeGoogle.id
    );
    if (existingPlace) {
      return;
    }

    const newActivity: Activity = {
      googlePlace: placeGoogle,
    };
    const updatedActivities = [
      ...(selectedDestination.days[0].activities || []),
      newActivity,
    ];

    const updatedTrip = {
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
    };
    setTrip(updatedTrip);
    updateTrip({ hackTrip: updatedTrip });
    setActivitySuggestions([]);
    getSuggestions({
      selected,
      addedActivities: updatedActivities.map(
        (activity) => activity.googlePlace?.name || ""
      ),
    });
  };

  const handleActivityDelete = (index: number) => {
    const selectedDestination = trip.destinations[selected];
    if (!selectedDestination || !selectedDestination.days[0].activities) return;
    const updatedActivities = selectedDestination.days[0].activities.filter(
      (_, i) => i !== index
    );

    const updatedTrip = {
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
    };
    setTrip(updatedTrip);
    updateTrip({ hackTrip: updatedTrip });
  };

  useEffect(() => {
    getSuggestions({ selected });
    getSuggestionsDestinations({
      addedDestinations: trip.destinations
        .map((destination) => destination.place?.name || "")
        .flat(),
    });
  }, []);

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="md:grid grid-cols-10">
          <div className="p-4 col-span-4 h-[calc(100vh-64px)] overflow-y-auto">
            {/* Modes */}
            <div className="flex">
              <div className="mb-4">
                <div
                  className={`cursor-pointer py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${
                    mode === "fly" ? `bg-primary-700` : `bg-primary-900`
                  }`}
                  onClick={() => {
                    setMode("fly");
                  }}
                >
                  Fly
                </div>
              </div>
              <div className="mb-4">
                <div
                  className={`cursor-pointer py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${
                    mode === "city" ? `bg-primary-700` : `bg-primary-900`
                  }`}
                  onClick={() => {
                    setMode("city");
                  }}
                >
                  City
                </div>
              </div>
            </div>
            {/* Destinations */}
            {mode === "fly" ? (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  <FaMapLocationDot className="inline-block" /> Destinations (
                  {trip.destinations.length})
                </h3>
                <div>
                  {trip.destinations.map((destination, index) => {
                    const hadPreviousPlace = index > 0;
                    return (
                      <div key={index} className="mb-4">
                        {destination.place?.name ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <h2 className="inline-block mb-2 text-md font-bold tracking-tight text-white">
                              <FaMapPin className="inline-block" />{" "}
                              {destination.place?.name}
                            </h2>
                            <div className="inline-block ml-2">
                              {destination.days.length} days
                            </div>
                            <div className="inline-block ml-2">
                              {hadPreviousPlace ? (
                                <a
                                  target="_blank"
                                  className="text-sm underline hover:no-underline"
                                  rel="noreferrer"
                                  href={`/search/${
                                    trip.destinations[index - 1].place?.iata
                                  }/${destination.place.iata}/${moment()
                                    .add(7 + index, "days")
                                    .format("YYYY-MM-DD")}/${moment()
                                    .add(7 + index + 1, "days")
                                    .format("YYYY-MM-DD")}`}
                                >
                                  See Flight
                                </a>
                              ) : (
                                <>-</>
                              )}
                            </div>
                            <div className="inline-block ml-2">
                              <div
                                className="cursor-pointer underline hover:no-underline inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg"
                                onClick={() => handleDestinationRemove(index)}
                              >
                                Delete
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Location
                            apiUrl={apiUrl}
                            defaultValue={destination.place?.name || ""}
                            onSelect={(
                              value: string,
                              iataCode: string,
                              place: Place
                            ) => handleDestinationUpdate(place, index)}
                          />
                        )}
                      </div>
                    );
                  })}
                  <div
                    className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-blue-800 focus:ring-blue-4 focus:ring-blue-300 dark:focus:ring-blue-900 bg-blue-700"
                    onClick={handleDestinationAdd}
                  >
                    Add Another Location
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* AI Destinations Section */}
            {mode === "fly" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <FaRobot className="inline-block" /> AI Destinations
                  Suggestions ({destinationsSuggestions.length})
                </h3>
                <div
                  className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
                  onClick={getSuggestionsDestinations}
                >
                  <LuRefreshCw className="inline-block" /> Refresh
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {destinationsSuggestions.map((destination, index) => {
                    return (
                      <div
                        key={index}
                        className="cursor-pointer py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
                      >
                        <div>
                          <h3 className="text-base font-medium">
                            {destination.name}
                          </h3>
                          <div className="my-2 text-xs text-indigo-400 italic">
                            {destination.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {activitySuggestions.length === 0 && <Loading />}
                </div>
              </div>
            ) : (
              ""
            )}

            {/* AI Destinations Section */}

            {/* Tabs */}
            {mode === "city" ? (
              <div className="flex">
                {trip.destinations
                  .filter((destination) => destination.place)
                  .map((destination, index) => (
                    <div key={index} className="mb-4">
                      <div
                        className={`cursor-pointer py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ${
                          selected === index
                            ? `bg-primary-700`
                            : `bg-primary-900`
                        }`}
                        onClick={() => {
                          handleSelectedTabChanged(index);
                        }}
                      >
                        {destination.place?.name} ({destination.days.length}{" "}
                        Days)
                      </div>
                    </div>
                  ))}

                {/* {Array.from({ length: days }, (_, i) => i).map((day, index) => (
          <div key={index} className="mb-4">
          <div >Day {day + 1}</div>
          </div>
          ))} */}
              </div>
            ) : (
              ""
            )}
            {/* Tabs */}

            {/* Activities Items */}
            {mode === "city" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <FaChampagneGlasses className="inline-block" /> Activities (
                  {
                    trip.destinations[selected].days
                      .map((day) => day.activities)
                      .flat().length
                  }
                  )
                </h3>
                <div className="mb-4">
                  <div className="mb-2">
                    <LocationPlaces
                      apiUrl={apiUrl}
                      onSelect={({
                        placeGoogle,
                      }: {
                        placeGoogle: PlaceGoogle;
                      }) => handlePlaceSelect({ placeGoogle })}
                      place={trip.destinations[selected].place}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {trip.destinations[selected].days
                      .map((day) => day.activities)
                      .flat()
                      .map((activity, index) => (
                        <div key={index}>
                          <div className="cursor-pointer py-2 px-3 text-sm font-small text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 bg-blue-700">
                            <h3 className="text-base font-medium">
                              {activity?.googlePlace?.name}
                            </h3>
                            <div className="mt-2">
                              {activity?.googlePlace?.types[0]}
                            </div>
                            <div onClick={() => handleActivityDelete(index)}>
                              remove
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* Activities Items */}

            {/* AI Section */}
            {mode === "city" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <FaRobot className="inline-block" /> AI Activity Suggestions (
                  {activitySuggestions.length})
                </h3>
                <div
                  className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
                  onClick={getSuggestions}
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
                      <div
                        key={index}
                        className="cursor-pointer py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700"
                      >
                        <div>
                          <h3 className="text-base font-medium">
                            {activity.name}
                          </h3>
                          <div className="my-2 text-xs text-indigo-400 italic">
                            {activity.types.join(", ")}
                          </div>
                        </div>
                        {activity.googlePlace ? (
                          <div className="cursor-pointer my-2 inline-block py-2 px-3 mr-2 text-sm font-small text-center text-white rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-indigo-900 bg-indigo-700">
                            Add Activity
                          </div>
                        ) : (
                          <div className="text-xs text-indigo-300">
                            No Google Place found
                          </div>
                        )}
                        <div className="text-sm text-indigo-300 mt-2">
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
            ) : (
              ""
            )}
          </div>
          {/* AI Section */}
          <div className="relative col-span-6">
            <WhatToDoMapDayApp
              city={trip.destinations[selected].place}
              googleApiKey={googleApiKey}
              googleMapId={googleMapId}
              trip={trip}
              mapLocation={mapLocation}
              apiUrl={apiUrl}
              onUpdateTrip={(trip) => {
                setTrip({ ...trip });
                console.log("trip", trip);
                updateTrip({ hackTrip: trip });
              }}
              selectedActivities={mode === 'city' ? trip.destinations[selected].days
                .map((day) => day.activities)
                .flat() : trip.destinations.map(destination => (
                  {
                    googlePlace: {
                      id: destination.place?.entityId || "",
                      name: destination.place?.name || "",
                      location: {
                        latitude: destination.place?.coordinates.latitude || 0,
                        longitude: destination.place?.coordinates.longitude || 0,
                      },
                      types: [],
                      images: [],
                    }
                  }
  )) || []}
              aiSuggestions={mode === 'city' ? activitySuggestions : destinationsSuggestions.map(destination => ({
                name: destination.name,
                types: [],
                location: destination.location,
                cost: 'medium',
                time: 'medium',
                intensity: 'medium',
              }))}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
}
