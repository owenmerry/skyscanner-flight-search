import type { FlightSDK } from "~/helpers/sdk/flight/flight-functions";
import type { QueryPlace } from "~/types/search";
import { FlightTimeline } from "./flight-timeline";
import { useState } from "react";
import { Leg } from "./flight-leg";

interface FlightDetailsProps {
  flight: FlightSDK;
  query: QueryPlace;
}

export const FlightDetails = ({ flight, query }: FlightDetailsProps) => {
  const [showDepartureTimeline, setShowDepartureTimeline] = useState(false);
  const [showReturnTimeline, setShowReturnTimeline] = useState(false);
  return (
    <div className="">
      <div className="mb-4 border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md">
        <div
          className="cursor-pointer"
          onClick={() => setShowDepartureTimeline(!showDepartureTimeline)}
        >
          <div className={`text-2xl pb-4 font-bold`}>Departure</div>
          <Leg leg={flight.legs[0]} />
        </div>
        {showDepartureTimeline ? (
          <div>
            <FlightTimeline query={query} leg={flight.legs[0]} showStopOvers />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md">
        <div
          className="cursor-pointer"
          onClick={() => setShowReturnTimeline(!showReturnTimeline)}
        >
          <div className={`text-2xl pb-4 font-bold cursor-pointer`}>Return</div>
          <Leg leg={flight.legs[1]} />
          {showReturnTimeline ? (
            <div>
              <FlightTimeline
                query={query}
                leg={flight.legs[1]}
                showStopOvers
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
