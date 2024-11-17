import { useEffect, useState } from "react";
import { buildBarChartData } from "./helpers/bar-chart";
import moment from "moment";
import type { QueryPlace } from "~/types/search";
import { MdHistory } from "react-icons/md";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { FlightHistorySDK } from "~/helpers/sdk/flight-history/flight-history-sdk";

export interface BarChartHistoryPriceProps {
  query: QueryPlace;
  interval?: "day" | "hour";
  apiUrl: string,
  flightPrices?: FlightHistorySDK,
}

export const BarChartHistoryPrice = ({
  query,
  flightPrices,
  interval = "day",
  apiUrl,
}: BarChartHistoryPriceProps) => {
  const [prices, setPrices] = useState<FlightHistorySDK | undefined>(flightPrices);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if(!prices){
      runPriceHistory();
    }
  }, []);

  const runPriceHistory = async () => {
    const prices = await skyscanner().flightHistory({
      apiUrl,
      query
    });

    setPrices(prices);
  };
  if (!prices || 'error' in prices || prices.length === 0) return "";
  const chart = buildBarChartData(prices, interval, 100, 50);

  return (
    <div className="border-2 dark:bg-gray-900 bg-white border-slate-100 rounded-lg dark:text-white dark:border-gray-800 hover:dark:border-gray-700 mb-2">
      <div className="flex flex-col">
        <div
          className="font-bold text-base text-slate-300 hover:text-slate-200 cursor-pointer py-4 px-4"
          onClick={() => setShow(!show)}
        >
          <MdHistory className="inline-block text-lg" /> Price History
        </div>
        {show ? (
          <div className="flex overflow-y-scroll scrollbar-hide gap-2 p-4">
            {chart.aggregatedData.map((bar, index) => {
              const dateMoment = moment(bar.time);
              return (
                <div
                  key={bar.count}
                  className="flex flex-col items-end text-xs text-center"
                >
                  <div className="h-40 flex items-end w-full">
                    <div
                      className={`${
                        index === chart.aggregatedData.length - 1
                          ? `bg-blue-700`
                          : "bg-slate-700"
                      } p-2 w-full`}
                      style={{
                        height: `${bar.percentage}%`,
                      }}
                    >
                      <div>£{bar.totalPrice.toFixed(0)}</div>
                    </div>
                  </div>
                  <div className="w-full">{dateMoment.format("dd")}</div>
                  <div className="w-full">{dateMoment.format("D")}</div>
                  {interval === "hour" ? (
                    <div className="w-full">{dateMoment.format("HH")}:00</div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
