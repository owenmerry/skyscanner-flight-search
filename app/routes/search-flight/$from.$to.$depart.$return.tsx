import { useEffect, useState } from "react";
import type { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { FiltersDefault } from "~/components/ui/filters/filters-default";
import { FlightResultsDefault } from "~/components/ui/flight-results/flight-results-default";
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
import { getFlightSearch } from "~/helpers/map";
import { HeroPage } from "~/components/ui/hero/hero-page";
import { SearchSDK } from "~/helpers/sdk/skyscannerSDK";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { Query, QueryPlace } from "~/types/search";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getCountryEntityId } from "~/helpers/sdk/data";
import type { Place } from "~/helpers/sdk/place";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { waitSeconds } from "~/helpers/utils";
import { Loading } from "~/components/loading";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getSEODateDetails } from "~/helpers/date";
import { getPrice } from "~/helpers/sdk/price";

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
  const parentImages = getImagesFromParents(toPlace.entityId);
  const fromImage = await getImages({
    apiUrl,
    query: toPlace.name,
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
    params,
    flightSearch,
    flightParams,
    flightQuery,
    headerImage: fromImage[0] || parentImages[0] || "",
    country,
  };
};

const MapComponent = ({
  googleApiKey,
  flightQuery,
}: {
  googleApiKey: string;
  flightQuery: QueryPlace;
}) => {
  return (
    <div className="mb-2">
      <Wrapper apiKey={googleApiKey} key="map-component-wrapper">
        <Map
          key="map-component-map"
          center={{
            lat: flightQuery.to.coordinates.latitude,
            lng: flightQuery.to.coordinates.longitude,
          }}
          height="300px"
          zoom={5}
          markers={getFlightSearch([flightQuery.to, flightQuery.from])}
        />
      </Wrapper>
    </div>
  );
};

const FlightHotelBundle = ({
  search,
  searchHotel,
}: {
  search: SearchSDK | { error: string };
  searchHotel?: SkyscannerAPIHotelSearchResponse;
}) => {
  return (
    <div className="mb-2 p-4 text-white bg-blue-700 rounded-md text-lg">
      {searchHotel?.results?.average_min_price ? (
        <>
          <span className="mr-4 font-bold">
            🏷️ Hotel and Flight Bundle: £
            {"error" in search
              ? undefined
              : (
                  +search.stats.minPrice.replace("£", "") +
                  +(searchHotel?.results?.average_min_price || 0)
                ).toFixed(2)}
          </span>
          <span className="text-sm">
            Flight: {"error" in search ? undefined : search.stats.minPrice}
          </span>
          <>
            <span className="mx-2">+</span>
            <span className="text-sm">
              Hotel: £{searchHotel?.results?.average_min_price}
            </span>
          </>
        </>
      ) : (
        <>
          <span className="mr-4">
            <Loading />
          </span>
          Loading Flight and Hotel Deal...
        </>
      )}
    </div>
  );
};

const ExploreDates = ({
  search,
  query,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
}) => {
  const sortByPrice = (quoteGroups: IndicitiveQuote[]) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA: any = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB: any = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA.minPrice.amount - quoteB.minPrice.amount;
    });

    return sorted;
  };

  return (
    <>
      {search ? (
        <div className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800">
          Different Options:{" "}
          {sortByPrice(search.content.groupingOptions.byRoute.quotesGroups).map(
            (quoteKey) => {
              const quote = search.content.results.quotes[quoteKey.quoteIds[0]];
              const getDateDisplay = (date: SkyscannerDateTimeObject) => {
                const numberTwoDigits = (myNumber: number) => {
                  return ("0" + myNumber).slice(-2);
                };
                return `${date.year}-${numberTwoDigits(
                  date.month
                )}-${numberTwoDigits(date.day)}`;
              };
              const getLink = (query: QueryPlace) => {
                return `/search-flight/${query.from.iata}/${query.to.iata}/${
                  query.depart
                }${query.return ? `/${query.return}` : ""}`;
              };
              return (
                <a
                  className="bg-slate-50 font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-800 text-slate-400"
                  href={getLink({
                    ...query,
                    depart: getDateDisplay(quote.outboundLeg.departureDateTime),
                    return: getDateDisplay(quote.inboundLeg.departureDateTime),
                  })}
                >
                  {getDateDisplay(quote.outboundLeg.departureDateTime)} -{" "}
                  {getDateDisplay(quote.inboundLeg.departureDateTime)} is{" "}
                  {getPrice(quote.minPrice.amount, quote.minPrice.unit)}
                </a>
              );
            }
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const ExplorePage = ({ country }: { country?: Place }) => {
  return (
    <>
      {country ? (
        <div className="mt-2 mb-2">
          <Link
            to={`/explore/${country.slug}`}
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Explore {country.name}{" "}
          </Link>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default function Search() {
  const {
    flightSearch,
    apiUrl,
    googleApiKey,
    flightParams,
    flightQuery,
    headerImage,
    country,
  }: {
    apiUrl: string;
    googleApiKey: string;
    flightParams: Query;
    flightQuery: QueryPlace;
    flightSearch: SearchSDK | { error: string };
    headerImage: string;
    country: Place;
  } = useLoaderData();
  console.log("/search", flightSearch);
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
    console.log("/hotel", hotelSearch);
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
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
    console.log("/indicative", indicativeSearch);
  };

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
                    googleApiKey={googleApiKey}
                    key="map-component"
                  />
                  <ExplorePage country={country} />
                  <ExploreDates search={searchIndicative} query={flightQuery} />
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
                  query={query}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
