import { useEffect, useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet, useLocation } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { HeroPage } from "~/components/ui/hero/hero-page";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getImagesFromParents } from "~/helpers/sdk/images";

interface Query {
  from: string;
  fromIata: string;
  fromText: string;
  to: string;
  toIata: string;
  toText: string;
  depart: string;
  return: string;
  tripType: string;
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  //exit
  if (!params.from || !params.to)
    return {
      apiUrl,
    };

  //get locations
  const fromPlace = getPlaceFromIata(params.from);
  const toPlace = getPlaceFromIata(params.to);

  if (!fromPlace || !toPlace) return {};

  const flightParams: Query = {
    from: params.from || "",
    fromIata: fromPlace.iata,
    fromText: fromPlace.name,
    to: params.to || "",
    toIata: toPlace.iata,
    toText: toPlace.name,
    depart: params.depart || "",
    return: params.return || "",
    tripType: "return",
  };

  const parentImages = getImagesFromParents(toPlace.entityId);

  return {
    apiUrl,
    flightParams,
    parentImages,
  };
};

export default function SearchFlight() {
  const {
    apiUrl,
    flightParams,
    parentImages,
  }: { apiUrl: string; flightParams: Query; parentImages: string[] } =
    useLoaderData();
  const [image, setImage] = useState(parentImages[0]);
  const { pathname } = useLocation();

  useEffect(() => {
    const toPlace = getPlaceFromIata(flightParams.to);
    const parentImages = getImagesFromParents(toPlace.entityId);
    setImage(parentImages[0]);
  }, [pathname]);

  return (
    <div>
      <Layout selectedUrl="/search-flight">
        <HeroPage
          apiUrl={apiUrl}
          buttonLoading={false}
          flightDefault={flightParams}
          backgroundImage={parentImages[0]}
        />
        <Outlet key={pathname} />
      </Layout>
    </div>
  );
}
