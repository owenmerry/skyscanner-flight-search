import type { QueryPlace } from "~/types/search";
import {
  SkyscannerAPIIndicativeResponse,
  IndicitiveQuote,
  SkyscannerDateTimeObject,
  IndicitiveQuoteDate,
} from "~/helpers/sdk/indicative/indicative-response";
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
  hasMaxWidth = false,
  onSelected,
  isReturn,
}: {
  search?: SkyscannerAPIIndicativeResponse;
  query: QueryPlace;
  isReturn?: boolean;
  hasMaxWidth?: boolean;
  onSelected?: (date: string, price: string) => void;
}) => {
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

  const quotesGroup =
    search?.content?.groupingOptions.byDate.quotesOutboundGroups;
  if (!quotesGroup) return <></>;

  let topPrice = 0;
  sortByDate(quotesGroup).map((quoteKey) => {
    const quotesFilteredFirst = quoteKey.quoteIds[0];
    if (!quotesFilteredFirst) return <></>;
    const quotePrice = Number(
      search?.content.results.quotes[quotesFilteredFirst]?.minPrice.amount
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
            {sortByDate(quotesGroup).map((quoteKey, key) => {
              const quotesFilteredFirst = quoteKey.quoteIds[0];
              if (!quotesFilteredFirst) return <></>;

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
