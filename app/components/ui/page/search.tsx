import { Link } from "@remix-run/react";
import { getFlightSearch } from "~/helpers/map";
import { SearchSDK } from "~/helpers/sdk/skyscannerSDK";
import type { QueryPlace } from "~/types/search";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import type { Place } from "~/helpers/sdk/place";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { Loading } from "~/components/loading";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPrice } from "~/helpers/sdk/price";
import { format } from "date-fns";

export const MapComponent = ({
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
          Options:{" "}
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
                  className="bg-slate-50 font-semibold mr-2 p-2 rounded dark:bg-gray-800 text-slate-400"
                  href={getLink({
                    ...query,
                    depart: departDateYYYYMMDD,
                    return: returnDateYYYYMMDD,
                  })}
                >
                  {getDateFormatted(departDateYYYYMMDD)} to{" "}
                  {getDateFormatted(returnDateYYYYMMDD)} from{" "}
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

export const ExplorePage = ({ country }: { country?: Place }) => {
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
