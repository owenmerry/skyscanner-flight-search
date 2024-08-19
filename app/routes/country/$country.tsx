import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromSlug, getPlaceFromIata } from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { userPrefs } from "~/helpers/cookies";
import { MarketingHero } from "~/components/section/marketing/marketing-hero";
import { MarketingGallery } from "~/components/section/marketing/marketing-gallery";
import { ExploreEverywhere } from "~/components/section/explore/explore-everywhere";

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  return json({
    apiUrl,
    country,
    from: cookie.from ? JSON.parse(cookie.from) : getPlaceFromIata("LHR"),
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    country,
    from,
  }: {
    apiUrl: string;
    country: Place;
    from: Place;
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
        <MarketingHero country={country} />
        <MarketingGallery images={country.images} />
        <ExploreEverywhere
        title={`Best ${country.name} Flights from ${from.name}`}
        fromPlace={from}
        toPlace={country}
        apiUrl={apiUrl}
      />
      </div>
        
    </Layout>
  );
}
