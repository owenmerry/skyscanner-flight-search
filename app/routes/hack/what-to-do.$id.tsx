import type { V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import moment from "moment";
import { useState } from "react";
import type { LoaderFunction } from "storybook/internal/types";
import type { PlaceGoogle } from "~/components/section/map/map-planner";
import type { WhatToDoPlace } from "~/components/section/what-to-do/what-to-do-map";
import { WhatToDoMapDay } from "~/components/section/what-to-do/what-to-do-map-day";
import type { Trip } from "~/components/section/what-to-do/what-to-do-map-flight";
import { WhatToDoMapFlight } from "~/components/section/what-to-do/what-to-do-map-flight";
import { Layout } from "~/components/ui/layout/layout";
import { Location } from "~/components/ui/location";
import { Title } from "~/components/ui/title/title";
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

  tripDetails.trip.places = await Promise.all(
    tripDetails.trip.places.map(async (place: { id: string }) => {
      const placeGoogle = await skyscanner().services.google.details({
        apiUrl,
        placeId: place.id,
      });
      if ("error" in placeGoogle) {
        return false;
      }

      const googlePlace: PlaceGoogle = {
        id: placeGoogle.id,
        name: placeGoogle.displayName.text,
        types: placeGoogle.types,
        images: placeGoogle.photos
          ? placeGoogle.photos.map((photo) => {
              return photo.name;
            })
          : [],
        location: placeGoogle.location,
      };

      return {
        place: googlePlace,
        fullPrice: 0,
      };
    })
  );

  console.log("tripDetails?.trip?.hackTrip", tripDetails?.trip?.hackTrip);

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
  const { apiUrl, googleApiKey, googleMapId, tripDetails } = useLoaderData<{
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    tripDetails: TripDetailsResponseSDK;
  }>();

  console.log("tripDetails", tripDetails);

  // if (!tripDetails || !tripDetails.trip || !tripDetails.city) {
  //   return (
  //     <Layout apiUrl={apiUrl} selectedUrl="/search">
  //       <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
  //         <Title text="What to do" />
  //         <h2 className="text-xl font-bold tracking-tight text-white">
  //           Trip not found:
  //           {!tripDetails ? `No tripDetails found` : ""}
  //           {tripDetails && !tripDetails.city ? `No city found` : ""}
  //           {tripDetails && !tripDetails.trip
  //             ? `No tripDetails.trip found`
  //             : ""}
  //         </h2>
  //       </div>
  //     </Layout>
  //   );
  // }

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
  console.log("tripDetails", tripDetails);

  const handleMapLocationSelect = (
    value: string,
    iataCode: string,
    place: Place
  ) => {
    setMapLocation(place);
    updateTrip({ city: place });
  };

  const handleDestinationUpdate = (place: Place, number: number) => {
    const updatedDestinations = [...trip.destinations];
    updatedDestinations[number] = { ...updatedDestinations[number], place };
    setTrip({ ...trip, destinations: updatedDestinations });
    updateTrip({ hackTrip: trip });
  };

  const handleDestinationAdd = () => {
    setTrip({ ...trip, destinations: [...trip.destinations, { days: [{}] }] });
    updateTrip({ hackTrip: trip });
  };
  const handleDestinationRemove = (number: number) => {
    const updatedDestinations = [...trip.destinations];
    updatedDestinations.splice(number, 1);
    setTrip({ ...trip, destinations: updatedDestinations });
    updateTrip({ hackTrip: trip });
  };

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
          hackTrip: derichTrip({ trip: hackTrip }),
        },
      });
  };

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <Link
            className="py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 bg-primary-700"
            to={`/what-to-do`}
          >
            Back
          </Link>
          <div>
            <Title text="Your Trip" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Trip Location
            </h2>
            <div className="mb-4">
              <Location
                apiUrl={apiUrl}
                defaultValue={tripDetails.city ? tripDetails.city.name : ""}
                onSelect={handleMapLocationSelect}
              />
            </div>
          </div>
          <div>
            <Title text="Destinations" />
            {trip.destinations.map((destination, index) => {
              return (
                <div key={index} className="mb-4">
                  <div>Location {index + 1}:</div>
                  <Location
                    apiUrl={apiUrl}
                    onSelect={(value: string, iataCode: string, place: Place) =>
                      handleDestinationUpdate(place, index)
                    }
                  />
                  <div className="flex">
                    <div className="mr-2">{destination.days.length} days</div>
                    <div
                      className="cursor-pointer py-3 px-5 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 bg-primary-700"
                      onClick={() => handleDestinationRemove(index)}
                    >
                      Remove
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className="cursor-pointer inline-block py-3 px-5 mr-2 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 bg-primary-700"
              onClick={handleDestinationAdd}
            >
              Add Another Location
            </div>
            <div>
              <WhatToDoMapFlight
                googleApiKey={googleApiKey}
                googleMapId={googleMapId}
                trip={trip}
                mapLocation={mapLocation}
              />
            </div>
          </div>
          {trip.destinations.filter((destination) => destination.place).flat()
            .length > 0 ? (
            <div>
              <Title text="Days" />
              <WhatToDoMapDay
                googleApiKey={googleApiKey}
                googleMapId={googleMapId}
                trip={trip}
                mapLocation={mapLocation}
                apiUrl={apiUrl}
                onUpdateTrip={(trip) => {
                  debugger;
                  setTrip({ ...trip });
                  console.log("trip", trip);
                  updateTrip({ hackTrip: trip });
                }}
              />
            </div>
          ) : (
            ""
          )}
          {/* <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              City
            </h2>
            <div className="mb-4">
              <LocationPlaces
                apiUrl={apiUrl}
                onSelect={handlePlaceSelect}
                place={mapLocation}
              />
            </div>
            <WhatToDoMap
              googleApiKey={googleApiKey}
              googleMapId={googleMapId}
              places={places}
              mapLocation={mapLocation}
            />
          </div> */}
        </div>
      </Layout>
    </div>
  );
}
