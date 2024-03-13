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

export const MapComponent = ({
  googleApiKey,
  googleMapId,
  flightQuery,
  height = 300,
}: {
  googleApiKey: string;
  googleMapId: string;
  flightQuery: QueryPlace;
  height?: number;
}) => {
  return (
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
  );
};

export const FlightHotelBundle = ({
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
          <Link
            to={`/explore/${country.slug}`}
            target="_blank"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Explore {country.name}{" "}
            <svg
              width="13.5"
              height="13.5"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="ml-2"
            >
              <path
                fill="currentColor"
                d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
              ></path>
            </svg>
          </Link>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
