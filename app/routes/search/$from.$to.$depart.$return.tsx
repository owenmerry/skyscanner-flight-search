import { useEffect, useState } from "react";
import {
  json,
  V2_MetaFunction,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { getImages } from "~/helpers/sdk/query";
import { useLoaderData } from "@remix-run/react";
import { getPlaceFromEntityId, getPlaceFromIata } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { Query, QueryPlace } from "~/types/search";
import { getCityEntityId, getCountryEntityId } from "~/helpers/sdk/data";
import type { Place } from "~/helpers/sdk/place";
import type { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { waitSeconds } from "~/helpers/utils";
import {
  ExplorePage,
  ExplorePageButton,
  FlightHotelBundle,
} from "~/components/section/page/search";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
} from "~/helpers/sdk/flight/flight-sdk";
import type { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { CompetitorCheck } from "~/components/section/competitor-check/competitor-check";
import { FlightControlsApp } from "~/components/ui/flight-controls/flight-controls-app";
import { Box, LinearProgress } from "@mui/material";
import { FiltersDrawer } from "~/components/ui/drawer/drawer-filter";
import { PriceGraph } from "~/components/ui/graph/price-graph";
import { GraphDrawer } from "~/components/ui/drawer/drawer-graph";
import { actionsSaveFlight } from "~/actions/save-flight";
import { BarChartHistoryPrice } from "~/components/ui/bar-chart/bar-chart-history-price";
import moment from "moment";
import type { IndicativeSDK } from "~/helpers/sdk/indicative/indicative-sdk";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { FlightHistorySDK } from "~/helpers/sdk/flight-history/flight-history-sdk";
import { actionsSearchForm } from "~/actions/search-form";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { handleOutdatedDate } from "~/helpers/url";
import { Message } from "~/components/section/message/message.component";
import { MapRoutes } from "~/components/section/map/map-routes";
import { CarHireList } from "~/components/section/car-hire-list";
import { HotelList } from "~/components/section/hotels-list";
import { MapStatic } from "~/components/section/map/map-static";

export const meta: V2_MetaFunction = ({ data }) => {
  const defaultMeta = [
    {
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
    flightQuery,
    indicativeSearchFlight,
    flightHistoryPrices,
  }: {
    flightQuery: QueryPlace;
    indicativeSearchFlight: IndicativeQuotesSDK[];
    flightHistoryPrices: FlightHistorySDK;
  } = data;
  console.log("flightHistoryPrices");
  console.log(flightHistoryPrices);
  const historyPrice =
    "error" in flightHistoryPrices
      ? undefined
      : flightHistoryPrices.length > 0 &&
        flightHistoryPrices[flightHistoryPrices.length - 1].price !== null
      ? `£${flightHistoryPrices[flightHistoryPrices.length - 1].price.toFixed(
          0
        )}`
      : undefined;
  const indicativePrice =
    indicativeSearchFlight.length > 0
      ? indicativeSearchFlight[0].price.display
      : undefined;
  const flightPrice = historyPrice || indicativePrice;

  return [
    {
      title: `${
        flightPrice ? `${flightPrice} ` : ""
      }Cheap Return Flights from ${flightQuery.from.name} (${
        flightQuery.from.iata
      }) to ${flightQuery.to.name} (${flightQuery.to.iata}) in ${moment(
        flightQuery.depart
      ).format("MMMM")}`,
    },
    {
      name: "description",
      content: `Discover flights from ${flightQuery.from.name} (${flightQuery.from.iata}) to ${flightQuery.to.name} (${flightQuery.to.iata}) return flights with maps, images and suggested must try locations`,
    },
    {
      name: "og:image",
      content: `https://flights.owenmerry.com/image?from=${flightQuery.from.iata}&to=${flightQuery.to.iata}`,
    },
    { tagName: "link", rel: "canonical", href: data.canonicalUrl },
    noIndex,
  ];
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  //exit
  if (!params.from || !params.to) return;

  //query
  const fromPlace = getPlaceFromIata(params.from.toUpperCase());
  const toPlace = getPlaceFromIata(params.to.toUpperCase());
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

  // Call the handler function to check the date
  const redirectResponse = handleOutdatedDate(flightQuery);

  if (redirectResponse) {
    // If the function returns a redirect, return it immediately
    return redirectResponse;
  }

  // getFlightLiveCreate({
  //   apiUrl,
  //   query: {
  //     from: flightQuery.from,
  //     to: flightQuery.to,
  //     depart: flightQuery.depart || "",
  //     return: flightQuery.return,
  //   },
  // });
  const country = getPlaceFromEntityId(
    getCountryEntityId(flightQuery.to.entityId)
  );
  const city = getPlaceFromEntityId(getCityEntityId(flightQuery.to.entityId));

  //images
  const fromImage = await getImages({
    apiUrl,
    query: `${toPlace.name}${country ? `, ${country.name}` : ""}`,
  });

  const indicativeSearch = await skyscanner().indicative({
    apiUrl,
    query: {
      from: flightQuery.from.entityId,
      to: flightQuery.to ? flightQuery.to.entityId : "",
      tripType: "return",
    },
    month: Number(moment(flightQuery.depart).startOf("month").format("MM")),
    year: Number(moment(flightQuery.depart).startOf("month").format("YYYY")),
    groupType: "date",
  });

  const indicativeSearchFlight = indicativeSearch.quotes
    .filter((item) => item.price.raw)
    .filter(
      (item) =>
        item.query.depart === flightQuery.depart &&
        item.query.return === flightQuery.return
    )
    .sort((a, b) => (a.price.raw || 0) - (b.price.raw || 0));

  const flightHistoryPrices = await skyscanner().flightHistory({
    apiUrl,
    query: flightQuery,
  });

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
      params,
      flightParams,
      flightQuery,
      headerImage: fromImage[0] || "",
      country,
      city,
      indicativeSearch,
      indicativeSearchFlight,
      flightHistoryPrices,
      canonicalUrl,
      isPastDate: url.searchParams.get("message") === "past-date",
      flightNotFound: url.searchParams.get("message") === "flight-not-found",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    }
  );
};

export async function action({ request }: ActionArgs) {
  let action;
  action = await actionsSearchForm({ request });
  if (!action) {
    action = await actionsSaveFlight({ request });
  }

  return action;
}

export default function Search() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
    flightParams,
    flightQuery,
    country,
    city,
    isPastDate,
    flightNotFound,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    flightParams: Query;
    flightQuery: QueryPlace;
    headerImage: string;
    country: Place;
    city: Place;
    indicativeSearch: IndicativeSDK;
    indicativeSearchFlight: IndicativeSDK;
    isPastDate: boolean;
    flightNotFound: boolean;
  } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<
    SearchSDK | { error: string } | undefined
  >();
  const [searchHotel, setSearchHotel] =
    useState<SkyscannerAPIHotelSearchResponse>();
  const [filters, setFilters] = useState({});
  const [showFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [query] = useState(flightParams);
  //   const getFilteredResults = () => {
  //     if (!search || (search && "error" in search)) return;
  //     return addSearchResultFilters(search.cheapest, {
  //       ...filters,
  //     });
  //   };
  // //const filteredResults = getFilteredResults();

  useEffect(() => {
    setLoading(true);
    runCreateSearch();
    runHotel();
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
    console.log("runCreateSearch", flightSearch);
    if ("error" in flightSearch) {
      setSearch({ error: "Invalid-request" });
      setLoading(false);

      return;
    }

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
      query: flightQuery,
    });

    if ("error" in res) {
      runPoll(sessionToken);

      return;
    }

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      if (res.action !== "RESULT_ACTION_NOT_MODIFIED") setSearch(res);
      runPoll(sessionToken);
    } else {
      setSearch(res);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-30 mb-2">
        <FlightControlsApp apiUrl={apiUrl} flightDefault={query} />
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              sx={{
                backgroundColor: "rgba(0,0,0,0)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1b64f2",
                },
              }}
            />
          </Box>
        ) : (
          ""
        )}
      </div>

      {/* <HeroPage
        apiUrl={apiUrl}
        buttonLoading={false}
        flightDefault={query}
        backgroundImage={country.image}
        flightFormChangeSearch
        showFlightForm={false}
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
      /> */}
      <div className="">
        <div className="md:flex justify-between mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
          <div className="relative z-10 md:hidden bg-white dark:bg-gray-900  py-4 rounded-lg mb-2 cursor-pointer dark:text-white ">
            <div className="flex overflow-y-scroll scrollbar-hide gap-2">
              <FiltersDrawer
                onClear={() => {
                  setFilters({});
                }}
              >
                <div className="px-6 py-8">
                  <h2 className="text-2xl font-bold mb-4">Change Search</h2>
                  <FiltersDefault
                    flights={search && "error" in search ? undefined : search}
                    onFilterChange={(filters) => setFilters(filters)}
                    query={flightQuery}
                    defaultFilters={filters}
                  />
                </div>
              </FiltersDrawer>
              <GraphDrawer>
                <PriceGraph apiUrl={apiUrl} query={flightQuery} showReturn />
              </GraphDrawer>
              <ExplorePageButton country={country} />
              <ExplorePageButton country={country} city={city} />
              <div onClick={() => setShowMap(!showMap)}>Show Map</div>
            </div>
          </div>
          <div className={`hidden md:block w-96 p-2`}>
            <FiltersDefault
              flights={search && "error" in search ? undefined : search}
              onFilterChange={(filters) => setFilters(filters)}
              query={flightQuery}
            />
          </div>
          <div className="w-full md:ml-2 md:max-w-[730px]">
            {isPastDate ? (
              <Message
                title="We've Updated Your Search!"
                description="It looks like the date you selected has passed. We've updated your search for flights in 1 months time. If you'd like to search for another date, feel free to adjust the calendar above!"
              />
            ) : (
              ""
            )}
            {flightNotFound ? (
              <Message
                title="Sadly that flight has changed!"
                description="It looks like the flight you were looking for has changed. Here are some other options you might like."
              />
            ) : (
              ""
            )}
            <BarChartHistoryPrice
              query={flightQuery}
              interval="hour"
              apiUrl={apiUrl}
            />
            {showMap && search && !("error" in search) ? (
              <MapRoutes
                flightQuery={flightQuery}
                googleMapId={googleMapId}
                googleApiKey={googleApiKey}
                apiUrl={apiUrl}
                key="map-component"
                height={400}
                itineraryId={search.cheapest[0].itineraryId}
                flight={search.cheapest}
              />
            ) : (
              ""
            )}
            <FlightResultsDefault
              flights={search && "error" in search ? undefined : search}
              filters={filters}
              query={flightQuery}
              apiUrl={apiUrl}
              googleApiKey={googleApiKey}
              googleMapId={googleMapId}
              loading={!search}
              headerSticky={false}
            />

            {search &&
            !("error" in search) &&
            search?.status === "RESULT_STATUS_COMPLETE" &&
            search.cheapest.length === 0 ? (
              <Message
                title="No Flights Found"
                description="It seems there are no flights available for your search criteria. Try adjusting your filters or selecting a different date to find the best options for your trip!"
              />
            ) : (
              ""
            )}

            {search &&
            "error" in search &&
            search.error === "Invalid-request" ? (
              <>
                {flightQuery.from.entityId === flightQuery.to.entityId ? (
                  <Message
                    title="Oops! Same Departure and Arrival"
                    description="It looks like you've selected the same airport for both departure and arrival. To plan your trip, please choose different airports and give it another go!"
                    hasDismiss={false}
                  />
                ) : (
                  <Message
                    title="No Flights Found"
                    description="It seems there are no flights available for your search criteria. Try adjusting your filters or selecting a different date to find the best options for your trip!"
                    hasDismiss={false}
                  />
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className={`${showFilters ? "" : "hidden"}  md:block w-96 p-2`}>
            <div className="mb-4">
              <div>
                <MapStatic
                  altText={`Map of the flight from ${flightQuery.from.name} to ${flightQuery.to.name}`}
                  imageUrl={`https://flights.owenmerry.com/image?from=${flightQuery.from.iata}&to=${flightQuery.to.iata}`}
                  onShowMap={() => setShowMap(!showMap)}
                />
              </div>
            </div>
            <div className="mb-2">
              <GraphDrawer>
                <PriceGraph apiUrl={apiUrl} query={flightQuery} showReturn />
              </GraphDrawer>
            </div>
            <CompetitorCheck
              query={flightQuery}
              apiUrl={apiUrl}
              skyscannerSearch={
                search && "error" in search ? undefined : search
              }
            />
            <FlightHotelBundle search={search} searchHotel={searchHotel} />
            <ExplorePage country={country} />
          </div>
        </div>
        <div className="px-4 py-4">
          <CarHireList
            query={{
              from: flightQuery.to.entityId,
              depart: flightQuery.depart,
              return: flightQuery.return,
            }}
            apiUrl={apiUrl}
          />
          <HotelList query={flightQuery} apiUrl={apiUrl} />
        </div>
      </div>
    </div>
  );
}
