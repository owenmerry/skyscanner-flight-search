import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { getRandomNumber, waitSeconds } from "~/helpers/utils";
import { GameJackpot } from "~/components/section/game/jackpot/game-jackpot";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { ImagesDefault } from "~/components/section/images/images-default";
import { Place, getPlaceFromIata, getPlaceFromSlug } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import { ExploreEverywhere } from "~/components/section/explore/explore-everywhere";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { Wrapper } from "@googlemaps/react-wrapper";
import { Map } from "~/components/ui/map";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { getMarkersCountryFrom } from "~/helpers/map";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const placesSDK = skyscanner().geo();
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const countries = placesSDK.countries;
  const randomCountry =
    countries[getRandomNumber(countries.length)] || countries[0];

  return {
    countries,
    apiUrl,
    googleApiKey,
    googleMapId,
    randomCountry,
  };
};

export const Overlay = () => {
  return (
    <div className="opacity-0 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
  );
};
export const Gradient = () => {
  return (
    <div className="bg-gradient-to-t from-gray-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[20%] z-0"></div>
  );
};

export default function Index() {
  const { apiUrl, googleApiKey, googleMapId, randomCountry } = useLoaderData<{
    countries: Place[];
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    randomCountry: Place;
  }>();
  const [showValentine, setShowValentine] = useState(false);
  const [from, setFrom] = useState(
    getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR")
  );
  const fromName = from && from.name;
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const defaultSearch = getDefualtFlightQuery();

  const handleShowValentine = () => {
    setShowValentine(true);
  };

  useEffect(() => {
    runIndicative();
  }, []);

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: randomCountry.entityId,
        depart: "2023-12-01",
        return: "2023-12-20",
        tripType: "return",
      },
      month: Number("2024-03-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

    console.log(indicativeSearch.search);

    setSearchIndicative(indicativeSearch.search);
  };

  if (!from) return;

  return (
    <Layout>
      <section className="relative bg-top bg-cover bg-no-repeat min-h-screen bg-pink-700">
        <Overlay />
        <Gradient />
        <div className="relative z-10 py-16 pb-0 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
          {!showValentine ? (
            <div>
              <div className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
                <div>💖💖💖💖</div>
                <div className="text-8xl my-5 text-white break-words">
                  Who's Your Valentine
                </div>
              </div>
              <p className="mb-8 text-lg font-extrabold lg:text-5xl sm:px-16 xl:px-48 text-pink-300">
                What country is your secret admirer?
              </p>
            </div>
          ) : (
            ""
          )}
          {!showValentine ? (
            <div
              onClick={handleShowValentine}
              className="inline-block p-8 m-5 px-20 bg-pink-600 text-white font-extrabold rounded-2xl cursor-pointer text-2xl hover:bg-pink-500"
            >
              See Who Your Valentine Is
            </div>
          ) : (
            ""
          )}
          {showValentine ? (
            <>
              <div className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
                <div>Your Valentine is </div>
                <div className="text-8xl my-5 text-pink-300 break-words">
                  {randomCountry.name}
                </div>
                <div>You lucky person</div>
                <div className="mt-5 text-6xl">😘😘</div>
              </div>
              <ImagesDefault
                images={randomCountry.images}
                title={`Photos of ${randomCountry.name}`}
              />

              {searchIndicative ? (
                <div className="relative py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
                  <div>
                    <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
                      Flights to {randomCountry.name}
                    </h2>
                  </div>
                  <Wrapper apiKey={googleApiKey}>
                    <Map
                      googleMapId={googleMapId}
                      center={{
                        lat: randomCountry.coordinates.latitude,
                        lng: randomCountry.coordinates.longitude,
                      }}
                      zoom={5}
                      markers={getMarkersCountryFrom(
                        [],
                        searchIndicative,
                        from,
                        defaultSearch
                      )}
                      isFitZoomToMarkers={false}
                    />
                  </Wrapper>
                </div>
              ) : (
                ""
              )}

              <ExploreEverywhere
                title={`${from.name} to ${randomCountry.name}`}
                fromPlace={from}
                toPlace={randomCountry}
                apiUrl={apiUrl}
              />
              <a
                href={`/explore/${randomCountry.slug}`}
                className="inline-block p-8 m-5 px-10 bg-pink-800 text-white font-extrabold rounded-2xl cursor-pointer hover:bg-pink-500"
              >
                See more on {randomCountry.name} your valentine 💖
              </a>
              <div>
                <a
                  href={`/valentines`}
                  className="inline-block p-4 m-2 px-5 text-white font-extrabold rounded-2xl cursor-pointer underline text-sm hover:no-underline"
                >
                  Dump {randomCountry.name} your valentine 🗑️
                </a>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </section>
    </Layout>
  );
}
