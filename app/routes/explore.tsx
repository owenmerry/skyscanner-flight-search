import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { userPrefs } from "~/helpers/cookies";
import { MarketingGallery } from "~/components/section/marketing/marketing-gallery";
import { MarketingPlaces } from "~/components/section/marketing/marketing-places";
import { getImages } from "~/helpers/sdk/query";
import { MarketingHeroExplore } from "~/components/section/marketing/marketing-hero-explore";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";
import { MarketingGraph } from "~/components/section/marketing/marketing-graph";
import moment from "moment";
import { MarketingMap } from "~/components/section/marketing/marketing-map";
import { AllCountries } from "~/components/section/page/explore";
import { MarketingBackgroundImage } from "~/components/section/marketing/marketing-background-image";
import { actionsSearchForm } from "~/actions/search-form";
import { generateCanonicalUrl } from "~/helpers/canonical-url";

export const meta: MetaFunction = ({data}) => {
  return {
    title: `Explore Everywhere | Flights.owenmerry.com`,
    description: `Discover everywhere in the world with maps, images and suggested must try locations`,
    canonical: data.canonicalUrl,
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const exploreImages = await getImages({
    apiUrl,
    query: `Summer Holidays`,
  });
  const fromCookie = cookie.from
    ? JSON.parse(cookie.from)
    : getPlaceFromIata("LON");
  const from = fromCookie || getPlaceFromIata("LON");
  const countries = skyscanner().geo().countries;
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
  const search = indicativeSearch.quotes;
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const canonicalUrl = generateCanonicalUrl({
    origin: url.origin,
    path: url.pathname,
    queryParams,
  });

  return json(
    {
      exploreImages,
      from,
      search,
      googleMapId,
      googleApiKey,
      countries,
      apiUrl,
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

export default function SEOAnytime() {
  const {
    exploreImages,
    from,
    search,
    googleMapId,
    googleApiKey,
    countries,
    apiUrl,
  }: {
    from: Place;
    exploreImages: string[];
    search: IndicativeQuotesSDK[];
    googleMapId: string;
    googleApiKey: string;
    countries: Place[];
    apiUrl: string;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore" apiUrl={apiUrl}>
      <MarketingBackgroundImage image={exploreImages[0]} />
      <div className="text-center relative z-10">
        <MarketingHeroExplore />
        <MarketingGallery images={exploreImages} />
        <MarketingPlaces url="/continent/" from={from} search={search} />
        <MarketingDeals from={from} search={search} />
        <MarketingGraph search={search} />
        <MarketingMap
          search={search}
          from={from}
          googleMapId={googleMapId}
          googleApiKey={googleApiKey}
          level="everywhere"
        />
        <AllCountries countries={countries} />
      </div>
    </Layout>
  );
}
