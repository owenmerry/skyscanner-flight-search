import { useEffect, useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
  getImages,
} from "~/helpers/sdk/query";
import { useLoaderData, Link } from "@remix-run/react";
import { getEntityIdFromIata, getPlaceFromEntityId } from "~/helpers/sdk/place";
import { Spinner } from "flowbite-react";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getImagesFromParents } from "~/helpers/sdk/images";
import { HeroPage } from "~/components/section/hero/hero-page";
import { SearchSDK } from "~/helpers/sdk/skyscannerSDK";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { Query, QueryPlace } from "~/types/search";
import { getCountryEntityId } from "~/helpers/sdk/data";
import type { Place } from "~/helpers/sdk/place";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { waitSeconds } from "~/helpers/utils";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import {
  ExploreDates,
  ExplorePage,
  FlightHotelBundle,
  MapComponent,
} from "~/components/section/page/search";
import { Layout } from "~/components/ui/layout/layout";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { DatesGraph } from "~/components/section/dates-graph/dates-graph";

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

  console.log("country", country);

  //images
  const parentImages = getImagesFromParents(toPlace.entityId);
  const fromImage = await getImages({
    apiUrl,
    query: `${toPlace.name}${country ? `, ${country.name}` : ""}`,
  });

  //get search
  const flightSearch = await getFlightLiveCreate({
    apiUrl,
    query: {
      from,
      to,
      depart: params.depart || "",
      return: params.return,
      tripType: "return",
    },
  });

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    params,
    flightSearch,
    flightParams,
    flightQuery,
    headerImage: fromImage[0] || parentImages[0] || "",
    country,
  };
};

export default function Search() {
  const {
    flightSearch,
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
    flightSearch: SearchSDK | { error: string };
    headerImage: string;
    country: Place;
  } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(flightSearch);
  const [searchHotel, setSearchHotel] =
    useState<SkyscannerAPIHotelSearchResponse>();
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(
    "error" in flightSearch ? flightSearch.error : ""
  );
  const [query, setQuery] = useState(flightParams);
  const [image, setImage] = useState(headerImage);
  const sessionToken = "sessionToken" in search ? search.sessionToken : "";

  useEffect(() => {
    setLoading(true);
    runPoll();
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
        depart: query.depart,
        return: query.return,
        tripType: "return",
      },
      month: Number(query.depart.split("-")[1]),
      year: Number(query.depart.split("-")[0]),
      groupType: "date",
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
  };

  const runPoll = async () => {
    const res = await getFlightLivePoll({
      apiUrl,
      token: sessionToken,
      wait: 1,
    });

    if ("error" in res) {
      //setError(res.error);
      runPoll();

      return;
    }
    setError("");

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      if (res.action !== "RESULT_ACTION_NOT_MODIFIED") setSearch(res);
      runPoll();
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
            <FiltersDefault onFilterChange={(filters) => setFilters(filters)} />
          </div>
          <div className="w-full md:ml-2">
            {error !== "" ? (
              <div className="dark:text-white"> {error}</div>
            ) : (
              <>
                <div className="mb-2">
                  <FlightHotelBundle
                    search={search}
                    searchHotel={searchHotel}
                  />
                  <MapComponent
                    flightQuery={flightQuery}
                    googleMapId={googleMapId}
                    googleApiKey={googleApiKey}
                    key="map-component"
                  />
                  <ExplorePage country={country} />
                  <DatesGraph
                    search={searchIndicative}
                    query={flightQuery}
                    hasMaxWidth
                  />
                  <DatesGraph
                    search={searchIndicative}
                    query={flightQuery}
                    hasMaxWidth
                    isReturn
                  />
                </div>
                {loading ? (
                  <div className="text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
                    <Spinner className="mr-2" /> Loading More Prices &
                    Flights...
                  </div>
                ) : (
                  ""
                )}
                <FlightResultsDefault
                  flights={"error" in search ? undefined : search}
                  filters={filters}
                  query={flightQuery}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
