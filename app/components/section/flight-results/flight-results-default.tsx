import { useState, Fragment } from "react";
import { Tooltip } from "flowbite-react";
import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import type { SearchFilters } from "~/helpers/sdk/filters";
import type { QueryPlace } from "~/types/search";
import { addSearchResultFilters } from "~/helpers/sdk/filters";
import {
  getSkyscannerLink,
  getSkyscannerSearchLink,
} from "~/helpers/sdk/skyscanner-website";
import { LegTimeline } from "../flight-details/flight-details.component";
import type {
  FlightSDK,
  SearchSDK,
} from "~/helpers/sdk/flight/flight-functions";
import { FlightResultsSkeleton } from "./flight-results-skeleton";
import { JourneyDrawer } from "~/components/ui/drawer/drawer-journey";
import { FlightDetails } from "./flight-details";

interface SegmentsProps {
  flight: FlightSDK;
}
const SegmentsColumn = ({ flight }: SegmentsProps) => {
  return (
    <div className="col-span-2 flex-1">
      {flight.legs.map((leg) => {
        const duration = toHoursAndMinutes(leg.duration);
        const durationShow = `${duration.hours > 0 && `${duration.hours}h `}${
          duration.minutes
        }m`;
        return (
          <div
            key={`leg-${leg.id}`}
            className="grid grid-cols-2 pb-4 last:pb-0"
          >
            {/* <div className="">
              {leg.carriers.map((carrier, key) => (
                <div
                  key={`carrier-${carrier.name}-${key}`}
                  className="bg-white inline-block border-slate-50 border-2 mr-2"
                >
                  <img
                    className="inline-block w-20 p-1"
                    src={carrier.imageUrl}
                  />
                </div>
              ))}
            </div> */}

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
                <div className="text-slate-400 text-sm">{durationShow}</div>
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
        );
      })}
    </div>
  );
};

