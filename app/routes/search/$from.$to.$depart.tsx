import { useEffect, useState } from "react";
import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { getImages } from "~/helpers/sdk/query";
import { useLoaderData } from "@remix-run/react";
import {
  Place,
  getEntityIdFromIata,
  getPlaceFromEntityId,
} from "~/helpers/sdk/place";
import { Loading } from "~/components/ui/loading";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getImagesFromParents } from "~/helpers/sdk/images";
import { HeroPage } from "~/components/section/hero/hero-page";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { Query, QueryPlace } from "~/types/search";
import { ExplorePage, MapComponent } from "~/components/section/page/search";
import { getCountryEntityId } from "~/helpers/sdk/data";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { Layout } from "~/components/ui/layout/layout";
import { DatesGraph } from "~/components/section/dates-graph/dates-graph";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
} from "~/helpers/sdk/flight/flight-sdk";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  //exit
  if (!params.from || !params.to) return;

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
    return: "",
    tripType: "",
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
  const parentImages = getImagesFromParents(toPlace.entityId);
  const fromImage = await getImages({
    apiUrl,
    query: `${toPlace.name} ${country ? country.name : ""}`,
  });

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    params,
    country,
    flightQuery,
    flightParams,
    parentImages,
    headerImage: fromImage[0] || parentImages[0] || "",
  };
};

export default function Search() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
    country,
    flightParams,
    parentImages,
    flightQuery,
    headerImage,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    flightParams: Query;
    country: Place;
    parentImages: string[];
    flightQuery: QueryPlace;
    flightSearch: SearchSDK | { error: string };
    headerImage: string;
  } = useLoaderData();
  const [search, setSearch] = useState<SearchSDK | { error: string }>();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [query, setQuery] = useState(flightParams);
  const [image, setImage] = useState(headerImage);
  //const sessionToken = "sessionToken" in search ? search.sessionToken : "";

  useEffect(() => {
    runCreate();
    runIndicative();
  }, []);

  const runCreate = async () => {
    //get search
    const searchCreate = await skyscanner().flight().create({
      apiUrl,
      query: flightQuery,
    });
    if ("error" in searchCreate) return;
    setSearch(searchCreate);
    if (searchCreate.status === "RESULT_STATUS_COMPLETE") return;
    runPoll({ sessionToken: searchCreate.sessionToken });
  };
  const runPoll = async ({ sessionToken }: { sessionToken: string }) => {
    const res = await skyscanner().flight().poll({
      apiUrl,
      token: sessionToken,
      wait: 1,
    });

    if ("error" in res) {
      runPoll({ sessionToken });

      return;
    }
    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      setSearch(res);
      runPoll({ sessionToken });
    } else {
      setSearch(res);
    }
  };

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: query.from,
        to: query.to,
        tripType: "single",
      },
      month: Number(query.depart.split("-")[1]),
      year: Number(query.depart.split("-")[0]),
      groupType: "date",
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
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
            <FiltersDefault onFilterChange={(filters) => setFilters(filters)} />
          </div>
          <div className="w-full md:ml-2">
            {search && "error" in search ? (
              <div className="dark:text-white"> {search.error}</div>
            ) : (
              <>
                <MapComponent
                  flightQuery={flightQuery}
                  googleMapId={googleMapId}
                  googleApiKey={googleApiKey}
                  key="map-component"
                />
                <ExplorePage country={country} />
                <h2 className="font-bold mb-2 text-lg">Departure Dates</h2>
                <DatesGraph
                  search={searchIndicative}
                  query={flightQuery}
                  hasMaxWidth
                />
                {search?.status !== "RESULT_STATUS_COMPLETE" ? (
                  <div className="sticky top-0 z-20 text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
                    <span className="mr-2">
                      <Loading />
                    </span>{" "}
                    Loading More Prices & Flights...
                  </div>
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
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
