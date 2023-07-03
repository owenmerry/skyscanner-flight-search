import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import type { FlightQuery, FlightUrl } from "~/types/search";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { SearchSDK, FlightSDK, LegSDK } from "~/helpers/sdk/skyscannerSDK";
import { waitSeconds } from "~/helpers/utils";
import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import { Timeline } from "flowbite-react";
import { Button } from "flowbite-react";

import { Link } from "@remix-run/react";

import { Loading } from "~/components/loading";
import { Prices } from "~/components/prices";

interface FlightDetailsProps {
  query?: FlightQuery;
  apiUrl?: string;
  url?: FlightUrl;
  itineraryId?: string;
}

export const FlightDetails = ({
  query,
  apiUrl = "",
  url,
  itineraryId,
}: FlightDetailsProps): JSX.Element => {
  const [search, setSearch] = useState<SearchSDK | false>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sort, setSort] = useState<"best" | "cheapest" | "fastest">("best");
  const [results, setResults] = useState(10);
  const [retry, setRetry] = useState(0);
  const maxRetry = 10;
  const sessionTokenSaved = useRef<string>("");
  const foundFlight = !!(
    search &&
    search[sort].filter((item) => item.itineraryId === itineraryId).length > 0
  );

  const pollFlights = useCallback(
    async (token: string) => {
      await waitSeconds(1);
      try {
        const res = await fetch(`${apiUrl}/poll/${token}`);
        const json = await res.json();

        if (
          !json ||
          json.statusCode === 500 ||
          (json.statusCode && json.statusCode !== 200) ||
          json.code
        ) {
          if (retry < maxRetry) {
            setRetry(retry + 1);
            pollFlights(token);
          } else {
            setError(
              `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:${retry}|1)`
            );
            setSearching(false);
          }
        } else {
          setSearch(skyscanner().search(json));

          // run again until is complete
          if (
            json.status === "RESULT_STATUS_INCOMPLETE" &&
            sessionTokenSaved.current === token
          ) {
            pollFlights(token);
          }
        }
      } catch (ex) {
        setSearching(false);
        if (retry < maxRetry) {
          setRetry(retry + 1);
          pollFlights(token);
        } else {
          setError(
            `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:${retry}|2)`
          );
        }
      }
    },
    [apiUrl]
  );

  const handleSearch = useCallback(
    async (query: FlightQuery) => {
      setSearch(false);
      setSearching(true);
      setError("");
      setResults(10);

      try {
        const res = await fetch(
          `${apiUrl}/create?from=${query.from}&to=${query.to}&depart=${
            query.depart
          }${query?.return ? `&return=${query.return}` : ""}`
        );
        const json = await res.json();

        if (
          !json ||
          json.statusCode === 500 ||
          (json.statusCode && json.statusCode !== 200) ||
          json.code
        ) {
          setSearching(false);
          setError(
            `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:${retry}|3)`
          );
        } else {
          setSearch(skyscanner().search(json));
          sessionTokenSaved.current = json.sessionToken;
          setSearching(false);

          pollFlights(json.sessionToken);
        }
      } catch (ex) {
        setSearching(false);
        if (retry < maxRetry) {
          setRetry(retry + 1);
          handleSearch(query);
        } else {
          setError(
            `Sorry, something happened and we couldnt do this search. (code:${retry}|4)`
          );
        }
      }
    },
    [apiUrl, pollFlights]
  );

  const handleSort = (sortType: "best" | "cheapest" | "fastest") => {
    setSort(sortType);
  };

  const handleShowResults = (amount: number) => {
    setResults(amount);
  };

  useEffect(() => {
    query && handleSearch(query);
  }, [query, handleSearch]);

  return (
    <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
      {(searching || !foundFlight) && (
        <div className="loading">
          Loading Flight Details and Prices <Loading />
        </div>
      )}
      {error !== "" && <div className="error">{error}</div>}
      {search && (
        <div>
          {search[sort]
            .filter((item) => item.itineraryId === itineraryId)
            .map((itinerary) => {
              return (
                <div className="flight" key={itinerary.itineraryId}>
                  <div className="hidden">
                    <div>id: {itinerary.itineraryId}</div>
                  </div>

                  <div className="flight-details">
                    {itinerary.legs.map((leg, key) => {
                      return (
                        <div>
                          <div className="mb-6">
                            {key === 0 && <h3 className="text-xl">Outbound</h3>}
                            {key === 1 && <h3 className="text-xl">Return</h3>}
                          </div>
                          <div
                            key={leg.id}
                            className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-800"
                          >
                            <SegmentsColumn flight={itinerary} number={key} />
                            <LegTimeline leg={leg} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flight-layout">
                    {/* Deals */}
                    <div>
                      <h2 className="text-xl mb-2 mt-6">Deals </h2>
                      {search.status !== "RESULT_STATUS_COMPLETE" && (
                        <>
                          Checking prices and availability... <Loading />
                        </>
                      )}
                      <Deals flight={itinerary} />
                      {/* <Prices
                        url={url}
                        flight={itinerary}
                        query={query}
                        open
                        showButton={false}
                      /> */}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

interface LegTimelineProps {
  leg: LegSDK;
}
const LegTimeline = ({ leg }: LegTimelineProps) => {
  return (
    <div className="mt-6">
      <Timeline>
        {leg.segments.map((leg) => {
          const duration = toHoursAndMinutes(leg.duration);
          const durationShow = `${duration.hours > 0 && `${duration.hours}h `}${
            duration.minutes
          }m`;
          return (
            <>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{leg.departure}</Timeline.Time>
                  <Timeline.Title>{leg.from}</Timeline.Title>
                  <Timeline.Body>
                    <p>Journey time: {durationShow}</p>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{leg.arrival}</Timeline.Time>
                  <Timeline.Title>{leg.to}</Timeline.Title>
                </Timeline.Content>
              </Timeline.Item>
            </>
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
                <Button href={deepLink.link} target="_blank">
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
                </Button>
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
