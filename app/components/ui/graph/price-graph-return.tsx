import { DatesGraph } from "../../section/dates-graph/dates-graph";
import type { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { QueryPlace } from "~/types/search";
import moment from "moment";
import { getNextXMonthsStartDayAndEndDay } from "~/helpers/date";

export const PriceGraph = ({
  apiUrl,
  query,
  showReturn,
}: {
  apiUrl: string;
  query: QueryPlace;
  showReturn?: boolean;
}) => {
  const [searchIndicativeDates, setSearchIndicativeDates] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [searchIndicativeDatesReturn, setSearchIndicativeDatesReturn] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [month, setMonth] = useState<string>(
    query.depart || moment().startOf("month").format("YYYY-MM-DD")
  );
  const [selected, setSelected] = useState<QueryPlace>(query);

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
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        {query.from.name} to {query.to.name}
      </h2>
      <select
        className="mr-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        value={moment(month).endOf("month").format("YYYY-MM-DD")}
        onChange={(e) => setMonth(e.target.value)}
      >
        {getNextXMonthsStartDayAndEndDay(12).map((itemMonth, key) => (
          <option key={key} value={itemMonth.firstDay}>
            {itemMonth.displayMonthText}
          </option>
        ))}
      </select>
      {searchIndicativeDates?.content?.results?.quotes ? (
        <>
          <div className="text-lg font-bold my-4">Departure</div>
          <DatesGraph
            search={searchIndicativeDates}
            query={{
              ...query,
              return: undefined,
            }}
            onSelected={(date) => setSelected({ ...query, depart: date })}
          />
          {showReturn ? (
            <>
              <div className="text-lg font-bold my-4">Return</div>
              <DatesGraph
                search={searchIndicativeDatesReturn}
                query={{
                  ...query,
                  return: undefined,
                }}
                onSelected={(date) => setSelected({ ...query, return: date })}
              />
            </>
          ) : (
            ""
          )}
          <div className="my-4">
            <a
              rel="nofollow"
              href={`/search/${selected.from.iata}/${selected.to.iata}/${
                selected.depart
              }/${selected.return ? selected.return : ""}`}
              className="justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
            >
              See Flights ({moment(selected.depart).format("ddd, DD MMM")} -{" "}
              {moment(selected.return).format("ddd, DD MMM")})
            </a>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
