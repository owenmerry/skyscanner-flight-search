import { MdDateRange } from "react-icons/md";

interface TripTimelineProps {}
export const TripTimeline = ({}: TripTimelineProps) => {
  return (
    <div>
      <div className="px-4 py-4">
        <ol className="relative">
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <MdDateRange />
            </span>
            <div>departure</div>
          </li>
          {/* info from */}
          <li className="relative ml-8">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              from (iata)
            </h3>
          </li>
          {/* duration */}
          <li className="p-5 ml-8 relative">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Flight takes ...
              </div>
            </time>
          </li>
          {/* to date with icon */}
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <MdDateRange />
            </span>
            <div>arrival</div>
          </li>
        </ol>
      </div>
    </div>
  );
};
