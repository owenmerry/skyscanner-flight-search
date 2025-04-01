import type { QueryPlace } from "~/types/search";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
  IndicitiveQuoteDate,
} from "~/helpers/sdk/indicative/indicative-response";
import moment from "moment";
import { generateDateRange, skyscannerDateToYYYYMMDD } from "~/helpers/date";

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

export const DatesGraphDate = ({
  search,
  query,
  hasMaxWidth = false,
  onSelected,
  isReturn,
  range,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
  isReturn?: boolean;
  hasMaxWidth?: boolean;
  onSelected?: (date: string, price: string) => void;
  range: {
    start: string;
    end: string;
  }
}) => {
  const sortByDate = (
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA = search?.content?.results.quotes[a.quoteIds[0]];
      const quoteB = search?.content?.results.quotes[b.quoteIds[0]];

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

  const fillDateRange = (
    start: string,
    end: string,
    quoteGroups: IndicitiveQuote[] | IndicitiveQuoteDate[]
  ) => {
    const allDates = generateDateRange(start, end);
    const allDatesWithQuotes: {
      date: string;
      quote?: IndicitiveQuote | IndicitiveQuoteDate;
    }[] = [];
    allDates.forEach((date) => {
      const quoteList = quoteGroups.filter((quoteIds) => {
        const quote = search?.content?.results.quotes[quoteIds.quoteIds[0]];
        if (!quote) return false;
        const departDateYYYYMMDD = skyscannerDateToYYYYMMDD(
          quote.outboundLeg.departureDateTime
        );
        return departDateYYYYMMDD === date;
      });
      const quote = quoteList.length > 0 ? quoteList[0] : undefined;
      allDatesWithQuotes.push({ date, quote });
    });

    return allDatesWithQuotes;
  };

  const quotesGroup =
    search?.content?.groupingOptions.byDate.quotesOutboundGroups;
  if (!quotesGroup) return <></>;

  let topPrice = 0;
  sortByDate(quotesGroup).map((quoteKey) => {
    const quotesFilteredFirst = quoteKey.quoteIds[0];
    if (!quotesFilteredFirst) return <></>;
    const quotePrice = Number(
      search?.content?.results.quotes[quotesFilteredFirst]?.minPrice.amount
    );
    if (topPrice > quotePrice) return;
    topPrice = quotePrice;
  });

  const handleDateSelected = (date: string, price: string) => {
    onSelected && onSelected(date, price);
  };

  return (
    <>
      {search ? (
        <div
          className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800 overflow-x-auto"
          style={{ maxWidth: hasMaxWidth ? "900px" : "" }}
        >
          <div className="flex items-end">
            {fillDateRange(range.start, range.end,sortByDate(quotesGroup)).map((quoteDate, key) => {
              const quoteKey = quoteDate.quote;
              if (!quoteKey) return <>skip</>;
              const quotesFilteredFirst = quoteKey.quoteIds[0];
              if (!quotesFilteredFirst) return <>skip</>;

              const quote = search.content.results.quotes[quotesFilteredFirst];
              const departDateYYYYMMDD = getDateDisplay(
                quote.outboundLeg.departureDateTime
              );
              const selectedDate = isReturn
                ? query.return === departDateYYYYMMDD
                : query.depart === departDateYYYYMMDD;
              const dateMoment = moment(departDateYYYYMMDD);

              return (
                <div
                  key={quoteKey.quoteIds[0]}
                  className={`flex flex-col flex-1 mx-1 items-end text-xs text-center content-center`}
                >
                  <div className="h-60 flex items-end w-full">
                    <div
                      className={`${
                        selectedDate
                          ? "bg-blue-700 hover:bg-blue-600"
                          : "bg-slate-700 hover:bg-slate-600"
                      } p-1 w-full cursor-pointer`}
                      style={{
                        height: `${getPercentageBar(
                          Number(quote?.minPrice.amount),
                          Number(topPrice)
                        )}%`,
                      }}
                      onClick={() =>
                        handleDateSelected(
                          departDateYYYYMMDD,
                          quote?.minPrice.amount
                        )
                      }
                    >
                      <div>£{quote?.minPrice.amount}</div>
                    </div>
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
