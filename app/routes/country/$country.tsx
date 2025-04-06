import type {
  ActionArgs,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromSlug, getPlaceFromIata } from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { userPrefs } from "~/helpers/cookies";
import { MarketingHero } from "~/components/section/marketing/marketing-hero";
import { MarketingGallery } from "~/components/section/marketing/marketing-gallery";
import { MarketingPlaces } from "~/components/section/marketing/marketing-places";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";
import { MarketingGraph } from "~/components/section/marketing/marketing-graph";
import moment from "moment";
import { MarketingMap } from "~/components/section/marketing/marketing-map";
import { MarketingWeather } from "~/components/section/marketing/marketing-weather";
import { MarketingBackgroundImage } from "~/components/section/marketing/marketing-background-image";
import { actionsSearchForm } from "~/actions/search-form";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { getCommonMeta } from "~/helpers/meta";

export const meta: V2_MetaFunction = ({ params, data }) => {
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const {
    search,
    canonicalUrl,
  }: {
    search: IndicativeQuotesSDK[];
    canonicalUrl: string;
  } = data;
  return [{
    title: `Explore ${country ? country.name : ""}${
      search[0] ? ` From ${search[0].price.display}` : ""
    } | Flights.owenmerry.com`,
  },
  {
    name: "description",
    content: `Discover ${
      country ? country.name : ""
    } with maps, images and suggested must try locations`,
  },
  { tagName: "link", rel: "canonical", href: canonicalUrl },
  {
    name: "og:image",
    content: data.country.images[0] ? `${data.country.images[0]}&w=500` : "",
  },
  ...getCommonMeta(),
];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const from = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LON");
  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: from.entityId,
      to: country ? country.entityId : "anywhere",
      tripType: "return",
    },
    groupType: "month",
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
      country,
      from,
      search,
      apiUrl,
      googleMapId,
      googleApiKey,
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
    country,
    from,
    search,
    apiUrl,
    googleMapId,
    googleApiKey,
  }: {
    country: Place;
    from: Place;
    search: IndicativeQuotesSDK[];
    apiUrl: string;
    googleMapId: string;
    googleApiKey: string;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore" apiUrl={apiUrl}>
      <MarketingBackgroundImage image={country.images[0]} />
      <div className="text-center relative z-10">
        <MarketingHero place={country} />
        <MarketingGallery images={country.images} />
        <MarketingPlaces
          place={country}
          url={`/city/${country.slug}/`}
          from={from}
          search={search}
        />
        <MarketingDeals from={from} search={search} to={country} level="city" />
        <MarketingGraph search={search} />
        <MarketingMap
          search={search}
          to={country}
          from={from}
          googleMapId={googleMapId}
          googleApiKey={googleApiKey}
        />
        <MarketingWeather to={country} apiUrl={apiUrl} />
      </div>
    </Layout>
  );
}
