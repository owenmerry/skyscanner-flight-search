import { DatesGraph } from "../dates-graph/dates-graph";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { QueryPlace } from "~/types/search";
import { Place } from "~/helpers/sdk/place";
import moment from "moment";
import { ToggleSwitch } from "flowbite-react";

export const ExploreGraph = ({
  airports,
  from,
  apiUrl,
  showReturn,
}: {
  airports: Place[];
  from: Place;
  apiUrl: string;
  showReturn?: boolean;
}) => {
  const [searchIndicativeDates, setSearchIndicativeDates] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [displayReturn, setDisplayReturn] = useState<boolean>(false);
  const [searchIndicativeDatesReturn, setSearchIndicativeDatesReturn] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [airport, setAirport] = useState<Place>(airports[0]);
  const [month, setMonth] = useState<string>(
    moment().startOf("month").format("YYYY-MM-DD")
  );

  useEffect(() => {
    runIndicativeDates();
  }, [airport, month, from]);

  const runIndicativeDates = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: airport.entityId,
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
          from: airport.entityId,
          to: from ? from.entityId : "",
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
        year: monthLastDay.format("YYYY"),
      });
    }

    return arRet;
  };

  const handleAirportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAirport(airports[Number(e.target.value)]);
  };

  const flightQuery: QueryPlace = {
    from: from,
    to: airport,
    depart: "2023-10-01",
  };

  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        {from.name} to {airport.name}
      </h2>
      <select
        className="mr-2 mb-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        onChange={handleAirportChange}
      >
        {airports.map((airport, key) => {
          return <option value={key}>{airport.name}</option>;
        })}
      </select>
      <select
        className="mr-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {getNextXMonthsStartDayAndEndDay(10).map((month) => (
          <option value={month.firstDay}>{month.displayMonthText}</option>
        ))}
      </select>
      <div className="inline-block">
        <ToggleSwitch
          checked={displayReturn}
          label="Return Flight"
          onChange={(toggle) => setDisplayReturn(toggle)}
        />
      </div>
      {searchIndicativeDates?.content?.results?.quotes ? (
        <>
          <DatesGraph search={searchIndicativeDates} query={flightQuery} />
          {showReturn && displayReturn ? (
            <>
              <div>Return</div>
              <DatesGraph
                search={searchIndicativeDatesReturn}
                query={flightQuery}
              />
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};
