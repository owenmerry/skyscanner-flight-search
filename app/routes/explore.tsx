import type { LoaderFunction } from "@remix-run/node";
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

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const exploreImages = await getImages({
    apiUrl,
    query: `Summer Holidays`,
  });
  const fromCookie = cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LON");
  const from = fromCookie || getPlaceFromIata("LON");
  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: from.entityId,
      to: "anywhere",
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
    exploreImages,
    from,
    search,
  });
};

export default function SEOAnytime() {
  const {
    exploreImages,
    from,
    search,
  } : {
    from: Place;
    exploreImages: string[];
    search: IndicativeQuotesSDK[];
  } = useLoaderData();

  return (
    <Layout selectedUrl="/explore">
      <div className="relative">
        <div
          className="absolute top-0 left-0 w-full bg-top bg-cover bg-no-repeat h-[60rem]"
          style={{ backgroundImage: `url(${exploreImages[0]})` }}
        >
          <div className="opacity-80 bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
          <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
        </div>
      </div>
      <div className="text-center relative z-10">
        <MarketingHeroExplore />
        <MarketingGallery images={exploreImages} />
        <MarketingPlaces url="/continent/" from={from} search={search} />
        <MarketingDeals from={from} search={search} />
        <MarketingGraph search={search} />
      </div>
    </Layout>
  );
}
