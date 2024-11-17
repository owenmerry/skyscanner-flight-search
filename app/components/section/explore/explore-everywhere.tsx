import { useEffect, useRef, useState } from "react";
import { getPlaceFromIata, type Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import type {
  IndicitiveQuote,
  IndicitiveQuoteResult,
  SkyscannerAPIIndicativeResponse,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPrice } from "~/helpers/sdk/price";
import type { QueryPlace } from "~/types/search";
import { formatDistance, format, addDays } from "date-fns";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import moment from "moment";
import { ToggleSwitch } from "flowbite-react";
import { getCountryEntityId } from "~/helpers/sdk/data";
import { Loading } from "~/components/ui/loading";

export const ExploreEverywhere = ({
  fromPlace,
  toPlace,
  title = "",
  apiUrl,
}: {
  fromPlace?: Place;
  toPlace?: Place;
  apiUrl?: string;
  title?: string;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState<SkyscannerAPIIndicativeResponse>();
  const [priceUpdated, setPriceUpdated] = useState<
    { quoteId: string; price: string }[]
  >([]);
  const [month, setMonth] = useState<string>(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [returnFlight, setReturnFlight] = useState<boolean>(true);
  const fromDefault = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");
  const from = fromPlace || fromDefault;
  const previousPriceUpdated = useRef<{ quoteId: string; price: string }[]>([]);

  useEffect(() => {
    previousPriceUpdated.current = priceUpdated;
  }, [priceUpdated]);

  if (!from) return null;
  const sortByPrice = (quoteGroups: IndicitiveQuote[]) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA: any = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB: any = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA.minPrice.amount - quoteB.minPrice.amount;
    });

    return sorted;
  };
  const getNextXMonthsStartDayAndEndDay = (months: number) => {
    let n = 0;
    let arRet = [];

    for (; n < months; n++) {
      const month = moment().startOf("month").add(n, "months");
      const monthFirstDay = month;
      const monthLastDay = month.endOf("month");
      arRet.push({
        displayMonthText: month.format("MMMM YYYY"),
        firstDay: monthFirstDay.format("YYYY-MM-DD"),
        lastDay: monthLastDay.format("YYYY-MM-DD"),
      });
    }

    return arRet;
  };

  useEffect(() => {
    runIndicative();
  }, [month, returnFlight, fromPlace]);

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from.entityId,
        to: toPlace?.entityId || "anywhere",
        tripType: returnFlight ? "return" : "single",
      },
      month: Number(moment(month).startOf("month").format("MM")),
      year: Number(moment(month).startOf("month").format("YYYY")),
      endMonth: 12,
      endYear: 2024,
    });

    if ("error" in indicativeSearch.search) return;

    setSearch(indicativeSearch.search);
  };

  return (
    <>
      {search ? (
        <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div>
            <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
              {title || `Explore ${from.name} to Everywhere`}
            </h2>
          </div>
          <div className="mb-4 flex items-center">
            <select
              className="mr-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {getNextXMonthsStartDayAndEndDay(10).map((month) => (
                <option value={month.firstDay}>{month.displayMonthText}</option>
              ))}
            </select>
            <div>
              <ToggleSwitch
                checked={returnFlight}
                label="Return Flight"
                onChange={(toggle) => setReturnFlight(toggle)}
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
            {sortByPrice(search.content.groupingOptions.byRoute.quotesGroups)
              .slice(0, showAll ? 99999 : 30)
              .map((quoteKey) => {
                const quote =
                  search.content.results.quotes[quoteKey.quoteIds[0]];
                const destinationPlace = getPlaceFromEntityId(
                  quote.outboundLeg.destinationPlaceId
                );
                const originPlace = getPlaceFromEntityId(
                  quote.outboundLeg.originPlaceId
                );
                const updatedPriceObject = priceUpdated.filter(
                  (price) => price.quoteId === quoteKey.quoteIds[0]
                );
                const updatedPriceString =
                  updatedPriceObject.length > 0
                    ? updatedPriceObject[0].price
                    : undefined;
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
                const isSingleSearch =
                  quote.inboundLeg.destinationPlaceId === "";
                const isReturnSearch = !isSingleSearch;
                const getLink = (query: QueryPlace) => {
                  return `/search/${originPlace ? originPlace.iata : ""}/${
                    destinationPlace ? destinationPlace.iata : ""
                  }/${query.depart}${query.return ? `/${query.return}` : ""}`;
                };
                const getTripDays = (
                  departDate: string,
                  returnDate: string
                ) => {
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
                  const loadingPriceUpdated = priceUpdated.filter(
                    (price) => price.quoteId !== quoteKey.quoteIds[0]
                  );
                  loadingPriceUpdated.push({
                    quoteId: quoteKey.quoteIds[0],
                    price: "loading",
                  });
                  setPriceUpdated(loadingPriceUpdated);
                  if (!destinationPlace || !originPlace) return;
                  const priceSearch = await skyscanner()
                    .flight()
                    .createAndPoll({
                      query: {
                        from: originPlace,
                        to: destinationPlace,
                        depart: departDateYYYYMMDD,
                        return: isReturnSearch ? returnDateYYYYMMDD : undefined,
                      },
                      apiUrl,
                    });
                  const priceChecked = priceSearch?.stats.minPrice;
                  const updatedPriceUpdated =
                    previousPriceUpdated.current.filter(
                      (price) => price.quoteId !== quoteKey.quoteIds[0]
                    );
                  if (priceChecked) {
                    updatedPriceUpdated.push({
                      quoteId: quoteKey.quoteIds[0],
                      price: priceChecked,
                    });
                  }
                  setPriceUpdated(updatedPriceUpdated);
                };

                if (!destinationPlace)
                  return <>{`not found:${quote.inboundLeg.originPlaceId}`}</>;

                const country = getPlaceFromEntityId(
                  getCountryEntityId(destinationPlace.entityId)
                );

                return (
                  <div className="bg-slate-50 font-semibold mr-2 p-4 rounded dark:hover:bg-gray-700 dark:bg-gray-800 text-slate-400">
                    <a
                      href={getLink({
                        from,
                        to: destinationPlace,
                        depart: departDateYYYYMMDD,
                        return: isReturnSearch ? returnDateYYYYMMDD : undefined,
                      })}
                    >
                      <div className="text-white mb-2">
                        {destinationPlace.name}
                        {country ? `, ${country.name}` : null}
                      </div>
                      <div>
                        {isReturnSearch ? (
                          <>
                            {" "}
                            to {getDateFormatted(returnDateYYYYMMDD)}{" "}
                            {getDateFormatted(returnDateYYYYMMDD, "MMM")}
                          </>
                        ) : (
                          <>
                            {getDateFormatted(departDateYYYYMMDD)}{" "}
                            {getDateFormatted(departDateYYYYMMDD, "MMM")}
                          </>
                        )}
                      </div>
                      {isReturnSearch ? (
                        <div>
                          Trip is{" "}
                          {getTripDays(departDateYYYYMMDD, returnDateYYYYMMDD)}
                        </div>
                      ) : null}
                      <div>
                        From{" "}
                        {getPrice(quote.minPrice.amount, quote.minPrice.unit)}
                        <div className="text-white italic">
                          {updatedPriceString &&
                          updatedPriceString !== "loading"
                            ? `Price Now: ${updatedPriceString}`
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
                      {updatedPriceString === "loading" ? (
                        <Loading />
                      ) : (
                        `Check Price`
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {search.content.groupingOptions.byRoute.quotesGroups.length >= 30 ? (
            <div className="text-center mt-4">
              <div
                className="inline-block justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "Show All"}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
