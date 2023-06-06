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

  console.log("run loader...");

  return {
    apiUrl,
    flightParams,
    parentImages,
    params,
  };
};

export default function SearchFlight() {
  const {
    apiUrl,
    flightParams,
    parentImages,
    params,
  }: {
    apiUrl: string;
    flightParams: Query;
    parentImages: string[];
  } = useLoaderData();
  const [query, setQuery] = useState(flightParams);
  const [image, setImage] = useState(parentImages[0]);
  const { pathname } = useLocation();

  useEffect(() => {
    const pathSplit = pathname.split("/");
    const fromPlace = getPlaceFromIata(pathSplit[2]);
    const toPlace = getPlaceFromIata(pathSplit[3]);
    const parentImages = getImagesFromParents(toPlace.entityId);
    setImage(parentImages[0]);

    const flightParams: Query = {
      from: pathSplit[2] || "",
      fromIata: fromPlace.iata,
      fromText: fromPlace.name,
      to: pathSplit[3] || "",
      toIata: toPlace.iata,
      toText: toPlace.name,
      depart: pathSplit[4] || "",
      return: pathSplit[5] || "",
      tripType: "return",
    };
    setQuery(flightParams);
    console.log("run effect...", pathname, params);
  }, [pathname]);

  return (
    <div>
      <Layout selectedUrl="/search-flight">
        <HeroPage
          apiUrl={apiUrl}
          buttonLoading={false}
          flightDefault={query}
          backgroundImage={image}
          key={`hero-${pathname}`}
        />
        {pathname}
        <Outlet key={`outlet-${pathname}`} />
      </Layout>
    </div>
  );
}
