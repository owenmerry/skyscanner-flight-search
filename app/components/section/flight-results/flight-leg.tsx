import type { FlightSDK, LegSDK } from "~/helpers/sdk/flight/flight-functions";
import { Tooltip } from "flowbite-react";
import React from "react";

interface LegsProps {
  flight: FlightSDK;
}
export const Legs = ({ flight }: LegsProps) => {
  return (
    <div className="col-span-2 flex-1">
      {flight.legs.map((leg) => {
        return (
          <div key={`leg-${leg.id}`} className="mb-4">
            <Leg leg={leg} />
          </div>
        );
      })}
    </div>
  );
};

interface LegProps {
  leg: LegSDK;
  showCarriers?: boolean;
}
export const Leg = ({ leg, showCarriers = true }: LegProps) => {
  return (
    <>
    <div className="grid grid-cols-2 pb-4 last:pb-0">
      <div className="col-span-2 grid grid-cols-3 flex-1">
        <div className="text-center">
          <div className="text-xl font-bold dark:text-white">
            {leg.departureTime}
          </div>
          <div className="text-slate-400 flex justify-center">
            <Tooltip content={leg.from} className="">
              {leg.fromIata}
            </Tooltip>
          </div>
        </div>

        <div className="text-center">
          <div className="text-slate-400 text-sm">{leg.durationDisplay}</div>
          <hr className="my-2 dark:border-gray-700" />
          <div className="text-slate-400 text-sm">
            {leg.direct ? (
              "Direct"
            ) : (
              <div className="flex justify-center">
                <Tooltip
                  content={leg.layovers
                    .map((layover) => layover.place.name)
                    .join(", ")}
                  className=""
                >
                  {leg.stops === 1 ? "1 Stop" : `${leg.stops} Stops`}
                </Tooltip>
              </div>
            )}
          </div>
          <div className="text-slate-500 flex justify-center text-xs mt-2">
            <Tooltip content={leg.carriers
                    .map((carrier) => carrier.name)
                    .join(", ")} className="">
            {leg.carriers[0].name}{leg.carriers[1] ? `, +${leg.carriers.length - 1}` : ''}
            </Tooltip>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold dark:text-white">
            {leg.arrivalTime}
          </div>
          <div className="text-slate-400 flex justify-center">
            <Tooltip content={leg.to} className="">
              {leg.toIata}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
