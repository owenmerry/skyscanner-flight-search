import { Link } from "@remix-run/react";
import { getFlightSearch } from "~/helpers/map";
import type { QueryPlace } from "~/types/search";
import { Map } from "~/components/ui/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import type { Place } from "~/helpers/sdk/place";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { Loading } from "~/components/ui/loading";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
  IndicitiveQuoteDate,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPrice } from "~/helpers/sdk/price";
import { format } from "date-fns";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { useEffect, useState } from "react";
import { DatesGraph } from "../dates-graph/dates-graph";
import {
  KiwiSearchResponse,
  fetchFlightsKiwi,
} from "~/helpers/services/travel-competitors";
import { IoLocationSharp } from "react-icons/io5";

export const MapComponent = ({
  googleApiKey,
  googleMapId,
  flightQuery,
  height = 300,
  clickToShow = false,
}: {
  googleApiKey: string;
  googleMapId: string;
  flightQuery: QueryPlace;
  height?: number;
  clickToShow?: boolean;
}) => {
  const [showMap, setShowMap] = useState(clickToShow ? false : true);

  return (
    <div className="">
      {clickToShow ? (
        <div
          className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 cursor-pointer dark:text-gray-500 dark:border-gray-800 grayscale hover:grayscale-0 hover:bg-gray-800 hover:dark:text-white"
          onClick={() => setShowMap(!showMap)}
        >
          {/* <svg
            className="w-4 h-4 text-gray-800 dark:text-gray-500 inline-block mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
              clip-rule="evenodd"
            />
          </svg> */}
          🗺️ Map View
        </div>
      ) : (
        ""
      )}
      {showMap ? (
        <div className="mb-2">
          <Wrapper apiKey={googleApiKey} key="map-component-wrapper">
            <Map
              googleMapId={googleMapId}
              key="map-component-map"
              center={{
                lat: flightQuery.to.coordinates.latitude,
                lng: flightQuery.to.coordinates.longitude,
              }}
              height={`${height}px`}
              zoom={5}
              line={[
                {
                  lat: flightQuery.from.coordinates.latitude,
                  lng: flightQuery.from.coordinates.longitude,
                },
                {
                  lat: flightQuery.to.coordinates.latitude,
                  lng: flightQuery.to.coordinates.longitude,
                },
              ]}
              markers={getFlightSearch([flightQuery.to, flightQuery.from])}
            />
          </Wrapper>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export const SearchGraphs = ({
  search,
  searchReturn,
  query,
  clickToShow,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  searchReturn?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
  clickToShow?: boolean;
}) => {
  const [showGraph, setShowGraph] = useState(clickToShow ? false : true);
  return (
    <div className="border-2 border-slate-100 rounded-lg mb-2  dark:border-gray-800 ">
      {clickToShow ? (
        <div
          className="py-4 px-4 grid grid-cols-2 dark:text-white cursor-pointer"
          onClick={() => setShowGraph(!showGraph)}
        >
          {/* <svg
            className="w-4 h-4 text-gray-800 dark:text-gray-500 inline-block mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
            />
          </svg> */}
          <div>📊 Graph View </div>
          <div className="text-right">
            {showGraph ? (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white inline-block"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m16 14-4-4-4 4"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white inline-block"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m8 10 4 4 4-4"
                />
              </svg>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {showGraph ? (
        <div className="py-4 px-4">
          <h2 className="font-bold mb-2 text-lg">Departure Dates</h2>
          <DatesGraph search={search} query={query} hasMaxWidth />
          {searchReturn ? (
            <>
              <h2 className="font-bold mb-2 text-lg">Return Dates</h2>
              <DatesGraph search={search} query={query} hasMaxWidth />
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export const FlightHotelBundle = ({
  search,
  searchHotel,
}: {
  search?: SearchSDK | { error: string };
  searchHotel?: SkyscannerAPIHotelSearchResponse;
}) => {
  return (
    <div className="mb-2 p-4 text-white bg-blue-700 rounded-md text-lg">
      {search && searchHotel?.results?.average_min_price ? (
        <>
          <span className="mr-4 font-bold">
            🏷️ Hotel and Flight Bundle: £
            {!search || (search && "error" in search)
              ? undefined
              : (
                  +search.stats.minPrice.replace("£", "") +
                  +(searchHotel?.results?.average_min_price || 0)
                ).toFixed(2)}
          </span>
          <span className="text-sm">
            Flight:{" "}
            {!search || (search && "error" in search)
              ? undefined
              : search.stats.minPrice}
          </span>
          <>
            <span className="mx-2">+</span>
            <span className="text-sm">
              Hotel: £{searchHotel?.results?.average_min_price}
            </span>
          </>
        </>
      ) : (
        <div className="text-sm">
          <span className="mr-4">
            <Loading />
          </span>
          Loading Flight and Hotel Deal...
        </div>
      )}
    </div>
  );
};

export const ExploreDates = ({
  search,
  query,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
}) => {
  const sortByPrice = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
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
          Options:{" "}
          {sortByPrice(
            search.content.groupingOptions.byDate.quotesOutboundGroups
          ).map((quoteKey) => {
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
              return `/search/${query.from.iata}/${query.to.iata}/${
                query.depart
              }${query.return ? `/${query.return}` : ""}`;
            };
            const getDateFormatted = (date: string) => {
              const dateObject = new Date(date);

              return format(dateObject, "EEE,d MMM");
            };
            const departDateYYYYMMDD = getDateDisplay(
              quote.outboundLeg.departureDateTime
            );
            const returnDateYYYYMMDD = getDateDisplay(
              quote.inboundLeg.departureDateTime
            );

            return (
              <a
                className="inline-block bg-slate-50 font-semibold mr-2 mb-2 p-2 rounded dark:bg-gray-800 text-slate-400 hover:dark:bg-gray-700"
                href={getLink({
                  ...query,
                  depart: departDateYYYYMMDD,
                  ...(query.return ? { return: returnDateYYYYMMDD } : {}),
                })}
              >
                {getDateFormatted(departDateYYYYMMDD)}
                {query.return ? (
                  <> to {getDateFormatted(returnDateYYYYMMDD)}</>
                ) : (
                  ""
                )}{" "}
                from {getPrice(quote.minPrice.amount, quote.minPrice.unit)}
              </a>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const ExplorePage = ({ country }: { country?: Place }) => {
  return (
    <>
      {country ? (
        <div className="mt-2 mb-2">
          <div className="relative h-40 bg-cover bg-center w-full rounded-lg" style={{backgroundImage: `url(${country.images[0]})`}}>
          <div className="absolute bottom-0 left-0 p-2">
          <Link
            to={`/country/${country.slug}`}
            target="_blank"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            <IoLocationSharp className="mr-2" />
             Explore {country.name}{" "}
          </Link>

          </div>
          </div>
          
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const ExplorePageButton = ({ country, city }: { country?: Place, city?: Place }) => {
  return (
    <>
      {country ? (
        <div>
          <Link
            to={city ? `/city/${country.slug}/${city.slug}` : `/country/${country.slug}`}
            target="_blank"
            className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
          >
            <IoLocationSharp className="mr-2" />
             Explore {city ? city.name : country.name}{" "}
          </Link>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
