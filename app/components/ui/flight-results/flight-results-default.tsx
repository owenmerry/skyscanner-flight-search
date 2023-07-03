import { useState, Fragment } from "react";
import { Button } from "flowbite-react";
import { FlightSDK, SearchSDK } from "~/helpers/sdk/skyscannerSDK";
import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import type { SearchFilters } from "~/helpers/sdk/filters";
import type { Query } from "~/types/search";
import { addSearchResultFilters } from "~/helpers/sdk/filters";

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
            className="grid grid-cols-3 pb-4 last:pb-0"
          >
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

            <div className="col-span-2 grid grid-cols-3 flex-1">
              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">
                  {leg.departureTime}
                </div>
                <div className="text-slate-400">{leg.fromIata}</div>
              </div>

              <div className="text-center">
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

              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">
                  {leg.arrivalTime}
                </div>
                <div className="text-slate-400">{leg.toIata}</div>
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

interface ButtonColumnProps {
  flight: FlightSDK;
  showDeals: boolean;
  onButtonSelect: () => void;
  query: Query;
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
      </div>
      <div>
        <Button
          className="ml-2"
          href={`/search-flight/${query.fromIata}/${query.toIata}/${query.depart}/${query.return}/${flight.itineraryId}`}
        >
          Select
        </Button>
        <Button outline className="ml-2 mt-2" onClick={onButtonSelect}>
          {showDeals ? "Hide Details" : "Show Details"}
        </Button>
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
const Label = ({ text = "Label", color = "purple" }: LabelProps) => {
  return (
    <span
      className={` bg-${color}-100 text-${color}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-200 dark:text-${color}-900`}
    >
      {text}
    </span>
  );
};

interface FlightProps {
  flight: FlightSDK;
  flights: SearchSDK;
  query: Query;
}
const Flight = ({ flight, flights, query }: FlightProps) => {
  const [showDeals, setShowDeals] = useState(false);
  const labels = [
    {
      text: "Direct",
      labelBg: "purple",
      show: flight.isDirectFlights,
    },
    {
      text: "Airline Option",
      labelBg: "green",
      show:
        flight.prices.filter(
          (price) =>
            price.deepLinks.filter((link) => link.type === "AGENT_TYPE_AIRLINE")
              .length > 0
        ).length > 0,
    },
    {
      text: "Cheapest",
      labelBg: "yellow",
      show: flight.itineraryId === flights.cheapest[0].itineraryId,
    },
    {
      text: "Mashup",
      labelBg: "yellow",
      show:
        flight.prices.filter((price) => price.deepLinks.length > 1).length > 0,
    },
  ];

  return (
    <div className="mb-2">
      <div className="border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-800">
        <Labels flight={flight} labels={labels} />
        <div className="md:flex">
          <SegmentsColumn flight={flight} />
          <ButtonColumn
            flight={flight}
            onButtonSelect={() => setShowDeals(!showDeals)}
            showDeals={showDeals}
            query={query}
          />
        </div>
        {showDeals ? (
          <div>
            <Deals flight={flight} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

interface PagingProps {
  total?: number;
  shown?: number;
  onShowMore?: (number: number) => void;
}

const Paging = ({
  shown = 100,
  total = 1000,
  onShowMore = (number: number) => {},
}: PagingProps) => {
  return (
    <>
      {total > shown ? (
        <div className="my-4 text-center">
          <button
            className="text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg ml-2"
            onClick={() => onShowMore(shown + 100)}
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

interface FlightResultsDefaultProps {
  flights?: SearchSDK;
  filters?: SearchFilters;
  query?: Query;
}

export const FlightResultsDefault = ({
  flights,
  filters = {},
  query,
}: FlightResultsDefaultProps) => {
  if (!flights || !query) return <></>;

  const [results, setResults] = useState(filters.numberOfResultsToShow || 10);
  const filteredResults = () =>
    addSearchResultFilters(flights.cheapest, {
      ...filters,
      numberOfResultsToShow: results,
    });

  return (
    <div>
      <div className="border-2 border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800">
        Showing<b className="px-1">1-{results}</b>of
        <b className="px-1">{filteredResults().total}</b>
      </div>
      {filteredResults().results.map((flight) => {
        return (
          <Flight
            flight={flight}
            flights={flights}
            key={flight.itineraryId}
            query={query}
          />
        );
      })}
      <Paging
        total={filteredResults().total}
        shown={results}
        onShowMore={(amount) => setResults(amount)}
      />
    </div>
  );
};
