import React from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import type { LegSDK } from "~/helpers/sdk/flight/flight-functions";
import { getSkyscannerMultiCityLink } from "~/helpers/sdk/skyscanner-website";
import type { QueryPlace } from "~/types/search";

interface FlightTimelineProps {
  leg: LegSDK;
  query: QueryPlace;
  showStopOvers?: boolean;
}
export const FlightTimeline = ({ leg, query, showStopOvers = false }: FlightTimelineProps) => {
  return (
    <div>
      <div className="px-4 py-4">
        {leg.segments.map((segment, segmentKey) => {
          const duration = toHoursAndMinutes(segment.duration);
          const durationShow = `${
            duration.hours && duration.hours > 0 && `${duration.hours}h `
          }${duration.minutes}m`;
          const isLastSegment =
            segment.id === leg.segments[leg.segments.length - 1].id;
          const notLastSegment = !isLastSegment;

          return (
            <React.Fragment key={segmentKey}>
              <ol className="relative">
                {/* from date with icon */}
                <li className="ml-8">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
                    <FaPlaneDeparture />
                  </span>
                  <div>{segment.departure}</div>
                </li>
                {/* info from */}
                <li className="relative ml-8">
                  <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {segment.from} ({segment.fromIata})
                  </h3>
                  <div className="text-sm text-slate-500">
                  {segment.marketingCarrier?.name} - {segment.flightNumber}{segment.isOpperatedByDifferentCarrier ? ` | Operated by ${segment.operatingCarrier?.name}` : ''}
                  </div>
                </li>
                {/* duration */}
                <li className="p-5 ml-8 relative">
                  <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                      Flight takes {durationShow}
                    </div>
                  </time>
                </li>
                {/* to date with icon */}
                <li className="ml-8">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
                    <FaPlaneArrival />
                  </span>
                  <div>{segment.arrival}</div>
                </li>
                {/* info to */}
                <li className="relative ml-8">
                  {segment.nextSegment.hasNextSegment ? (
                    <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-slate-700 rounded-lg py-4 z-10"></div>
                  ) : (
                    ""
                  )}
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {segment.to} ({segment.toIata})
                  </h3>
                  {showStopOvers && notLastSegment ? (
                    <div className="text-xs text-slate-400">
                      <span className="mr-2">Add a stop over:</span>
                      {[1, 2, 3, 5].map((days, key) => (
                        <a
                          key={key}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                          href={getSkyscannerMultiCityLink(
                            leg,
                            query,
                            segment.toIata,
                            days
                          )}
                        >
                          + {days} day{days === 1 ? "" : "s"}
                        </a>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </li>
                {segment.nextSegment.hasNextSegment ? (
                  <li className="ml-8 py-8 relative">
                    <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-slate-700 rounded-lg py-4 z-10"></div>
                    <div className="block mb-2 text-sm font-normal">
                      <div className="inline-block bg-slate-100 text-slate-700 font-medium my-2 px-4 py-4 rounded-lg dark:bg-slate-700 dark:text-slate-300 ms-3">
                        {segment.waitBreakdown.longWait ? (
                          <>
                            <IoMdTimer className="mr-2 inline text-xl" />{" "}
                            {segment.waitBreakdown.exploreCityWait ? (
                              <>
                                Long wait, maybe explore{" "}
                                <span className="font-bold">{segment.to}</span>{" "}
                                with{" "}
                                <span className="font-bold">
                                  {segment.waitBreakdown.wait} Layover
                                </span>
                              </>
                            ) : (
                              <>
                                Long wait,{" "}
                                <span className="font-bold">
                                  {segment.waitBreakdown.wait} Layover
                                </span>{" "}
                                in{" "}
                                <span className="font-bold">{segment.to}</span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-bold">
                              {segment.waitBreakdown.wait} Layover
                            </span>{" "}
                            in <span className="font-bold">{segment.to}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ol>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
