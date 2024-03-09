import { DatesGraph } from "../dates-graph/dates-graph";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { QueryPlace } from "~/types/search";
import { Place } from "~/helpers/sdk/place";
import moment from "moment";

export const ExploreGraph = ({
  airports,
  from,
  apiUrl,
}: {
  airports: Place[];
  from: Place;
  apiUrl: string;
}) => {
  const [searchIndicativeDates, setSearchIndicativeDates] =
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

  if (!searchIndicativeDates?.content?.results?.quotes) return <></>;

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
      <DatesGraph search={searchIndicativeDates} query={flightQuery} />
    </div>
  );
};
