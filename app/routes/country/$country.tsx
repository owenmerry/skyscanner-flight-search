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

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const from = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LHR");
  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: from.entityId,
      to: country ? country.entityId : 'anywhere',
      tripType: "return",
    },
    month: 8,
    year: 2024,
    endMonth: 12,
    endYear: 2024,
  });
  const search = indicativeSearch.quotes;

  return json({
    country,
    from,
    search,
  });
};

export default function SEOAnytime() {
  const {
    country,
    from,
    search,
  }: {
    country: Place;
    from: Place;
    search: IndicativeQuotesSDK[];
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
      <div className="p-8 text-center relative z-10">
        <MarketingHero place={country} />
        <MarketingGallery images={country.images} />
        <MarketingPlaces place={country} url={`/city/${country.slug}/`} from={from} search={search} />
        <MarketingDeals from={from} search={search} to={country} level="city" />
      </div>
        
    </Layout>
  );
}
