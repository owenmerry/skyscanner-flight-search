import { ActionArgs, redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import moment from "moment";
import { useState } from "react";
import type { LoaderFunction } from "storybook/internal/types";
import { Layout } from "~/components/ui/layout/layout";
import { Location } from "~/components/ui/location";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { getCommonMeta } from "~/helpers/meta";
import { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { TripDetailsResponseSDK } from "~/helpers/sdk/trip-details/trip-details-sdk";

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

  const trips = await skyscanner()
    .tripDetails({ apiUrl, id: params.id || "" })
    .getAllTrip({
      apiUrl,
    });
  if ("error" in trips) {
    console.log("error", trips.error);
  } else {
    console.log("trips len", trips.length);
  }

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    canonicalUrl,
    trips,
  };
};

export async function action({ request }: ActionArgs) {
  const bodyParams = await request.formData();
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  if (bodyParams.get("action") === "createTrip") {
    const cityEntityId = String(bodyParams.get("cityEntityId"));
    if (!cityEntityId) return redirect(`/hack/what-to-do/?error=cityEntityId`);
    const created = await skyscanner()
      .tripDetails({ apiUrl, id: "" })
      .createTrip({
        apiUrl,
        cityEntityId,
        trip: { places: [] },
      });
    if ("error" in created)
      return redirect(`/hack/what-to-do/?error=${created.error}`);

    return redirect(`/hack/what-to-do/${created.id}`);
  }
  return redirect(`/hack/what-to-do/?error=unknown`);
}

export default function WhatToDo() {
  const [mapLocation, setMapLocation] = useState<Place | undefined>();
  const { apiUrl, trips } = useLoaderData<{
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    trips: TripDetailsResponseSDK[];
  }>();

  console.log("trips", trips);

  const handleMapLocationSelect = async (
    value: string,
    iataCode: string,
    place: Place
  ) => {
    setMapLocation(place);
  };

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-blue-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
            </div>
            <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              What to do
            </h2>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
            {trips.map((trip) => (
              <div key={trip.id}>
                <a href={`/hack/what-to-do/${trip.id}`}>
                  <div>
                    {trip.city?.name}
                  </div>
                  <div>{moment(trip.created_at).fromNow()}</div>
                </a>
              </div>
            ))}
          </div>
          <Form method="post" className="inline-block py-4 mr-2">
            <input type="hidden" name="action" value={"createTrip"} />
            <input
              type="hidden"
              name="cityEntityId"
              value={mapLocation?.entityId}
            />
            <Location apiUrl={apiUrl} onSelect={handleMapLocationSelect} types={['PLACE_TYPE_CITY', 'PLACE_TYPE_COUNTRY']} showOnlyIataCode={false} />
            <button
              className="mt-2 lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
              type="submit"
            >
              Create Trip
            </button>
          </Form>
        </div>
      </Layout>
    </div>
  );
}
