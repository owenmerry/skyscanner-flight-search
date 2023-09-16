import type { QueryPlace } from "~/types/search";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
  IndicitiveQuoteDate,
  IndicitiveQuoteResult,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPrice } from "~/helpers/sdk/price";
import { format } from "date-fns";
import moment from "moment";

const getDateDisplay = (date: SkyscannerDateTimeObject) => {
  const numberTwoDigits = (myNumber: number) => {
    return ("0" + myNumber).slice(-2);
  };
  return `${date.year}-${numberTwoDigits(date.month)}-${numberTwoDigits(
    date.day
  )}`;
};

const getDateNumber = (date: SkyscannerDateTimeObject) => {
  const numberTwoDigits = (myNumber: number) => {
    return ("0" + myNumber).slice(-2);
  };
  return `${date.year}${numberTwoDigits(date.month)}${numberTwoDigits(
    date.day
  )}`;
};

export const DatesGraph = ({
  search,
  query,
  isReturn = false,
  hasMaxWidth = false,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
  isReturn?: boolean;
  hasMaxWidth?: boolean;
}) => {
  const sortByPrice = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA && quoteB
        ? Number(quoteA?.minPrice.amount) - Number(quoteB?.minPrice.amount)
        : 0;
    });

    return sorted;
  };
  const sortByDate = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[],
    isReturn?: boolean
  ) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA && quoteB
        ? Number(
            getDateNumber(
              isReturn
                ? quoteA?.inboundLeg.departureDateTime
                : quoteA?.outboundLeg.departureDateTime
            )
          ) -
            Number(
              getDateNumber(
                isReturn
                  ? quoteB?.inboundLeg.departureDateTime
                  : quoteB?.outboundLeg.departureDateTime
              )
            )
        : 0;
    });

    return sorted;
  };
  const getPercentageBar = (number: number, numberPercentage: number) => {
    return (
      100 - Math.ceil(((numberPercentage - number) / numberPercentage) * 100)
    );
  };
  const getQuoteNumberFromDate = (
    quoteIds: string[],
    date: string,
    isReturn?: boolean
  ) => {
    const filteredQuotes = quoteIds.filter((quoteId) => {
      const quote = search?.content.results.quotes[quoteId];
      if (!quote) return;
      const departDateYYYYMMDD = getDateNumber(
        quote.outboundLeg.departureDateTime
      );
      const returnDateYYYYMMDD = getDateNumber(
        quote.inboundLeg.departureDateTime
      );

      return isReturn
        ? date === departDateYYYYMMDD
        : date === returnDateYYYYMMDD;
    });

    return filteredQuotes;
  };

  const quotesGroup = isReturn
    ? search?.content.groupingOptions.byDate.quotesInboundGroups
    : search?.content.groupingOptions.byDate.quotesOutboundGroups;
  if (!quotesGroup) return <></>;

  const quotesSorted = Object.keys(search?.content.results.quotes || {}).sort(
    (a, b) => {
      const quoteAPrice = search?.content.results.quotes[a]?.minPrice.amount;
      const quoteBPrice = search?.content.results.quotes[b]?.minPrice.amount;

      return quoteAPrice && quoteBPrice
        ? Number(quoteAPrice) - Number(quoteBPrice)
        : 0;
    }
  );
  const topPrice =
    search?.content.results.quotes[quotesSorted.reverse()[0]]?.minPrice.amount;
  var resultsDisplayed = 0;

  return (
    <>
      {search ? (
        <div
          className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800 overflow-x-auto"
          style={{ maxWidth: hasMaxWidth ? "900px" : "" }}
        >
          <div className="flex items-end">
            {sortByDate(quotesGroup, isReturn).map((quoteKey) => {
              const quotesFilteredFirst = query.return
                ? getQuoteNumberFromDate(
                    quoteKey.quoteIds,
                    ((isReturn ? query.depart : query.return) || "").replace(
                      /-/g,
                      ""
                    ),
                    isReturn
                  )[0]
                : quoteKey.quoteIds[0];
              if (!quotesFilteredFirst) return <></>;

              const quote = search.content.results.quotes[quotesFilteredFirst];
              const getLink = (query: QueryPlace) => {
                return `/search/${query.from.iata}/${query.to.iata}/${
                  query.depart
                }${query.return ? `/${query.return}` : ""}`;
              };
              const getDateFormatted = (date: string) => {
                const dateObject = new Date(date);

                return format(dateObject, "dd");
              };
              const departDateYYYYMMDD = getDateDisplay(
                quote.outboundLeg.departureDateTime
              );
              const returnDateYYYYMMDD = getDateDisplay(
                quote.inboundLeg.departureDateTime
              );
              const selectedDate = isReturn
                ? returnDateYYYYMMDD === query.return
                : departDateYYYYMMDD === query.depart;
              const dateMoment = isReturn
                ? moment(returnDateYYYYMMDD)
                : moment(departDateYYYYMMDD);
              const selectedDateMoment = moment(query.depart);
              const startDate = moment(departDateYYYYMMDD).subtract(14, "d");
              const endDate = moment(departDateYYYYMMDD).add(14, "d");
              const inRange = selectedDateMoment.isBetween(startDate, endDate);
              //if (!inRange) return;
              ++resultsDisplayed;

              return (
                <div
                  className={`flex flex-col flex-1 mx-1 items-end text-xs text-center content-center`}
                >
                  <div className="h-60 flex items-end w-full">
                    <a
                      className={`${
                        selectedDate ? "bg-blue-700" : "bg-slate-700"
                      } hover:bg-slate-600 p-1 w-full`}
                      style={{
                        height: `${getPercentageBar(
                          Number(quote?.minPrice.amount),
                          Number(topPrice)
                        )}%`,
                      }}
                      href={getLink({
                        ...query,
                        depart: departDateYYYYMMDD,
                        ...(query.return ? { return: returnDateYYYYMMDD } : {}),
                      })}
                    >
                      <div>£{quote?.minPrice.amount}</div>
                    </a>
                  </div>
                  <div className="w-full">{dateMoment.format("dd")}</div>
                  <div className="w-full">{dateMoment.format("D")}</div>
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
