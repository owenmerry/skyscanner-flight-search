import { useEffect, useState } from "react";
import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
  getImages,
} from "~/helpers/sdk/query";
import { useLoaderData } from "@remix-run/react";
import {
  Place,
  getEntityIdFromIata,
  getPlaceFromEntityId,
} from "~/helpers/sdk/place";
import { Spinner } from "flowbite-react";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import { getImagesFromParents } from "~/helpers/sdk/images";
import { HeroPage } from "~/components/section/hero/hero-page";
import { SearchSDK, skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { Query, QueryPlace } from "~/types/search";
import { ExplorePage, MapComponent } from "~/components/section/page/search";
import { getCountryEntityId } from "~/helpers/sdk/data";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { Layout } from "~/components/ui/layout/layout";
import { DatesGraph } from "~/components/section/dates-graph/dates-graph";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";

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

  //get search
  const flightSearch = await getFlightLiveCreate({
    apiUrl,
    query: {
      from,
      to,
      depart: params.depart || "",
      return: params.return,
      tripType: "",
    },
  });

  return {
    apiUrl,
    googleApiKey,
    params,
    country,
    flightSearch,
    flightQuery,
    flightParams,
    parentImages,
    headerImage: fromImage[0] || parentImages[0] || "",
  };
};

export default function Search() {
  const {
    flightSearch,
    apiUrl,
    googleApiKey,
    country,
    flightParams,
    parentImages,
    flightQuery,
    headerImage,
  }: {
    apiUrl: string;
    googleApiKey: string;
    flightParams: Query;
    country: Place;
    parentImages: string[];
    flightQuery: QueryPlace;
    flightSearch: SearchSDK | { error: string };
    headerImage: string;
  } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(flightSearch);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [error, setError] = useState(
    "error" in flightSearch ? flightSearch.error : ""
  );
  const [query, setQuery] = useState(flightParams);
  const [image, setImage] = useState(headerImage);
  const sessionToken = "sessionToken" in search ? search.sessionToken : "";

  useEffect(() => {
    setLoading(true);
    runPoll();
    runIndicative();
  }, []);

  const runPoll = async () => {
    const res = await getFlightLivePoll({
      apiUrl,
      token: sessionToken,
      wait: 1,
    });

    if ("error" in res) {
      setError(res.error);
      runPoll();

      return;
    }
    setError("");

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      setSearch(res);
      runPoll();
    } else {
      setSearch(res);
      setLoading(false);
    }
  };

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: query.from,
        to: query.to,
        depart: query.depart,
        tripType: "single",
      },
      month: Number(query.depart.split("-")[1]),
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
                <MapComponent
                  flightQuery={flightQuery}
                  googleApiKey={googleApiKey}
                  key="map-component"
                />
                <ExplorePage country={country} />
                <DatesGraph search={searchIndicative} query={flightQuery} />
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
