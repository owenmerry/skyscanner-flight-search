import { useEffect, useState } from "react";
import { json, type LoaderArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroPage } from "~/components/section/hero/hero-page";
import { HotelList } from "~/components/section/hotels-list";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getImages } from "~/helpers/sdk/query";
import type { Query as OldQuery, QueryPlace, FlightUrl } from "~/types/search";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { MapRoute } from "~/components/section/map/map-route";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type {
  FlightSDK,
  SearchSDK,
} from "~/helpers/sdk/flight/flight-functions";
import { Loading } from "~/components/ui/loading";
import { CarHireList } from "~/components/section/car-hire-list";
import { FlightDetails } from "~/components/section/flight-details/flight-details.component";
import { Panel } from "~/components/section/flight-results/flight-panel";
import { FaMapLocationDot } from "react-icons/fa6";
import { Deals } from "~/components/section/flight-results/flight-results-default";
import moment from "moment";
import { generateCanonicalUrl } from "~/helpers/canonical-url";

export const meta: V2_MetaFunction = ({ data }) => {
  const defaultMeta = {
    title: "Search for Flights | Flights.owenmerry.com",
    description: "Search for Flights | Flights.owenmerry.com",
  };
  const noIndex = { name: "robots", content: "noindex" };
  if (!data) return [defaultMeta, noIndex];
  const {
    query,
  }: {
    query: QueryPlace;
    canonicalUrl: string;
  } = data;

  return [{
    title: `Book ${query.from.name} (${query.from.iata}) to ${query.to.name} (${
      query.to.iata
    }) - Depart ${moment(query.depart).format("Do, MMMM")} and Return ${moment(
      query.return
    ).format("Do, MMMM")}`,
    description: `Discover flights from ${query.from.name} (${query.from.iata}) to ${query.to.name} (${query.to.iata}) return flights with maps, images and suggested must try locations`,
  },
  noIndex,
  { tagName: "link", rel: "canonical", href: data.canonicalUrl },
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
    return: params.return || "",
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
    if ("error" in res) return;
    const flight = res.best.filter(
      (flight) => flight.itineraryId === url.itineraryId
    );
    if (flight.length === 0) {
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
      {search && flight ? (
        <>
          <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto relative">
            <Breadcrumbs
              items={[
                {
                  name: "Flight Search",
                  link: "/flight-search",
                },
                {
                  name: `${query.from.name} to ${query.to.name}`,
                  link: `/search/${query.from.iata}/${query.to.iata}/${query.depart}/${query.return}`,
                  nofollow: true,
                },
                {
                  name: `Flight Details`,
                },
              ]}
            />
            <h2 className="mt-10 mb-8 text-2xl font-bold tracking-tight leading-none">
              Trip Details
            </h2>
            <FlightDetails flight={flight} query={query} open={true} />
            <h2 className="mt-10 mb-8 text-2xl font-bold tracking-tight leading-none">
              Route Map
            </h2>
            <Panel
              title="Map"
              icon={<FaMapLocationDot className="inline mr-2 text-blue-600" />}
              open={true}
            >
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
            </Panel>
            <h2 className="mt-10 mb-8 text-2xl font-bold tracking-tight leading-none">
              Choose a booking option
            </h2>
            <Deals flight={flight} query={query} />
            {/* Extras */}
            <CarHireList
              query={{
                from: query.to.entityId,
                depart: query.depart,
                return: query.return,
              }}
              apiUrl={apiUrl}
            />
            <HotelList query={query} apiUrl={apiUrl} />
          </div>
        </>
      ) : (
        <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
          <div className="relative z-10 max-w-screen-xl text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800 flex gap-2 items-center justify-center">
            <Loading /> Loading Flight Details and Prices...
          </div>
        </div>
      )}
    </div>
  );
}
