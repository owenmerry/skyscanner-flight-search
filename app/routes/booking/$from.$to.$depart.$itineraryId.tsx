import { useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroPage } from "~/components/section/hero/hero-page";
import { HotelList } from "~/components/section/hotels-list";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import type { Place } from "~/helpers/sdk/geo/geo-sdk";
import type { FlightQuery, FlightUrl } from "~/types/search";
import { FlightDetails } from "~/components/section/flight-details";
import { getImages } from "~/helpers/sdk/query";
import type { Query as OldQuery, QueryPlace } from "~/types/search";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const from = getPlaceFromIata(params.from || "");
  const to = getPlaceFromIata(params.to || "");
  const headerImage = await getImages({
    apiUrl,
    query: to ? to.name : "",
  });
  const oldQuery: OldQuery = {
    from: params.from || "",
    fromIata: from ? from.iata : "",
    fromText: from ? from.name : "",
    to: params.to || "",
    toIata: to ? to.iata : "",
    toText: to ? to.name : "",
    depart: params.depart || "",
    tripType: "return",
  };

  return {
    apiUrl,
    headerImage: headerImage[0],
    query: {
      from,
      to,
      depart: params.depart || "",
    },
    url: {
      from: params.from,
      to: params.to,
      depart: params.depart,
      itineraryId: params.itineraryId,
    },
    oldQuery,
  };
};

export default function Search() {
  const {
    apiUrl,
    query,
    url,
    headerImage,
    oldQuery,
  }: {
    apiUrl: string;
    query: QueryPlace;
    url: FlightUrl;
    headerImage: string;
    oldQuery: OldQuery;
  } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>({
    from: query.from.entityId,
    to: query.to.entityId,
    depart: query.depart,
    tripType: query.return ? "return" : "single",
  });

  return (
    <div>
      <HeroPage
        apiUrl={apiUrl}
        backgroundImage={headerImage}
        flightDefault={oldQuery}
        showFlightForm={false}
      />
      <Breadcrumbs
        items={[
          {
            name: "Flight Search",
            link: "/search",
          },
          {
            name: `${query.from.name} to ${query.to.name}`,
            link: `/search/${query.from.iata}/${query.to.iata}/${query.depart}/`,
          },
          {
            name: `Flight Details`,
          },
        ]}
      />
      check this:{query.from.iata} to {query.to.iata}
      <FlightDetails
        url={url}
        query={query}
        apiUrl={apiUrl}
        itineraryId={url.itineraryId}
      />
      <HotelList query={search} apiUrl={apiUrl} />
    </div>
  );
}
