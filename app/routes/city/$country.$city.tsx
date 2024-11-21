import type { ActionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromSlug, getPlaceFromIata } from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { userPrefs } from "~/helpers/cookies";
import { MarketingHero } from "~/components/section/marketing/marketing-hero";
import { MarketingGallery } from "~/components/section/marketing/marketing-gallery";
import { getImages } from "~/helpers/sdk/query";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";
import moment from "moment";
import { MarketingGraph } from "~/components/section/marketing/marketing-graph";
import { MarketingWeather } from "~/components/section/marketing/marketing-weather";
import { MarketingMapPlaces } from "~/components/section/marketing/marketing-map-places";
import { MarketingBackgroundImage } from "~/components/section/marketing/marketing-background-image";
import { actionsSearchForm } from "~/actions/search-form";

export const meta: MetaFunction = ({ params }) => {
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const city = getPlaceFromSlug(params.city || "", "PLACE_TYPE_CITY", {
    parentId: country ? country.entityId : undefined,
  });
  return {
    title: `Explore ${city ? city.name : ""}, ${country ? country.name : ""} | Flights.owenmerry.com`,
    description: `Discover ${
      city ? city.name : ""
    }, ${country ? country.name : ""} with maps, images and suggested must try locations`,
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const city = getPlaceFromSlug(params.city || "", "PLACE_TYPE_CITY", {
    parentId: country ? country.entityId : undefined,
  });
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const cityImages = await getImages({
    apiUrl,
    query: `${city ? city.name : ""},  city`,
  });
  const from = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LON");
  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: from.entityId,
      to: city ? city.entityId : "anywhere",
      tripType: "return",
    },
    groupType: "month",
    month: Number(moment().format("MM")),
    year: Number(moment().format("YYYY")),
    endMonth: Number(moment().add(10, "months").format("MM")),
    endYear: Number(moment().add(10, "months").format("YYYY")),
  });
  const search = indicativeSearch.quotes;

  return json({
    city,
    cityImages,
    from,
    search,
    googleMapId,
    googleApiKey,
    apiUrl,
  });
};

export async function action({ request }: ActionArgs) {
  let action;
  action = actionsSearchForm({ request });

  return action;
}

export default function SEOAnytime() {
  const {
    city,
    cityImages,
    from,
    search,
    apiUrl,
    googleMapId,
    googleApiKey,
  }: {
    apiUrl: string;
    city: Place;
    from: Place;
    cityImages: string[];
    search: IndicativeQuotesSDK[];
    googleMapId: string;
    googleApiKey: string;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore" apiUrl={apiUrl}>
      <MarketingBackgroundImage image={cityImages[0]} />
      <div className="text-center relative z-10">
        <MarketingHero place={city} />
        <MarketingGallery images={cityImages} />
        {/* <MarketingPlaces place={city} from={from} search={search} /> */}
        <MarketingDeals from={from} search={search} to={city} />
        <MarketingGraph search={search} />
        {/* <MarketingNearby search={search} to={city} apiUrl={apiUrl} /> */}
        <MarketingMapPlaces
          search={search}
          from={from}
          to={city}
          googleMapId={googleMapId}
          googleApiKey={googleApiKey}
        />
        <MarketingWeather to={city} apiUrl={apiUrl} />
      </div>
    </Layout>
  );
}
