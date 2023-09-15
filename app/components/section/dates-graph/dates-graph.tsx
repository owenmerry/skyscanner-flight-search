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
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
}) => {
  const sortByPrice = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA && quoteB
        ? Number(quoteA.minPrice.amount) - Number(quoteB.minPrice.amount)
        : 0;
    });

    return sorted;
  };
  const sortByDate = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA && quoteB
        ? Number(getDateNumber(quoteA?.outboundLeg.departureDateTime)) -
            Number(getDateNumber(quoteB?.outboundLeg.departureDateTime))
        : 0;
    });

    return sorted;
  };

  const getPercentageBar = (number: number, numberPercentage: number) => {
    return (
      100 - Math.ceil(((numberPercentage - number) / numberPercentage) * 100)
    );
  };

  const topPrice =
    search?.content.results.quotes[
      sortByPrice(search?.content.groupingOptions.byDate.quotesOutboundGroups)[
        search?.content.groupingOptions.byDate.quotesOutboundGroups.length - 1
      ].quoteIds[0]
    ].minPrice.amount;
  var resultsDisplayed = 0;

  return (
    <>
      {search ? (
        <div
          className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800 overflow-x-auto"
          style={{ maxWidth: "900px" }}
        >
          <div className="flex h-60 items-end">
            {sortByDate(
              search.content.groupingOptions.byDate.quotesOutboundGroups
            ).map((quoteKey) => {
              const quote = search.content.results.quotes[quoteKey.quoteIds[0]];
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
              const selectedDate = departDateYYYYMMDD === query.depart;
              const dateMoment = moment(departDateYYYYMMDD);
              const selectedDateMoment = moment(query.depart);
              const startDate = moment(departDateYYYYMMDD).subtract(12, "d");
              const endDate = moment(departDateYYYYMMDD).add(12, "d");
              const inRange = selectedDateMoment.isBetween(startDate, endDate);
              //if (!inRange) return;
              ++resultsDisplayed;

              return (
                <a
                  className={`flex-1 ${
                    selectedDate ? "bg-blue-700" : "bg-slate-700"
                  } hover:bg-slate-600 mx-1 p-1 text-xs`}
                  style={{
                    height: `${getPercentageBar(
                      Number(quote.minPrice.amount),
                      Number(topPrice)
                    )}%`,
                  }}
                  href={getLink({
                    ...query,
                    depart: departDateYYYYMMDD,
                    ...(query.return ? { return: returnDateYYYYMMDD } : {}),
                  })}
                >
                  <div>£{quote.minPrice.amount}</div>
                </a>
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
