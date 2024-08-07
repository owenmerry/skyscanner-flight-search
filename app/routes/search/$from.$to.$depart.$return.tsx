import { useEffect, useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { getImages } from "~/helpers/sdk/query";
import { useLoaderData } from "@remix-run/react";
import { getEntityIdFromIata, getPlaceFromEntityId } from "~/helpers/sdk/place";
import { Loading } from "~/components/ui/loading/";
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
import { CarHireList } from "~/components/section/car-hire-list";
import { HotelList } from "~/components/section/hotels-list";
import { FlightControlsApp } from "~/components/ui/flight-controls/flight-controls-app";
import { Box, LinearProgress } from "@mui/material";
import { FiltersDrawer } from "~/components/ui/drawer/drawer-filter";

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
        backgroundImage={image}
        flightFormChangeSearch
        showFlightForm={false}
      /> */}
      {/* <Breadcrumbs
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
          <div className="relative z-10 md:hidden bg-white dark:bg-gray-900 border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 cursor-pointer dark:text-white dark:border-gray-800">
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
          </div>
          <div className={`hidden md:block w-96 p-2`}>
            <FiltersDefault
              flights={search && "error" in search ? undefined : search}
              onFilterChange={(filters) => setFilters(filters)}
              query={flightQuery}
            />
          </div>
          <div className="w-full md:ml-2">
            {/* <FlightHotelBundle search={search} searchHotel={searchHotel} /> */}
            {/* <CompetitorCheck
                query={flightQuery}
                apiUrl={apiUrl}
                skyscannerSearch={
                  search && "error" in search ? undefined : search
                }
              />
              <div className="mt-4">
                <MapComponent
                  flightQuery={flightQuery}
                  googleMapId={googleMapId}
                  googleApiKey={googleApiKey}
                  key="map-component"
                />
              </div>
              <SearchGraphs
                search={searchIndicative}
                query={flightQuery}
                clickToShow
              /> */}
            <FlightResultsDefault
              flights={search && "error" in search ? undefined : search}
              filters={filters}
              query={flightQuery}
              apiUrl={apiUrl}
              googleApiKey={googleApiKey}
              googleMapId={googleMapId}
              loading={!!!search}
              headerSticky={false}
            />
            {/* {!search || error !== "" ? (
              <div className="dark:text-white"> {error}</div>
            ) : (
              <>
                
                {/* <CarHireList
                  query={{
                    from: flightQuery.from.entityId,
                    depart: flightQuery.depart,
                    return: flightQuery.return,
                  }}
                  apiUrl={apiUrl}
                />
                <HotelList query={flightQuery} apiUrl={apiUrl} /> }
              </>
            )} */}
          </div>
          <div className={`${showFilters ? "" : "hidden"}  md:block w-96 p-2`}>
            <CompetitorCheck
              query={flightQuery}
              apiUrl={apiUrl}
              skyscannerSearch={
                search && "error" in search ? undefined : search
              }
            />
            <FlightHotelBundle search={search} searchHotel={searchHotel} />
          </div>
        </div>
      </div>
    </div>
  );
}
