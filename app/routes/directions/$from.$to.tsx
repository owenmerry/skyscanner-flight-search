import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { actionsSaveFlight } from "~/actions/save-flight";
import { actionsSearchForm } from "~/actions/search-form";
import { CarHireDeal } from "~/components/section/car-hire-deal/car-hire-deal.component";
import { DirectionTimeline } from "~/components/section/directions-timeline/directions";
import { FlightControlsApp } from "~/components/ui/flight-controls/flight-controls-app";
import { Layout } from "~/components/ui/layout/layout";
import {
  getGoogleLocationFromId,
  getSkyscannerPlaceNearbyByLatLng,
} from "~/helpers/google";
import { getSearchLink } from "~/helpers/nearby";
import type { GeoSDK, Place } from "~/helpers/sdk/geo/geo-sdk";
import type { GoogleDetailsResponse } from "~/helpers/sdk/google-details/google-details-response";
import type { GoogleRouteSDK } from "~/helpers/sdk/google-route/google-route-sdk";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export async function action({ request }: ActionArgs) {
  let action;
  action = await actionsSearchForm({ request });
  if (!action) {
    action = await actionsSaveFlight({ request });
  }

  return action;
}

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const from = await getGoogleLocationFromId({
    placeId: params.from || "",
    apiUrl,
  });
  const to = await getGoogleLocationFromId({
    placeId: params.to || "",
    apiUrl,
  });
  const query = {
    from,
    to,
  };
  const fromNearby = query.from
    ? await getSkyscannerPlaceNearbyByLatLng({
        apiUrl,
        location: {
          latitude: query.from.location.latitude,
          longitude: query.from.location.longitude,
        },
      })
    : undefined;
  const toNearby = query.to
    ? await getSkyscannerPlaceNearbyByLatLng({
        apiUrl,
        location: {
          latitude: query.to.location.latitude,
          longitude: query.to.location.longitude,
        },
      })
    : undefined;

  const nearby = {
    from: fromNearby,
    to: toNearby,
  };

  const routeFrom = await skyscanner().services.google.route({
    apiUrl,
    origin: {
      placeId: query.from?.id,
    },
    destination: {
      latLng: {
        latitude: nearby.from?.iataPlaceAirport?.coordinates.latitude || "",
        longitude: nearby.from?.iataPlaceAirport?.coordinates.longitude || "",
      },
    },
    travelMode: "TRANSIT",
    arrivalTime: "2025-02-10T15:00:00Z",
  });

  const routeTo = await skyscanner().services.google.route({
    apiUrl,
    origin: {
      latLng: {
        latitude: nearby.to?.iataPlaceAirport?.coordinates.latitude || "",
        longitude: nearby.to?.iataPlaceAirport?.coordinates.longitude || "",
      },
    },
    destination: {
      placeId: query.to?.id,
    },
    travelMode: "TRANSIT",
    arrivalTime: "2025-02-10T15:00:00Z",
  });

  return {
    apiUrl,
    query,
    nearby: { from: nearby.from, to: nearby.to },
    searchLink: getSearchLink(nearby.from?.iataPlace, nearby.to?.iataPlace),
    route: {
      from: routeFrom,
      to: routeTo,
    },
  };
};

export default function Directions() {
  const {
    apiUrl,
    query,
    nearby,
    searchLink,
    route,
  }: {
    apiUrl: string;
    query: {
      from?: GoogleDetailsResponse;
      to?: GoogleDetailsResponse;
    };
    imgMapBase64: string;
    searchLink?: string;
    nearby: {
      to?: {
        geo: GeoSDK;
        iataPlace?: Place;
        iataPlaceAirport?: Place;
        iataPlaceCity?: Place;
      };
      from?: {
        geo: GeoSDK;
        iataPlace?: Place;
        iataPlaceAirport?: Place;
        iataPlaceCity?: Place;
      };
    };
    route: {
      from: GoogleRouteSDK;
      to: GoogleRouteSDK;
    };
  } = useLoaderData();

  return (
    <div>
      <Layout selectedUrl="/search" apiUrl={apiUrl}>
        <FlightControlsApp
          apiUrl={apiUrl}
          useForm
          rounded
          hideFlightFormOnMobile={false}
          showFlightDetails={false}
        />
        <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-lg lg:px-12 text-center lg:py-16">
          <div className="text-center">
            <img
              className="inline-block"
              src={`https://flights.owenmerry.com/image?from=${nearby.from?.iataPlace?.iata}&to=${nearby.to?.iataPlace?.iata}&w=300&h=300`}
              alt="route"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <DirectionTimeline from={query.from} route={route.from} />
            </div>
            <div>
              <div className="flex gap-4 my-4 bg-slate-700 rounded-lg p-4">
                <div className="text-lg font-semibold">
                  Flight from {nearby.from?.iataPlace?.name} to{" "}
                  {nearby.to?.iataPlace?.name}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {nearby.from?.iataPlace?.name} (Airport:{" "}
                {nearby.from?.iataPlaceAirport?.name})
              </h3>
            </div>
            <div className="mt-8">
              {searchLink ? (
                <a
                  className="inline-block cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700"
                  href={searchLink}
                >
                  Search {nearby.from?.iataPlace?.name} to{" "}
                  {nearby.to?.iataPlace?.name}
                </a>
              ) : (
                "No Search Found"
              )}
            </div>
            <div>
              <h3 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {nearby.to?.iataPlace?.name} (Airport:{" "}
                {nearby.to?.iataPlaceAirport?.name})
              </h3>
            </div>
            <div>
              <DirectionTimeline to={query.to} route={route.to} />
            </div>
            <div>
              <CarHireDeal
                query={{
                  from: nearby.to?.iataPlace?.entityId || "",
                  depart: "2025-02-10",
                  return: "2025-02-11",
                }}
                apiUrl={apiUrl}
              />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
