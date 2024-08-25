import type { LoaderFunction } from "@remix-run/node";
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
import { MarketingNearby } from "~/components/section/marketing/marketing-nearby";
import { MarketingMap } from "~/components/section/marketing/marketing-map";
import { MarketingWeather } from "~/components/section/marketing/marketing-weather";

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
      to: country ? country.entityId : 'anywhere',
      tripType: "return",
    },
    groupType: 'month',
    month: Number(moment().format('MM')),
    year: Number(moment().format('YYYY')),
    endMonth: Number(moment().add(10,'months').format('MM')),
    endYear: Number(moment().add(10,'months').format('YYYY')),
  });
  const search = indicativeSearch.quotes;

  return json({
    country,
    from,
    search,
    apiUrl,
    googleMapId,
    googleApiKey,
  });
};

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
    googleMapId:string;
    googleApiKey:string;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full bg-top bg-cover bg-no-repeat h-[60rem]"
        style={{backgroundImage: `url(${country.images[0]})`}}>
           <div className="opacity-80 bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
           <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
        </div>
      </div>
      <div className="text-center relative z-10">
        <MarketingHero place={country} />
        <MarketingGallery images={country.images} />
        <MarketingPlaces place={country} url={`/city/${country.slug}/`} from={from} search={search} />
        <MarketingDeals from={from} search={search} to={country} level="city" />
        <MarketingGraph search={search} />
        <MarketingMap search={search} to={country} from={from} googleMapId={googleMapId} googleApiKey={googleApiKey} />
        <MarketingWeather to={country} apiUrl={apiUrl} />
      </div>
        
    </Layout>
  );
}
