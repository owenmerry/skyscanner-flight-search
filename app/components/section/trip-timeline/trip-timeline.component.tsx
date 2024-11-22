import moment from "moment";
import { FaCarSide, FaHotel, FaPlaneDeparture } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

interface TripTimelineProps {}
export const TripTimeline = ({}: TripTimelineProps) => {
  const trip = {
    days: [
      { date: "2025-02-01" },
      { date: "2025-02-02" },
      { date: "2025-02-03" },
      { date: "2025-02-04" },
    ],
  };
  return (
    <div>
      <div className="px-4 py-4">
        <ol className="relative">
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <FaPlaneDeparture />
            </span>
            <div>Day 1</div>
          </li>
          {/* info from */}
          <li className="relative ml-8">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {moment(trip.days[0].date).format("dddd, Do MMMM")}
            </h3>
            <div className="text-xs text-slate-400">
              <a
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                href={"/"}
              >
                <FaCarSide className="mr-2" /> Car Hire
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                href={"/"}
              >
                <FaHotel className="mr-2" /> Hotel
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                href={"/"}
              >
                <FaPlaneDeparture className="mr-2" /> Flight
              </a>
            </div>
          </li>
          {/* duration */}
          <li className="py-5 ml-8 relative">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </div>
            <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </div>
            <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </div>
            <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </div>
            <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </div>
          </li>
          {/* to date with icon */}
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <MdDateRange />
            </span>
            <div>Day 2</div>
          </li>
          <li className="relative ml-8">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {moment(trip.days[1].date).format("dddd, Do MMMM")}
            </h3>
          </li>
          <li className="py-5 ml-8 relative">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </time>
          </li>
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <MdDateRange />
            </span>
            <div>Day 3</div>
          </li>
          <li className="relative ml-8">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {moment(trip.days[2].date).format("dddd, Do MMMM")}
            </h3>
          </li>
          <li className="py-5 ml-8 relative">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                Nothing here
              </div>
            </time>
          </li>
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-3 ring-6 ring-white dark:ring-gray-700 dark:bg-blue-600 z-20 shadow-md">
              <FaPlaneDeparture />
            </span>
            <div>Day 4</div>
          </li>
          <li className="relative ml-8">
            <div className="absolute -top-[4px] -left-8 w-2 h-[calc(100%+8px)] bg-blue-800 rounded-lg py-4 z-10"></div>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {moment(trip.days[3].date).format("dddd, Do MMMM")}
            </h3>
            <div className="text-xs text-slate-400">
              <span className="mr-2">Add a stop over:</span>
              {[1, 2, 3, 5].map((days, key) => (
                <a
                  key={key}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  href={"/"}
                >
                  + {days} day{days === 1 ? "" : "s"}
                </a>
              ))}
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
