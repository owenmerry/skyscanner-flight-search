import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";
import { AllCountries } from "~/components/section/page/explore";
import { Place } from "~/helpers/sdk/place";

import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getMarkersCountryFrom } from "~/helpers/map";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useCallback, useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { Map } from "~/components/ui/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { NavigationMiniApps } from "~/components/ui/navigation/navigation-mini-apps";
import { userPrefs } from "~/helpers/cookies";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const placesSDK = skyscanner().geo();
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  return {
    countries: placesSDK.countries,
    apiUrl,
    googleApiKey,
    googleMapId,
    from: cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LHR"),
    fromCookie: cookie.from,
  };
};

export async function action({ request }: ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();
  const from = bodyParams.get("from") ? bodyParams.get("from") : '';
  const fromParse: Place | undefined = typeof from === 'string' ? JSON.parse(from) : undefined;

  if (from) {
    cookie.from = from;
  }

  const query = {
    from: fromParse?.iata || '',
    to: bodyParams.get("to"),
    depart: bodyParams.get("depart"),
    return: bodyParams.get("return"),
  };

  return redirect(
    `/search/${query.from}/${query.to}/${query.depart}/${query.return}`,
    {
      headers: {
        "Set-Cookie": await userPrefs.serialize(cookie),
      },
    }
  );
}

export default function Index() {
  const { apiUrl, googleApiKey, googleMapId, countries, from, fromCookie } =
    useLoaderData<{
      countries: Place[];
      googleApiKey: string;
      googleMapId: string;
      apiUrl: string;
      from: Place;
      fromCookie: string;
    }>();
  const [countryShow, setCountryShow] = useState(false);
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const defaultSearch = getDefualtFlightQuery();
  defaultSearch.from = from.entityId;
  defaultSearch.fromIata = from.iata;
  defaultSearch.fromText = from.name;
  console.log("query", fromCookie);

  const runIndicative = useCallback(async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from.entityId,
        to: "anywhere",
        tripType: "return",
      },
      month: Number("2023-12-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

    console.log(indicativeSearch.search);

    setSearchIndicative(indicativeSearch.search);
  }, [apiUrl, from]);

  useEffect(() => {
    runIndicative();
  }, [runIndicative]);

  return (
    <Layout selectedUrl="/">
      <HeroDefault
        apiUrl={apiUrl}
        newFeature="We are always adding new features. See All New Features"
        newFeatureURL="/news"
        flightDefault={defaultSearch}
        useForm
      />
      {searchIndicative ? (
        <div className="relative py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div>
            <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
              Flights From {from.name} to Everywhere
            </h2>
          </div>
          <Wrapper apiKey={googleApiKey}>
            <Map
              googleMapId={googleMapId}
              center={{
                lat: from.coordinates.latitude,
                lng: from.coordinates.longitude,
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
      <NavigationWebsite />
      <NavigationMiniApps />
      <AllCountries
        countries={countries}
        showAll={countryShow}
        onShowToggle={() => setCountryShow(!countryShow)}
      />
    </Layout>
  );
}
