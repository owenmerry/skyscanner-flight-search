import { useEffect, useState } from "react";
import { json, V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { HeroPage } from "~/components/section/hero/hero-page";
import { HotelList } from "~/components/section/hotels-list";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { FlightDetails } from "~/components/section/flight-details";
import { getImages } from "~/helpers/sdk/query";
import type { Query as OldQuery, QueryPlace, FlightUrl } from "~/types/search";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { MapRoute } from "~/components/section/map/map-route";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { Loading } from "~/components/ui/loading";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import moment from "moment";
import { FlightSDK, SearchSDK } from "~/helpers/sdk/flight/flight-functions";

export const meta: V2_MetaFunction = ({ data }) => {
  const defaultMeta = [{
    title: "Search for Flights | Flights.owenmerry.com",
  },
  {
    name: "description",
    content: "Search for Flights | Flights.owenmerry.com",
  },
  { tagName: "link", rel: "canonical", href: data.canonicalUrl },
];
  const noIndex = { name: "robots", content: "noindex" };
  if (!data) return [...defaultMeta, noIndex];
  const {
    query,
  }: {
    query: QueryPlace;
    canonicalUrl: string;
  } = data;

  return [
    {
      title: `Book ${query.from.name} (${query.from.iata}) to ${
        query.to.name
      } (${query.to.iata}) - Depart ${moment(query.depart).format("Do, MMMM")}`,
    },
    {
      name: "description",
      content: `Discover flights from ${query.from.name} (${query.from.iata}) to ${query.to.name} (${query.to.iata}) flights with maps, images and suggested must try locations`,
    },
    {
      name: "og:image",
      content: `https://flights.owenmerry.com/image?from=${query.from.iata}&to=${query.to.iata}`,
    },
    { tagName: "link", rel: "canonical", href: data.canonicalUrl },
    noIndex,
  ];
};

export const loader = async ({ params, request }: LoaderArgs) => {
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
    tripType: "return",
  };
  // url
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const canonicalUrl = generateCanonicalUrl({
    origin: url.origin,
    path: url.pathname,
    queryParams,
  });

  return json(
    {
      apiUrl,
      googleApiKey,
      googleMapId,
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
      canonicalUrl,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
};

export default function Search() {
  const [search, setSearch] = useState<SearchSDK>();
  const [flight, setFlight] = useState<FlightSDK>();
    const navigate = useNavigate();
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

  useEffect(() => {
    runSearch();
  }, []);

  const runSearch = async () => {
    const res = await skyscanner().flight().create({
      apiUrl,
      query: query,
    });
    if ("error" in res) {
      navigate(
        `/search/${query.from.iata}/${query.to.iata}/${query.depart}${
          res.error.includes("date cannot be historical")
            ? "?message=date-past"
            : ""
        }`
      );

      return;
    }
    const flight = res.best.filter(
      (flight) => flight.itineraryId === url.itineraryId
    );
    if (flight.length === 0) {
      if(res.status === "RESULT_STATUS_COMPLETE"){
        navigate(`/search/${query.from.iata}/${query.to.iata}/${query.depart}?message=flight-not-found`);
        return;
      }
      runPoll({ sessionToken: res.sessionToken });
      return;
    }
    setSearch(res);
    setFlight(flight[0]);
  };

  const runPoll = async ({ sessionToken }: { sessionToken: string }) => {
    const res = await skyscanner().flight().poll({
      apiUrl,
      token: sessionToken,
    });
    if ("error" in res) return;
    const flight = res.best.filter(
      (flight) => flight.itineraryId === url.itineraryId
    );
    if (flight.length === 0) {
      if(res.status === "RESULT_STATUS_COMPLETE"){
        navigate(`/search/${query.from.iata}/${query.to.iata}/${query.depart}?message=flight-not-found`);
        return;
      }
      runPoll({ sessionToken: res.sessionToken });
      return;
    }
    setSearch(res);
    setFlight(flight[0]);
  };

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
            link: `/search/${query.from.iata}/${query.to.iata}/${query.depart}/`,
          },
          {
            name: `Flight Details`,
          },
        ]}
      />
      {search && flight ? (
        <>
          <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
            <MapRoute
              flightQuery={query}
              googleMapId={googleMapId}
              googleApiKey={googleApiKey}
              key="map-component"
              height={500}
              itineraryId={url.itineraryId}
              apiUrl={apiUrl}
              flight={flight}
            />
          </div>
          <FlightDetails
            url={url}
            query={query}
            apiUrl={apiUrl}
            itineraryId={url.itineraryId}
            flight={flight}
            sessionToken={search.sessionToken}
          />
          <HotelList query={query} apiUrl={apiUrl} />
        </>
      ) : (
        <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
          <div className="relative z-10 text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
            Loading Flight Details and Prices... <Loading />
          </div>
        </div>
      )}
    </div>
  );
}
