import { toHoursAndMinutes } from "~/helpers/sdk/dateTime";
import type { FlightSDK } from "~/helpers/sdk/flight/flight-functions";
import { getSkyscannerMultiCityLink } from "~/helpers/sdk/skyscanner-website";
import type { QueryPlace } from "~/types/search";

interface FlightDetailsProps {
  flight: FlightSDK;
  query: QueryPlace;
}

export const FlightDetails = ({ flight, query }: FlightDetailsProps) => {
  return (
    <div className="px-4">
      {flight.legs.map((leg, legKey) => {
        const isReturn = legKey > 0;
        return (
          <div key={legKey}>
            <div>{isReturn ? 'Return' : 'Departure'}</div>
            {leg.segments.map((segment, segmentKey) => {
              const duration = toHoursAndMinutes(segment.duration);
              const durationShow = `${
                duration.hours > 0 && `${duration.hours}h `
              }${duration.minutes}m`;
              const isLastSegment =
                segment.id === leg.segments[leg.segments.length - 1].id;
              const notLastSegment = !isLastSegment;

              return (
                <div key={segmentKey}>
                  <ol className="relative border-s border-gray-200 dark:border-gray-700">
                    <li className="mb-10 ms-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg
                          className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {segment.departure} - {segment.from} ({segment.fromIata})
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      Journey time: {durationShow}
                      </time>
                    </li>
                    <li className="mb-10 ms-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg
                          className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </span>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {segment.arrival} - {segment.to} ({segment.toIata})
                      </h3>
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        Get access to over 20+ pages including a dashboard
                        layout, charts, kanban board, calendar, and pre-order
                        E-commerce &amp; Marketing pages.
                      </p>
                      {!isReturn && notLastSegment ? (
                      <div className="text-xs text-slate-400">
                        <span className="mr-2">Add a stop over:</span>
                        {[1, 2, 3, 5].map((days, key) => (
                          <a
                          key={key}
                            target="_blank"
                            rel="noreferrer"
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
                      <a
                        href="#"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                      >
                        Download ZIP
                      </a>
                    </li>
                  </ol>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