interface DealsProps {
  flight: FlightSDK;
  query: QueryPlace;
}
const Deals = ({ flight, query }: DealsProps) => {
  return (
    <div className="pt-2">
      {flight.prices.map((price, key) => (
        <div
          key={`price-${price.price}-${key}`}
          className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md mb-2"
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
                    <Label color="emerald" text="Airline Option" />
                  </div>
                ) : (
                  ""
                )}
                {price.deepLinks.length > 1 ? (
                  <div className="">
                    <Label color="yellow" text="Mashup" />
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
                    className="w-4 h-4 ml-1"
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

interface ButtonColumnProps {
  flight: FlightSDK;
  showDeals: boolean;
  onButtonSelect: () => void;
  query: QueryPlace;
}
const ButtonColumn = ({
  flight,
  onButtonSelect,
  showDeals,
  query,
}: ButtonColumnProps) => {
  return (
    <div className="self-center flex mt-2 md:mt-0">
      <div className="self-center flex-1 text-right">
        <span className="text-sm text-slate-400">from</span>{" "}
        <span className="text-xl font-bold dark:text-white">
          {flight.price.split(".")[0]}
        </span>
        <div>
          {flight.prices[0].deepLinks[0].agentImageUrl.length > 0 ? (
            <div className="bg-white inline-block">
              <Tooltip
                content={flight.prices[0].deepLinks[0].agentName}
                className=""
              >
                <img
                  className="inline-block w-10 p-1"
                  src={flight.prices[0].deepLinks[0].agentImageUrl}
                />
              </Tooltip>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="sm:display hidden">
        <a
          target="_blank"
          className="ml-2 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          href={`/booking/${query.from.iata}/${query.to.iata}/${query.depart}${
            query.return ? `/${query.return}` : ``
          }/${encodeURIComponent(flight.itineraryId)}`}
        >
          Details{" "}
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
        <button
          className="ml-2 mt-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-white dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          onClick={onButtonSelect}
          color="blue"
        >
          {showDeals ? "Hide Details" : "Quick Details"}
        </button>
        <div>
          <div className="mt-4 text-center">
            <a
              target="_blank"
              className="text-slate-400 text-xs hover:underline"
              href={getSkyscannerLink(query, flight.itineraryId)}
            >
              View On Skyscanner{" "}
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
      </div>
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
const Label = ({
  text = "Label",
  color = "bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900",
}: LabelProps) => {
  return (
    <span
      className={` ${color} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded whitespace-nowrap`}
    >
      {text}
    </span>
  );
};

interface FlightProps {
  flight: FlightSDK;
  flights: SearchSDK;
  query: QueryPlace;
  apiUrl: string;
  googleApiKey: string;
  googleMapId: string;
}
const Flight = ({
  flight,
  flights,
  query,
  apiUrl,
  googleApiKey,
  googleMapId,
}: FlightProps) => {
  const [showDeals, setShowDeals] = useState(false);
  const labels = [
    {
      text: "Direct",
      labelBg:
        "bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900",
      show: flight.isDirectFlights,
    },
    {
      text: "Airline Option",
      labelBg:
        "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
      show:
        flight.prices.filter(
          (price) =>
            price.deepLinks.filter((link) => link.type === "AGENT_TYPE_AIRLINE")
              .length > 0
        ).length > 0,
    },
    {
      text: "Cheapest",
      labelBg:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
      show: flight.itineraryId === flights.cheapest[0].itineraryId,
    },
    {
      text: "Best",
      labelBg:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
      show: flight.itineraryId === flights.best[0].itineraryId,
    },
    {
      text: "Fastest",
      labelBg:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
      show: flight.itineraryId === flights.fastest[0].itineraryId,
    },
    {
      text: "Mashup",
      labelBg:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
      show:
        flight.prices.filter((price) => price.deepLinks.length > 1).length > 0,
    },
  ];

  return (
    <>
      <JourneyDrawer>
        <div className="mb-2">
          <div className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 hover:dark:border-gray-600 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md transition ease-in-out">
            <Labels flight={flight} labels={labels} />
            <div className="flex">
              <SegmentsColumn flight={flight} />
              <ButtonColumn
                flight={flight}
                onButtonSelect={() => setShowDeals(!showDeals)}
                showDeals={showDeals}
                query={query}
              />
            </div>
          </div>
        </div>
        <div className="mx-4 md:mx-10">
          {/* <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
            <MapRoute
              flightQuery={query}
              googleMapId={googleMapId}
              googleApiKey={googleApiKey}
              apiUrl={apiUrl}
              key="map-component"
              height={200}
              itineraryId={flight.itineraryId}
              flight={flight}
            />
          </div> */}
          <h2 className="mt-10 mb-8 text-2xl font-bold tracking-tight leading-none">
            Trip Details
          </h2>
          <div className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md">
         <FlightDetails flight={flight} query={query} />
          </div>
          <h2 className="mt-10 mb-8 text-2xl font-bold tracking-tight leading-none">
            Choose a booking option
          </h2>
          <Deals flight={flight} query={query} />
        </div>
      </JourneyDrawer>
      {/* <a
      target="_blank"
      className="cursor-pointer"
      href={`/booking/${query.from.iata}/${query.to.iata}/${query.depart}${
        query.return ? `/${query.return}` : ``
      }/${encodeURIComponent(flight.itineraryId)}`}
    >

    </a> */}
    </>
  );
};

interface PagingProps {
  total?: number;
  shown?: number;
  onShowMore?: (number: number) => void;
}

const Paging = ({
  shown = 10,
  total = 1000,
  onShowMore = (number: number) => {},
}: PagingProps) => {
  return (
    <>
      {total > shown ? (
        <div className="py-4 text-center">
          <button
            className="text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg ml-2"
            onClick={() => onShowMore(shown + 10)}
          >
            <span className="flex items-center rounded-md text-sm px-4 py-2">
              Show more results (Showing<b className="px-1">1-{shown}</b>of
              <b className="px-1">{total}</b>)
            </span>
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const ResultsCount = ({
  headerSticky,
  filteredResults,
  filteredOutResultsTotal,
  nonFilteredResults,
  results,
  query,
}: {
  headerSticky: boolean;
  filteredResults: {
    results: FlightSDK[];
    total: number;
  };
  filteredOutResultsTotal: number;
  nonFilteredResults: FlightSDK[];
  results: number;
  query: QueryPlace;
}) => {
  return (
    <div
      className={`${
        headerSticky ? "sticky top-0" : ""
      } border-2 dark:bg-gray-900 bg-white border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800`}
    >
      Showing<b className="px-1">1-{results}</b>of
      <b className="px-1">{filteredResults.total}</b>
      {filteredOutResultsTotal > 0 ? (
        <span className="ml-2">
          <Label
            text={`${
              nonFilteredResults.length - filteredResults.total
            } Filtered results`}
          />
        </span>
      ) : (
        ""
      )}
      <a
        target="_blank"
        className="ml-4 text-slate-400 text-xs hover:underline"
        href={getSkyscannerSearchLink(query)}
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
    </div>
  );
};

interface FlightResultsDefaultProps {
  flights?: SearchSDK;
  filters?: SearchFilters;
  query?: QueryPlace;
  headerSticky?: boolean;
  numberOfResultsToShow?: number;
  apiUrl: string;
  googleApiKey: string;
  googleMapId: string;
  loading: boolean;
}

export const FlightResultsDefault = ({
  flights,
  filters = {},
  query,
  headerSticky = true,
  numberOfResultsToShow = 10,
  apiUrl,
  googleApiKey,
  googleMapId,
  loading = false,
}: FlightResultsDefaultProps) => {
  const [results, setResults] = useState(
    filters.numberOfResultsToShow || numberOfResultsToShow
  );
  const [sort, setSort] = useState<"cheapest" | "best" | "fastest">("cheapest");

  if (!flights || !query)
    return (
      <div>
        {loading ? (
          <FlightResultsSkeleton
            numberOfResultsToShow={numberOfResultsToShow}
            headerSticky={headerSticky}
          />
        ) : (
          ""
        )}
      </div>
    );
  const filteredResults = () =>
    addSearchResultFilters(flights[sort], {
      ...filters,
      numberOfResultsToShow: results,
    });
  const nonFilteredResults = flights[sort];
  const filteredOutResultsTotal =
    nonFilteredResults.length - filteredResults().total;
  const filteredResultsList = filteredResults();

  return !loading ? (
    <div>
      <div className="flex gap-2">
        <div
          className={`flex-1 border-2 dark:bg-gray-900 bg-white border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white cursor-pointer ${
            sort === "cheapest"
              ? "dark:border-blue-600"
              : "dark:border-gray-800 hover:dark:border-gray-700"
          }`}
          onClick={() => setSort("cheapest")}
        >
          <div className="text-sm font-bold dark:text-white">Cheapest</div>
          <div className="text-sm dark:text-white">{flights.cheapest[0]?.price}</div>
        </div>
        <div
          className={`flex-1 border-2 dark:bg-gray-900 bg-white border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white cursor-pointer ${
            sort === "best" ? "dark:border-blue-600" : "dark:border-gray-800 hover:dark:border-gray-700"
          }`}
          onClick={() => setSort("best")}
        >
          <div className="text-sm font-bold dark:text-white">Best</div>
          <div className="text-sm dark:text-white">{flights.best[0]?.price}</div>
        </div>
        <div
          className={`flex-1 border-2 dark:bg-gray-900 bg-white border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white cursor-pointer ${
            sort === "fastest" ? "dark:border-blue-600" : "dark:border-gray-800 hover:dark:border-gray-700"
          }`}
          onClick={() => setSort("fastest")}
        >
          <div className="text-sm font-bold dark:text-white">Fastest</div>
          <div className="text-sm dark:text-white">{flights.fastest[0]?.price}</div>
        </div>
      </div>
      {/* <ResultsCount
        headerSticky={headerSticky}
        filteredResults={filteredResultsList}
        filteredOutResultsTotal={filteredOutResultsTotal}
        nonFilteredResults={nonFilteredResults}
        results={results}
        query={query}
      /> */}
      {filteredResultsList.results.map((flight) => {
        return (
          <Flight
            flight={flight}
            flights={flights}
            key={flight.itineraryId}
            query={query}
            apiUrl={apiUrl}
            googleApiKey={googleApiKey}
            googleMapId={googleMapId}
          />
        );
      })}
      <Paging
        total={filteredResultsList.total}
        shown={results}
        onShowMore={(amount) => setResults(amount)}
      />
    </div>
  ) : (
    <>
      <FlightResultsSkeleton
        numberOfResultsToShow={numberOfResultsToShow}
        headerSticky={headerSticky}
      />
    </>
  );
};
