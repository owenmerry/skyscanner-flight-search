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
import { getImages } from "~/helpers/sdk/query";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";
import moment from "moment";
import { MarketingGraph } from "~/components/section/marketing/marketing-graph";
import { MarketingMap } from "~/components/section/marketing/marketing-map";
import { MarketingBackgroundImage } from "~/components/section/marketing/marketing-background-image";
import { actionsSearchForm } from "~/actions/search-form";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { getCommonMeta } from "~/helpers/meta";

export const meta: V2_MetaFunction = ({ params, data }) => {
  const continent = getPlaceFromSlug(
    params.continent || "",
    "PLACE_TYPE_CONTINENT"
  );
  return [
    {
      title: `Explore ${
        continent ? continent.name : ""
      }  | Flights.owenmerry.com`,
    },
    {
      name: "description",
      content: `Discover ${
        continent ? continent.name : ""
      } with maps, images and suggested must try locations`,
    },
    { tagName: "link", rel: "canonical", href: data.canonicalUrl },
    {
      name: "og:image",
      content: data.continentImages[0] ? `${data.continentImages[0]}&w=500` : "",
    },
    ...getCommonMeta(),
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const continent = getPlaceFromSlug(
    params.continent || "",
    "PLACE_TYPE_CONTINENT"
  );
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const continentImages = await getImages({
    apiUrl,
    query: `${continent ? continent.name : ""}`,
  });
  const from = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LON");
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
      apiUrl,
      continent,
      continentImages,
      from,
      search,
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
    continent,
    continentImages,
    from,
    search,
    apiUrl,
    googleMapId,
    googleApiKey,
  }: {
    apiUrl: string;
    continent: Place;
    from: Place;
    continentImages: string[];
    search: IndicativeQuotesSDK[];
    googleMapId: string;
    googleApiKey: string;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore" apiUrl={apiUrl}>
      <MarketingBackgroundImage image={continentImages[0]} />
      <div className="text-center relative z-10">
        <MarketingHero place={continent} />
        <MarketingGallery images={continentImages} />
        <MarketingPlaces
          place={continent}
          url="/country/"
          from={from}
          search={search}
        />
        <MarketingDeals from={from} search={search} to={continent} />
        <MarketingGraph search={search} />
        {/* <MarketingNearby search={search} to={continent} apiUrl={apiUrl} /> */}
        <MarketingMap
          search={search}
          to={continent}
          from={from}
          googleMapId={googleMapId}
          googleApiKey={googleApiKey}
        />
      </div>
    </Layout>
  );
}
