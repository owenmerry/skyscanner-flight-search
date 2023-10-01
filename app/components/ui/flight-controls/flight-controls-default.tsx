import { useState } from "react";
import { Link } from "@remix-run/react";
import { Query } from "~/types/search";
import { Location } from "~/components/ui/location";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { Spinner } from "flowbite-react";
import { useNavigation } from "@remix-run/react";
import {
  setFromLocationLocalStorage,
  getSearchFromLocalStorage,
  addSearchToLocalStorage,
  removeAllSearchFromLocalStorage,
} from "~/helpers/local-storage";
import { DateSelector } from "../date/date-selector";
import { getPlaceFromIata } from "~/helpers/sdk/place";

interface FlightControlsProps {
  apiUrl?: string;
  buttonLoading?: boolean;
  flightDefault?: Query;
}
export const FlightControls = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
}: FlightControlsProps) => {
  const defaultQuery: Query = flightDefault
    ? flightDefault
    : getDefualtFlightQuery();
  const [previousSearches, setPreviousSearches] = useState(
    getSearchFromLocalStorage().reverse().slice(0, 5)
  );
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQueryChange = (value: string, key: string) => {
    console.log(query, value, key);
    setQuery({ ...query, [key]: value });
  };
  const handleDatesChange = (dates: DatesQuery) => {
    setQuery({
      ...query,
      depart: dates.depart,
      return: dates.return,
    });
  };
  const handleLocationSwap = () => {
    console.log("swap", query);
    setQuery({
      ...query,
      from: query.to,
      fromIata: query.toIata,
      fromText: query.toText,
      to: query.from,
      toIata: query.fromIata,
      toText: query.fromText,
    });
  };
  const handleLocationChange = (
    value: string,
    key: string,
    iataCode: string
  ) => {
    if (key === "from") setFromLocationLocalStorage(iataCode);
    const place = getPlaceFromIata(iataCode);
    setQuery({
      ...query,
      [`${key}`]: value,
      [`${key}Iata`]: iataCode,
      [`${key}Text`]: place && "iata" in place ? place.name : "",
    });
  };
  const handleSearchClicked = () => {
    setLoading(true);
    addSearchToLocalStorage(query);
  };
  const navigation = useNavigation();

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className=" text-left mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-2xl dark:text-white">
        Search
      </h1>

      <form
        action="#"
        className="grid gap-y-4 mt-8 w-full bg-white rounded lg:gap-x-4 lg:grid-cols-9 lg:mt-4 dark:bg-gray-800"
      >
        <div className="lg:col-span-2 relative">
          <Location
            name="From"
            defaultValue={query.fromText}
            apiUrl={apiUrl}
            onSelect={(value, iataCode) =>
              handleLocationChange(value, "from", iataCode)
            }
          />
          <div className="absolute top-3 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="#fff"
              height="15px"
              width="15px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 489.698 489.698"
              xmlSpace="preserve"
              className="cursor-pointer"
              onClick={() => handleLocationSwap()}
            >
              <g>
                <g>
                  <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1    c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8    c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3    c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z" />
                  <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1    c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8    c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2    c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="lg:col-span-2">
          <Location
            name="From"
            defaultValue={query.toText}
            apiUrl={apiUrl}
            onSelect={(value, iataCode) =>
              handleLocationChange(value, "to", iataCode)
            }
          />
        </div>
        <div className="lg:col-span-3">
          <DateSelector query={query} onDateChange={handleDatesChange} />
        </div>
        <Link
          to={`/search/${query.fromIata}/${query.toIata}/${query.depart}/${query.return}`}
          className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
          onClick={handleSearchClicked}
        >
          {navigation.state === "loading" && loading ? (
            <>
              <Spinner aria-label="Spinner button example" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            <>
              <svg
                className="mr-2 -ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </>
          )}
        </Link>
      </form>
      {previousSearches.length > 0 ? (
        <div className="py-2 text-left md:flex align-middle items-center">
          <h3 className="mr-2 text-left my-4 text-sm tracking-tight leading-none text-gray-500 dark:text-white">
            Previous Searches:
          </h3>
          {previousSearches.map((previousSearch, key) => (
            <Link
              key={`${previousSearch.fromIata}-${previousSearch.toIata}-${key}`}
              to={`/search/${previousSearch.fromIata}/${previousSearch.toIata}/${previousSearch.depart}/${previousSearch.return}`}
              className="mr-2 mb-2 md:mb-0 lg:col-span-2 justify-center md:w-auto text-slate-600 bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 inline-flex items-center"
              onClick={() => setLoading(true)}
            >
              {previousSearch.fromIata} to {previousSearch.toIata}
            </Link>
          ))}
          <div
            className="text-sm cursor-pointer hover:underline text-gray-400 hover:text-gray-600 dark:text-white"
            onClick={() => {
              removeAllSearchFromLocalStorage();
              setPreviousSearches([]);
            }}
          >
            Remove all
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
