import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { Layout } from "~/components/ui/layout/layout";
import { getDistanceOfFromTo } from "~/helpers/distance";
import {
  getGoogleLocationFromId,
  getSkyscannerPlaceNearbyByLatLng,
} from "~/helpers/google";
import { imageUrlToBase64 } from "~/helpers/image";
import { getSearchLink } from "~/helpers/nearby";
import type { GeoSDK } from "~/helpers/sdk/geo/geo-sdk";
import type { GoogleDetailsResponse } from "~/helpers/sdk/google-details/google-details-response";
import { GoogleRouteSDK } from "~/helpers/sdk/google-route/google-route-sdk";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

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

  const imageHasData =
    query.to?.location.latitude &&
    query.from?.location.latitude &&
    query.from?.location.latitude &&
    query.to?.location.latitude;
  const urlMap = imageHasData
    ? `https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff80|weight:5|${query.from?.location.latitude},${query.from?.location.longitude}|${query.to?.location.latitude},${query.to?.location.longitude}&size=1000x400&maptype=roadmap&markers=color:blue%7Clabel:S%7C${query.from?.location.latitude},${query.from?.location.longitude}&markers=color:green%7Clabel:E%7C${query.to?.location.latitude},${query.to?.location.longitude}&key=AIzaSyAYYGzly02Z6H1mk0vuvfxRtA3VEDOKNww`
    : undefined;
  const imgMapBase64 = urlMap ? await imageUrlToBase64(urlMap) : "";

  const route = await skyscanner().services.google.route({
    apiUrl,
    origin: {
      placeId: query.from?.id,
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
    imgMapBase64,
    nearby: { from: nearby.from?.geo, to: nearby.to?.geo },
    searchLink: getSearchLink(nearby.from?.iataPlace, nearby.to?.iataPlace),
    route,
  };
};

export default function Directions() {
  const {
    apiUrl,
    query,
    nearby,
    imgMapBase64,
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
      to?: GeoSDK;
      from?: GeoSDK;
    };
    route: GoogleRouteSDK;
  } = useLoaderData();
  console.log("query", query);
  console.log("nearby", nearby);
  type Item = "to" | "from";
  const items: Item[] = ["from", "to"];

  return (
    <div>
      <Layout selectedUrl="/search" apiUrl={apiUrl}>
        <HeroSimple
          title={`${query.from?.displayName?.text} to ${
            query.to?.displayName?.text
          } (${
            query.from?.location?.latitude &&
            query.to?.location?.latitude &&
            query.from?.location?.longitude &&
            query.to?.location?.longitude
              ? `${Math.ceil(
                  getDistanceOfFromTo(query.from.location, query.to.location)
                )}km`
              : ""
          })`}
        />
        <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center lg:py-16">
          <img src={imgMapBase64} alt="route" />
          <div className="flex gap-4">
            {items.map((key) => {
              return (
                <div className="flex-1" key={key}>
                  <h2 className="text-2xl font-bold">
                    {query[key]?.displayName?.text}
                  </h2>
                  <div>
                    {query[key]?.location?.latitude},{" "}
                    {query[key]?.location?.longitude}
                  </div>
                  <div className="text-xl font-bold mb-4">Nearby</div>
                  <div className="grid grid-cols-1 gap-4">
                    {nearby[key]?.places.map((place) => {
                      return (
                        <div
                          key={place.entityId}
                          className="grid grid-cols-1 gap-2 bg-slate-800 p-4 rounded-lg break-words"
                        >
                          <div className="text-2xl font-bold">{place.name}</div>
                          <div>
                            Distance:{" "}
                            {query[key]?.location?.latitude &&
                            query[key]?.location?.longitude &&
                            place.coordinates?.latitude &&
                            place.coordinates?.longitude
                              ? `${Math.ceil(
                                  getDistanceOfFromTo(
                                    query[key]?.location,
                                    place.coordinates
                                  )
                                )}km`
                              : ""}
                          </div>
                          <div>Iata Code: {place.iata}</div>
                          <div>Type: {place.type}</div>
                          <div>Slug: {place.slug}</div>
                          <div>Image Count: {place.images.length}</div>
                          <div>Lat: {place.coordinates?.latitude}</div>
                          <div>Lng: {place.coordinates?.longitude}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {"error" in route || !route?.routes ? (
            ""
          ) : (
            <div>
              <h2 className="text-2xl font-bold">Route</h2>
              <div className="grid grid-cols-1 gap-4">
                {route?.routes?.map((step, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-2 rounded-lg break-words"
                    >
                      <div>Distance: {step.distanceMeters}</div>
                      <div>Duration: {step.duration}</div>
                      <div>Instructions:</div>
                      {step.legs.map((leg, index) => {
                        return (
                          <div key={index} className="grid grid-cols-1 gap-2 ">
                            <div>
                              Distance: {leg.localizedValues.distance.text}
                            </div>
                            <div>
                              Duration: {leg.localizedValues.duration.text}
                            </div>
                            <div>
                              Static Duration:{" "}
                              {leg.localizedValues.staticDuration.text}
                            </div>
                            <div>Steps Overview:</div>
                            {leg.stepsOverview.multiModalSegments.map(
                              (segment, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="grid grid-cols-1 gap-2 bg-slate-800 p-4"
                                  >
                                    <div>
                                      Step Start Index: {segment.stepStartIndex}
                                    </div>
                                    <div>
                                      Step End Index: {segment.stepEndIndex}
                                    </div>
                                    <div>Travel Mode: {segment.travelMode}</div>
                                    <div>Navigation Instruction:</div>
                                    <div>
                                      {
                                        segment.navigationInstruction
                                          ?.instructions
                                      }
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            {searchLink ? (
              <a
                className="inline-block cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700"
                href={searchLink}
              >
                Search {searchLink}
              </a>
            ) : (
              "No Search Found"
            )}
          </div>
        </div>

        {/* <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center lg:py-16">
          <MapStatic
            imageUrl={imgMapBase64}
            altText="Map"
            onShowMap={() => {}}
          />
        </div> */}
      </Layout>
    </div>
  );
}
