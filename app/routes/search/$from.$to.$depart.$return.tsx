import { useEffect, useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { getImages } from "~/helpers/sdk/query";
import { useLoaderData } from "@remix-run/react";
import { getEntityIdFromIata, getPlaceFromEntityId } from "~/helpers/sdk/place";
import { Spinner } from "flowbite-react";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { HeroPage } from "~/components/section/hero/hero-page";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { Query, QueryPlace } from "~/types/search";
import { getCountryEntityId } from "~/helpers/sdk/data";
import type { Place } from "~/helpers/sdk/place";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { waitSeconds } from "~/helpers/utils";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import {
  FlightHotelBundle,
  MapComponent,
  SearchGraphs,
} from "~/components/section/page/search";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
} from "~/helpers/sdk/flight/flight-sdk";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { CompetitorCheck } from "~/components/section/competitor-check/competitor-check";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  //exit
  if (!params.from || !params.to) return;

  //get locations
  const from = getEntityIdFromIata(params.from);
  const to = getEntityIdFromIata(params.to);

  //query
  const fromPlace = getPlaceFromIata(params.from);
  const toPlace = getPlaceFromIata(params.to);
  if (!fromPlace || !toPlace) return {};
  const flightParams: Query = {
    from: fromPlace.entityId || "",
    fromIata: fromPlace.iata,
    fromText: fromPlace.name,
    to: toPlace.entityId || "",
    toIata: toPlace.iata,
    toText: toPlace.name,
    depart: params.depart || "",
    return: params.return || "",
    tripType: "return",
  };

  //explore
  const flightQuery: QueryPlace = {
    from: fromPlace,
    to: toPlace,
    depart: params.depart || "",
    return: params.return || "",
  };
  const country = getPlaceFromEntityId(
    getCountryEntityId(flightQuery.to.entityId)
  );

  //images
  const fromImage = await getImages({
    apiUrl,
    query: `${toPlace.name}${country ? `, ${country.name}` : ""}`,
  });

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    params,
    flightParams,
    flightQuery,
    headerImage: fromImage[0] || "",
    country,
  };
};

export default function Search() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
    flightParams,
    flightQuery,
    headerImage,
    country,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    flightParams: Query;
    flightQuery: QueryPlace;
    headerImage: string;
    country: Place;
  } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<
    SearchSDK | { error: string } | undefined
  >();
  const [searchHotel, setSearchHotel] =
    useState<SkyscannerAPIHotelSearchResponse>();
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(flightParams);
  const [image, setImage] = useState(headerImage);
  const sessionToken =
    search && "sessionToken" in search ? search.sessionToken : "";

  useEffect(() => {
    setLoading(true);
    runCreateSearch();
    runHotel();
    runIndicative();
  }, []);

  const runHotel = async () => {
    const hotelSearch = await skyscanner().hotel({
      apiUrl,
      query: {
        from: query.from,
        to: flightQuery.to.entityId,
        depart: query.depart,
        return: query.return,
        tripType: "return",
      },
    });

    if ("error" in hotelSearch.search) return;
    if (hotelSearch.search.meta.final_status !== "COMPLETED") {
      await waitSeconds(3);
      runHotel();
    }

    setSearchHotel(hotelSearch.search);
  };

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: query.from,
        to: query.to,
        tripType: "return",
      },
      month: Number(query.depart.split("-")[1]),
      year: Number(query.depart.split("-")[0]),
      groupType: "date",
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
  };

  const runCreateSearch = async () => {
    const flightSearch = await getFlightLiveCreate({
      apiUrl,
      query: {
        from: flightQuery.from,
        to: flightQuery.to,
        depart: flightQuery.depart || "",
        return: flightQuery.return,
      },
    });
    if ("error" in flightSearch) return;

    setSearch(flightSearch);

    if (
      "status" in flightSearch &&
      flightSearch.status === "RESULT_STATUS_COMPLETE"
    ) {
      setLoading(false);
    } else {
      runPoll(flightSearch.sessionToken);
    }
  };

  const runPoll = async (sessionToken: string) => {
    const res = await getFlightLivePoll({
      apiUrl,
      token: sessionToken,
      wait: 1,
    });

    if ("error" in res) {
      runPoll(sessionToken);

      return;
    }
    setError("");

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      if (res.action !== "RESULT_ACTION_NOT_MODIFIED") setSearch(res);
      runPoll(sessionToken);
    } else {
      setSearch(res);
      setLoading(false);
    }
  };

  return (
    <div>
      <HeroPage
        apiUrl={apiUrl}
        buttonLoading={false}
        flightDefault={query}
        backgroundImage={image}
        flightFormChangeSearch
      />
      <Breadcrumbs
        items={[
          {
            name: "Flight Search",
            link: "/flight-search",
          },
          {
            name: `${flightQuery.from.name} to ${flightQuery.to.name}`,
          },
        ]}
      />
      <div className="bg-white dark:bg-gray-900">
        <div className="md:flex justify-between mx-4 max-w-screen-xl bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <div
            className="md:hidden border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 cursor-pointer dark:text-white dark:border-gray-800"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </div>
          <div
            className={`${
              showFilters ? "" : "hidden"
            } xl:w-[400px] md:block max-w-none`}
          >
            <div className="sticky top-0 p-2 md:h-screen md:overflow-y-scroll">
              <FiltersDefault
                flights={search && "error" in search ? undefined : search}
                onFilterChange={(filters) => setFilters(filters)}
                query={flightQuery}
              />
              <div className="mt-4">
                <MapComponent
                  flightQuery={flightQuery}
                  googleMapId={googleMapId}
                  googleApiKey={googleApiKey}
                  key="map-component"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:ml-2">
            <div className="mb-2">
              {/* <FlightHotelBundle search={search} searchHotel={searchHotel} /> */}
              <CompetitorCheck
                query={flightQuery}
                apiUrl={apiUrl}
                skyscannerSearch={
                  search && "error" in search ? undefined : search
                }
              />
              <SearchGraphs
                search={searchIndicative}
                query={flightQuery}
                clickToShow
              />
            </div>
            {loading ? (
              <div className="sticky top-0 z-20 text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
                <Spinner className="mr-2" /> Loading More Prices & Flights...
              </div>
            ) : (
              ""
            )}
            {!search || error !== "" ? (
              <div className="dark:text-white"> {error}</div>
            ) : (
              <FlightResultsDefault
                flights={"error" in search ? undefined : search}
                filters={filters}
                query={flightQuery}
                apiUrl={apiUrl}
                googleApiKey={googleApiKey}
                googleMapId={googleMapId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
