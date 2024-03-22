import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import type { FlightQuery, FlightUrl, QueryPlace } from "~/types/search";
import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import { Timeline } from "flowbite-react";
import {
  getSkyscannerLink,
  getSkyscannerMultiCityLink,
} from "~/helpers/sdk/skyscanner-website";
import {
  FlightSDK,
  LegSDK,
  SearchSDK,
} from "~/helpers/sdk/flight/flight-functions";

interface FlightDetailsProps {
  query?: QueryPlace;
  apiUrl?: string;
  url?: FlightUrl;
  itineraryId?: string;
  flight?: FlightSDK;
  sessionToken?: string;
}

export const FlightDetails = ({
  query,
  apiUrl = "",
  url,
  itineraryId,
  flight,
  sessionToken,
}: FlightDetailsProps): JSX.Element => {
  const [search, setSearch] = useState<FlightSDK | undefined>(flight);

  return (
    <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
      {query && search ? (
        <div>
          <div className="flight" key={search.itineraryId}>
            <div className="hidden">
              <div>id: {search.itineraryId}</div>
            </div>

            <div className="flight-details">
              {search.legs.map((leg, key) => {
                return (
                  <div>
                    <div className="mb-6">
                      {key === 0 && (
                        <h3 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
                          {query?.from.name} to {query?.to.name} Flight
                        </h3>
                      )}
                      {key === 1 && (
                        <h3 className="mt-8 mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
                          {query?.to.name} to {query?.from.name} Flight
                        </h3>
                      )}
                    </div>
                    <div
                      key={leg.id}
                      className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-800"
                    >
                      <SegmentsColumn flight={search} number={key} />
                      <div className="mt-6">
                        <LegTimeline
                          leg={leg}
                          query={query}
                          isReturn={key === 1}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {query ? (
              <div>
                <div className="mt-4">
                  <a
                    target="_blank"
                    className="ml-4 text-slate-400 text-xs hover:underline"
                    href={getSkyscannerLink(query, itineraryId)}
                  >
                    See Search On Skyscanner{" "}
                    <svg
                      width="13.5"
                      height="13.5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="ml-1 inline-block"
                    >
                      <path
                        fill="currentColor"
                        d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                      ></path>
                    </svg>
                  </a>

                  <a
                    target="_blank"
                    className="ml-4 text-slate-400 text-xs hover:underline"
                    href={`${apiUrl}/refresh?itineraryId=${search.itineraryId}&token=${sessionToken}`}
                  >
                    {" "}
                    See Refresh Data
                    <svg
                      width="13.5"
                      height="13.5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="ml-1 inline-block"
                    >
                      <path
                        fill="currentColor"
                        d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="flight-layout">
              {/* Deals */}
              <div>
                <h2 className="mt-8 mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
                  Deals{" "}
                </h2>
                {/* {search.status !== "RESULT_STATUS_COMPLETE" && (
                  <div className="text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl dark:bg-gray-800">
                    Checking prices and availability... <Loading />
                  </div>
                )} */}
                <Deals flight={search} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

interface LegTimelineProps {
  leg: LegSDK;
  query: QueryPlace;
  isReturn?: boolean;
}
export const LegTimeline = ({
  leg,
  query,
  isReturn = true,
}: LegTimelineProps) => {
  return (
    <div>
      <Timeline>
        {leg.segments.map((segment) => {
          const duration = toHoursAndMinutes(segment.duration);
          const durationShow = `${duration.hours > 0 && `${duration.hours}h `}${
            duration.minutes
          }m`;
          const isLastSegment =
            segment.id === leg.segments[leg.segments.length - 1].id;
          const notLastSegment = !isLastSegment;
          return (
            <div>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{segment.departure}</Timeline.Time>
                  <Timeline.Title>
                    {segment.from} ({segment.fromIata})
                  </Timeline.Title>
                  <Timeline.Body>
                    <p>Journey time: {durationShow}</p>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{segment.arrival}</Timeline.Time>
                  <Timeline.Title>
                    <div>
                      {segment.to} ({segment.toIata})
                    </div>
                    {!isReturn && notLastSegment ? (
                      <div className="text-xs text-slate-400">
                        <span className="mr-2">Add a stop over:</span>
                        {[1, 2, 3, 5].map((days) => (
                          <a
                            target="_blank"
                            className="mr-2 underline text-slate-400 hover:text-white"
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
                  </Timeline.Title>
                </Timeline.Content>
              </Timeline.Item>
            </div>
          );
        })}
      </Timeline>
    </div>
  );
};

interface SegmentsProps {
  flight: FlightSDK;
  number: number;
}
const SegmentsColumn = ({ flight, number }: SegmentsProps) => {
  return (
    <div className="col-span-2 flex-1">
      {[flight.legs[number]].map((leg) => {
        const duration = toHoursAndMinutes(leg.duration);
        const durationShow = `${duration.hours > 0 && `${duration.hours}h `}${
          duration.minutes
        }m`;
        return (
          <div key={`leg-${leg.id}`} className="flex pb-4 last:pb-0">
            <div className="">
              {leg.carriers.map((carrier, key) => (
                <div
                  key={`carrier-${carrier.name}-${key}`}
                  className="bg-white inline-block border-slate-50 border-2 mr-2"
                >
                  <img
                    className="inline-block w-20 p-1"
                    src={carrier.imageUrl}
                  />
                  {/* <div className="hidden md:block self-center text-sm text-slate-400">{carrier.name}</div> */}
                </div>
              ))}
            </div>

            <div className="text-center flex-1">
              <div className="text-xl font-bold dark:text-white">
                {leg.departureTime}
              </div>
              <div className="text-slate-400">{leg.fromIata}</div>
            </div>

            <div className="text-center flex-1">
              <div className="text-slate-400 text-sm">{durationShow}</div>
              <hr className="my-2 dark:border-gray-700" />
              <div className="text-slate-400 text-sm">
                {leg.direct
                  ? "Direct"
                  : leg.stops === 1
                  ? "1 Stop"
                  : `${leg.stops} Stops`}
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="text-xl font-bold dark:text-white">
                {leg.arrivalTime}
              </div>
              <div className="text-slate-400">{leg.toIata}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface DealsProps {
  flight: FlightSDK;
}
const Deals = ({ flight }: DealsProps) => {
  return (
    <div className="pt-2">
      {flight.prices.map((price, key) => (
        <div
          key={`price-${price.price}-${key}`}
          className="border-slate-100 bg-slate-50 border-b-2 dark:bg-gray-800 dark:border-gray-600"
        >
          {price.deepLinks.map((deepLink) => (
            <div
              key={deepLink.link}
              className="grid grid-cols-3 md:grid-cols-4 items-center p-4"
            >
              <div className="">
                <div className="bg-white inline-block">
                  <img
                    className="inline-block w-20 p-1"
                    src={deepLink.agentImageUrl}
                  />
                </div>
              </div>
              <div className="hidden md:block dark:text-white">
                {deepLink.agentName}
                {deepLink.type === "AGENT_TYPE_AIRLINE" ? (
                  <div>
                    <Label color="green" text="Airline Option" />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="font-bold text-center md:text-left dark:text-white">
                {price.price !== "£0.00" ? price.price : "See Website"}
                {deepLink.type === "AGENT_TYPE_AIRLINE" ? (
                  <div className="md:hidden">
                    <Label color="green" text="Airline Option" />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="self-end">
                <a
                  href={deepLink.link}
                  target="_blank"
                  className="inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Book{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface LabelsProps {
  flight: FlightSDK;
  labels: {
    text: string;
    labelBg: string;
    show: boolean;
  }[];
}
const Labels = ({ labels, flight }: LabelsProps) => {
  return (
    <div className="mb-2">
      {labels.map((label, key) => (
        <Fragment key={`label-${label.text}-${key}`}>
          {label.show ? <Label color={label.labelBg} text={label.text} /> : ""}
        </Fragment>
      ))}
    </div>
  );
};
interface LabelProps {
  text?: string;
  color?: string;
}
const Label = ({ text = "Label", color = "purple" }: LabelProps) => {
  return (
    <span
      className={` bg-${color}-100 text-${color}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-200 dark:text-${color}-900`}
    >
      {text}
    </span>
  );
};
