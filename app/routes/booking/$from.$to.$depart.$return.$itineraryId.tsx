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
import { MapComponent } from "~/components/section/page/search";
import { MapRoute } from "~/components/section/map/map-route";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
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
    return: params.return || "",
    tripType: "return",
  };

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    headerImage: headerImage[0],
    query: {
      from,
      to,
      depart: params.depart || "",
      return: params.return || "",
    },
    url: {
      from: params.from,
      to: params.to,
      depart: params.depart,
      return: params.return,
      itineraryId: params.itineraryId,
    },
    oldQuery,
  };
};

export default function Search() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
    query,
    url,
    headerImage,
    oldQuery,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    query: QueryPlace;
    url: FlightUrl;
    headerImage: string;
    oldQuery: OldQuery;
  } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>({
    from: query.from.entityId,
    to: query.to.entityId,
    depart: query.depart,
    return: query.return,
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
            link: "/flight-search",
          },
          {
            name: `${query.from.name} to ${query.to.name}`,
            link: `/search/${query.from.iata}/${query.to.iata}/${query.depart}/${query.return}`,
          },
          {
            name: `Flight Details`,
          },
        ]}
      />
      <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
        <MapRoute
          flightQuery={query}
          googleMapId={googleMapId}
          googleApiKey={googleApiKey}
          key="map-component"
          height={500}
          itineraryId={url.itineraryId}
          apiUrl={apiUrl}
        />
      </div>
      <FlightDetails
        url={url}
        query={query}
        apiUrl={apiUrl}
        itineraryId={url.itineraryId}
      />
      <HotelList query={query} apiUrl={apiUrl} />
    </div>
  );
}
