import type { Place } from "~/helpers/sdk/place";
import { DatesGraph } from "../../section/dates-graph/dates-graph";
import type { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { QueryPlace } from "~/types/search";
import moment from "moment";
import { getNextXMonthsStartDayAndEndDay, getTripDays } from "~/helpers/date";
import { DatesGraphDate } from "../dates-graph/dates-graph-date";

interface MarketingGraphDayProps {
  apiUrl: string;
  from: Place;
  to: Place;
}
export const MarketingGraphDay = ({
  apiUrl,
  from,
  to,
}: MarketingGraphDayProps) => {
  const showReturn = true;
  const query: QueryPlace = {
    from,
    to,
    depart: moment().add(1, "days").format("YYYY-MM-DD"),
  };
  const [searchIndicativeDates, setSearchIndicativeDates] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [searchIndicativeDatesReturn, setSearchIndicativeDatesReturn] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [month, setMonth] = useState<string>(
    query.depart || moment().startOf("month").format("YYYY-MM-DD")
  );
  const [selectedQuery, setSelectedQuery] = useState<QueryPlace>(query);

  useEffect(() => {
    runIndicativeDates();
  }, [month]);

  const runIndicativeDates = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: query.from ? query.from.entityId : "",
        to: query.to.entityId,
        tripType: "single",
      },
      month: Number(moment(month).startOf("month").format("MM")),
      year: Number(moment(month).startOf("month").format("YYYY")),
      groupType: "date",
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicativeDates(indicativeSearch.search);

    if (showReturn) {
      const indicativeSearchReturn = await skyscanner().indicative({
        apiUrl,
        query: {
          from: query.to.entityId,
          to: query.from ? query.from.entityId : "",
          tripType: "single",
        },
        month: Number(moment(month).startOf("month").format("MM")),
        year: Number(moment(month).startOf("month").format("YYYY")),
        groupType: "date",
      });

      if ("error" in indicativeSearchReturn.search) return;

      setSearchIndicativeDatesReturn(indicativeSearchReturn.search);
    }
  };

  return (
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center lg:py-16">
      <div className="flex justify-center mb-4">
        <svg
          className="w-6 h-6 text-gray-800 dark:text-blue-600"
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
            strokeWidth="2"
            d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          />
        </svg>
      </div>
      <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Find your Flight
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        See all the flights and price trends for the next 12 months.
      </p>
      <div>
        <div className="flex overflow-y-scroll scrollbar-hide gap-2 py-3">
          {getNextXMonthsStartDayAndEndDay(12).map((itemMonth, key) => (
            <div
              onClick={() => setMonth(itemMonth.firstDay)}
              key={key}
              className={`${
                month === itemMonth.firstDay
                  ? `border-blue-600 bg-blue-600 hover:border-blue-500`
                  : `border-slate-600 bg-slate-800 hover:bg-slate-500`
              } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
            >
              {itemMonth.displayMonthText}
            </div>
          ))}
        </div>
        {/* <select
          className="mr-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value={moment(month).endOf("month").format("YYYY-MM-DD")}
          onChange={(e) => setMonth(e.target.value)}
        >
          {getNextXMonthsStartDayAndEndDay(12).map((itemMonth, key) => (
            <option key={key} value={itemMonth.firstDay}>
              {itemMonth.displayMonthText}
            </option>
          ))}
        </select> */}
      </div>
      <div className="m-8 grid grid-cols-1 gap-2">
        {searchIndicativeDates?.content?.results?.quotes ? (
          <>
            <div className="text-lg font-bold my-4">Departure</div>
            <DatesGraphDate
              range={{
                start: moment(month).startOf("month").format("YYYY-MM-DD"),
                end: moment(month).endOf("month").format("YYYY-MM-DD"),
              }}
              search={searchIndicativeDates}
              query={selectedQuery}
              onSelected={(date) =>
                setSelectedQuery({ ...selectedQuery, depart: date })
              }
            />
            {showReturn ? (
              <>
                <div className="text-lg font-bold my-4">Return</div>
                <DatesGraphDate
                  range={{
                    start: moment(month).startOf("month").format("YYYY-MM-DD"),
                    end: moment(month).endOf("month").format("YYYY-MM-DD"),
                  }}
                  search={searchIndicativeDatesReturn}
                  query={selectedQuery}
                  onSelected={(date) =>
                    setSelectedQuery({ ...selectedQuery, return: date })
                  }
                  isReturn
                />
              </>
            ) : (
              ""
            )}
            <div className="my-6">
              <a
                rel="nofollow"
                href={`/search/${selectedQuery.from.iata}/${
                  selectedQuery.to.iata
                }/${selectedQuery.depart}/${
                  selectedQuery.return ? selectedQuery.return : ""
                }`}
                className="justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
              >
                See Flights (
                {moment(selectedQuery.depart).format("ddd, DD MMM")} -{" "}
                {moment(selectedQuery.return).format("ddd, DD MMM")}){" "}
                {selectedQuery.return
                  ? `${getTripDays(
                      selectedQuery.depart,
                      selectedQuery.return
                    )} days`
                  : ""}
              </a>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
