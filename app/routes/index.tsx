import {
  json,
  type ActionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { Layout } from "~/components/ui/layout/layout";
import { AllCountries } from "~/components/section/page/explore";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { useCallback, useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { NavigationMiniApps } from "~/components/ui/navigation/navigation-mini-apps";
import { userPrefs } from "~/helpers/cookies";
import { MarketingMap } from "~/components/section/marketing/marketing-map";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import moment from "moment";
import { MarketingPlaces } from "~/components/section/marketing/marketing-places";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";
import { actionsSearchForm } from "~/actions/search-form";
import { generateCanonicalUrl } from "~/helpers/canonical-url";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Explore the World | Flights.owenmerry.com`,
    description: `Discover the world with maps, images and suggested must try locations`,
    canonical: data.canonicalUrl,
  };
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const placesSDK = skyscanner().geo();
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const canonicalUrl = generateCanonicalUrl({
    origin: url.origin,
    path: url.pathname,
    queryParams,
  });

  return json(
    {
      countries: placesSDK.countries,
      apiUrl,
      googleApiKey,
      googleMapId,
      from: cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LON"),
      fromCookie: cookie.from,
      canonicalUrl,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
};

export async function action({ request }: ActionArgs) {
  let action;
  action = actionsSearchForm({ request });

  return action;
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
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
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
      month: Number(moment().format("MM")),
      year: Number(moment().format("YYYY")),
      endMonth: Number(moment().add(10, "months").format("MM")),
      endYear: Number(moment().add(10, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    console.log("check", indicativeSearch.quotes);

    setSearch(indicativeSearch.quotes);
  }, [apiUrl, from]);

  useEffect(() => {
    runIndicative();
  }, [runIndicative]);

  return (
    <Layout selectedUrl="/" apiUrl={apiUrl}>
      <HeroDefault
        apiUrl={apiUrl}
        newFeature="We are always adding new features. See All New Features"
        newFeatureURL="/news"
        flightDefault={defaultSearch}
      />
      <div className="relative">
        {search ? (
          <>
            <MarketingMap
              search={search}
              from={from}
              googleMapId={googleMapId}
              googleApiKey={googleApiKey}
              level="everywhere"
            />
            <MarketingPlaces url="/continent/" from={from} search={search} />
            <MarketingDeals from={from} search={search} />
          </>
        ) : (
          ""
        )}
        <NavigationMiniApps />
        <AllCountries
          countries={countries}
          showAll={countryShow}
          onShowToggle={() => setCountryShow(!countryShow)}
        />
      </div>
    </Layout>
  );
}
