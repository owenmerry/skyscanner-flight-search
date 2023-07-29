import { Link } from "@remix-run/react";
import { type Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import {
  IndicitiveQuote,
  IndicitiveQuoteResult,
  SkyscannerAPIIndicativeResponse,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPrice } from "~/helpers/sdk/price";
import { QueryPlace } from "~/types/search";
import { formatDistance, format, addDays } from "date-fns";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
  getSearchWithCreateAndPoll,
} from "~/helpers/sdk/query";
import { useState } from "react";

export const ExploreEverywhere = ({
  from,
  search,
  title = "",
  apiUrl,
}: {
  from: Place;
  apiUrl?: string;
  search?: SkyscannerAPIIndicativeResponse;
  title?: string;
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
        <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div>
            <h2 className="text-3xl mb-6">{title}</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
            {sortByPrice(
              search.content.groupingOptions.byRoute.quotesGroups
            ).map((quoteKey) => {
              const [priceUpdated, setPriceUpdated] = useState<string>();
              const quote = search.content.results.quotes[quoteKey.quoteIds[0]];
              const destinationPlace = getPlaceFromEntityId(
                quote.inboundLeg.originPlaceId
              );
              const getDateDisplay = (date: SkyscannerDateTimeObject) => {
                const numberTwoDigits = (myNumber: number) => {
                  return ("0" + myNumber).slice(-2);
                };
                return `${date.year}-${numberTwoDigits(
                  date.month
                )}-${numberTwoDigits(date.day)}`;
              };
              const departDateYYYYMMDD = getDateDisplay(
                quote.outboundLeg.departureDateTime
              );
              const returnDateYYYYMMDD = getDateDisplay(
                quote.inboundLeg.departureDateTime
              );
              const getLink = (query: QueryPlace) => {
                return `/search/${query.from.iata}/${query.to.iata}/${
                  query.depart
                }${query.return ? `/${query.return}` : ""}`;
              };
              const getTripDays = (departDate: string, returnDate: string) => {
                const departDateObject = new Date(departDate);
                const returnDateObject = addDays(new Date(returnDate), 1);

                return formatDistance(departDateObject, returnDateObject, {});
              };
              const getDateFormatted = (
                date: string,
                formatString?: string
              ) => {
                const dateObject = new Date(date);

                return format(dateObject, formatString || "EEE,d");
              };
              const getUpdated = (quote: IndicitiveQuoteResult) => {
                const departUpdateTimestamp = new Date(
                  Number(quote.outboundLeg.quoteCreationTimestamp) * 1000
                );
                const returnUpdateTimestamp = new Date(
                  Number(quote.inboundLeg.quoteCreationTimestamp) * 1000
                );
                const updateTimestamp =
                  departUpdateTimestamp >= returnUpdateTimestamp
                    ? departUpdateTimestamp
                    : returnUpdateTimestamp;

                return formatDistance(updateTimestamp, new Date(), {
                  addSuffix: true,
                });
              };
              const handleSearchPrice = async () => {
                setPriceUpdated("loading");
                const priceChecked = await getSearchWithCreateAndPoll(
                  {
                    from: from.entityId,
                    to: destinationPlace ? destinationPlace.entityId : "",
                    depart: departDateYYYYMMDD,
                    return: returnDateYYYYMMDD,
                  },
                  {
                    apiUrl,
                  }
                );
                setPriceUpdated(priceChecked);
              };

              if (!destinationPlace)
                return <>{`not found:${quote.inboundLeg.originPlaceId}`}</>;

              return (
                <div className="bg-slate-50 font-semibold mr-2 p-4 rounded dark:hover:bg-gray-700 dark:bg-gray-800 text-slate-400">
                  <a
                    href={getLink({
                      from,
                      to: destinationPlace,
                      depart: departDateYYYYMMDD,
                      return: returnDateYYYYMMDD,
                    })}
                  >
                    <div className="text-white mb-2">
                      {destinationPlace.name}{" "}
                    </div>
                    <div>
                      {getDateFormatted(departDateYYYYMMDD)} to{" "}
                      {getDateFormatted(returnDateYYYYMMDD)}{" "}
                      {getDateFormatted(returnDateYYYYMMDD, "MMM")}
                    </div>
                    <div>
                      Trip is{" "}
                      {getTripDays(departDateYYYYMMDD, returnDateYYYYMMDD)}
                    </div>
                    <div>
                      From{" "}
                      {getPrice(quote.minPrice.amount, quote.minPrice.unit)}
                      <div>
                        {priceUpdated && priceUpdated !== "loading"
                          ? `(Now ${priceUpdated})`
                          : ""}
                      </div>
                    </div>
                    <div className="text-xs text-right mt-6 text-slate-500">
                      Updated {getUpdated(quote)}
                    </div>
                  </a>
                  <div
                    className="text-xs text-right mt-4 text-slate-400 cursor-pointer underline"
                    onClick={() => handleSearchPrice()}
                  >
                    {priceUpdated === "loading"
                      ? `Loading Price...`
                      : `Check Price`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const AllCountries = ({
  countries,
  showAll,
  onShowToggle,
}: {
  countries: Place[];
  showAll: boolean;
  onShowToggle: () => void;
}) => {
  const [filter, setFilter] = useState<string>();
  const countriesFiltered = countries.filter(
    (country) =>
      !filter ||
      (filter && country.name.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="text-3xl mb-6">Countries</h2>
      </div>
      <div className="my-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Search Country..."
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
        {countriesFiltered
          .slice(0, showAll ? 999 : 30)
          .map((country: Place, key: number) => {
            return (
              <div className="">
                <Link
                  className="hover:underline"
                  to={`/explore/${country.slug}`}
                >
                  <div
                    style={{
                      backgroundImage: `url(${country.images[0]}&w=250)`,
                    }}
                    className={`h-[120px] bg-cover`}
                  ></div>
                  <div>{country.name}</div>
                </Link>
              </div>
            );
          })}
      </div>
      {countriesFiltered.length >= 30 ? (
        <div className="text-center mt-4">
          <div
            className="inline-block justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer"
            onClick={onShowToggle}
          >
            {showAll ? "Show Less Countries" : "Show All Countries"}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
