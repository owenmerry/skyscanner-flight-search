import React from "react";
import { FaTrain, FaWalking } from "react-icons/fa";
import type { GoogleDetailsResponse } from "~/helpers/sdk/google-details/google-details-response";
import type { GoogleRouteSDK } from "~/helpers/sdk/google-route/google-route-sdk";

interface DirectionsTimelineProps {
  route: GoogleRouteSDK;
  from?: GoogleDetailsResponse;
  to?: GoogleDetailsResponse;
}

export const DirectionTimeline = ({
  route,
  from,
  to,
}: DirectionsTimelineProps) => {
  if ("error" in route) return "";
  return (
    <div>
      {route.routes?.splice(0, 1).map((step, index) => {
        return (
          <div key={index} className="px-4 py-4">
            {step.legs.map((leg, index) => {
              return (
                <div key={index} className="">
                  <div className="flex gap-4 my-4 bg-slate-700 rounded-lg p-4">
                    {from || to ? (
                      <div className="text-lg font-semibold">
                        {from ? from.displayName.text : ""}
                        {to ? to.displayName.text : ""}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="text-lg font-semibold">
                      Distance: {leg.localizedValues.distance.text}
                    </div>
                    <div className="text-lg font-semibold">
                      Duration: {leg.localizedValues.duration.text}
                    </div>
                  </div>
                  {leg.stepsOverview.multiModalSegments.map(
                    (segment, index) => {
                      return (
                        <React.Fragment key={segment.stepStartIndex}>
                          <ol className="relative">
                            {/* from date with icon */}
                            <li className="ml-8">
                              <span
                                className={
                                  "absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md"
                                }
                              >
                                {segment.travelMode === "TRANSIT" ? (
                                  <FaTrain />
                                ) : (
                                  ""
                                )}
                                {segment.travelMode === "WALK" ? (
                                  <FaWalking />
                                ) : (
                                  ""
                                )}
                              </span>
                            </li>
                            {/* info from */}
                            <li className="relative ml-8">
                              <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                {segment.navigationInstruction?.instructions
                                  ? segment.navigationInstruction?.instructions
                                  : `You have arrived ${
                                      to?.displayName.text
                                        ? `at ${to.displayName.text}`
                                        : ""
                                    }`}
                              </h3>
                            </li>
                            {segment.navigationInstruction?.instructions ? (
                              <li className="relative ml-8">
                                <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
                                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-slate-600">
                                  {segment.travelMode === "TRANSIT"
                                    ? "Transport"
                                    : ""}
                                  {segment.travelMode === "WALK" ? "Walk" : ""}
                                </h3>
                              </li>
                            ) : (
                              ""
                            )}
                          </ol>
                        </React.Fragment>
                      );
                    }
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
