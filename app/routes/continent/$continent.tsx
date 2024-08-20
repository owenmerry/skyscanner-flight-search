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
import { getImages } from "~/helpers/sdk/query";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { MarketingDeals } from "~/components/section/marketing/marketing-deals";

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const continent = getPlaceFromSlug(params.continent || "", "PLACE_TYPE_CONTINENT");
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const continentImages = await getImages({
    apiUrl,
    query: `${continent ? continent.name : ''}`,
  });
  const from = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LHR");
  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: from.entityId,
      to: "anywhere",
      tripType: "return",
    },
    month: 8,
    year: 2024,
    endMonth: 12,
    endYear: 2024,
  });
  const search = indicativeSearch.quotes;

  return json({
    apiUrl,
    continent,
    continentImages,
    from,
    search,
  });
};

export default function SEOAnytime() {
  const {
    continent,
    continentImages,
    from,
    search,
  }: {
    apiUrl: string;
    continent: Place;
    from: Place;
    continentImages: string[],
    search: IndicativeQuotesSDK[],
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full bg-top bg-cover bg-no-repeat h-[60rem]"
        style={{backgroundImage: `url(${continentImages[0]})`}}>
           <div className="opacity-80 bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
           <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
        </div>
      </div>
      <div className="p-8 text-center relative z-10">
        <MarketingHero place={continent} />
        <MarketingGallery images={continentImages} />
        <MarketingPlaces place={continent} url='/country/' from={from} search={search} />
        <MarketingDeals from={from} search={search} to={continent} />
      </div>
        
    </Layout>
  );
}
