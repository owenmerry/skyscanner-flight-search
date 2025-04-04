import { useEffect, useState } from "react";
import { Form, Link, useNavigation } from "@remix-run/react";
import type { Query, QueryPlace } from "~/types/search";
import { Location } from "~/components/ui/location";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { Loading } from "~/components/ui/loading/loading.component";
import { DateSelector } from "../../date/date-selector";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId, getPlaceFromIata } from "~/helpers/sdk/place";
import type { SearchForm } from "../flight-controls-app";

export interface FlightsSearchFormProps {
  apiUrl?: string;
  buttonLoading?: boolean;
  flightDefault?: Query;
  showPreviousSearches?: boolean;
  onSearch?: (query: QueryPlace) => void;
  onChange?: (query: QueryPlace) => void;
  useForm?: boolean;
  selected?: SearchForm;
  rounded?: boolean;
  hasBackground?: boolean;
  from?: Place;
}

export const FlightsSearchForm: React.FC<FlightsSearchFormProps> = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
  showPreviousSearches = true,
  useForm,
  from,
  onSearch,
  onChange,
  hasBackground = true,
}) => {
  const defaultQuery: Query = flightDefault
    ? flightDefault
    : getDefualtFlightQuery({ from });
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [switchRotate, setSwitchRotate] = useState<boolean>(false);

  const convertQuerytoQueryPlace = (query: Query): QueryPlace | null => {
    const fromPlace = getPlaceFromEntityId(query.from);
    const toPlace = getPlaceFromEntityId(query.to);
    if (!fromPlace || !toPlace) return null;
    const queryPlace: QueryPlace = {
      from: fromPlace,
      to: toPlace,
      depart: query.depart,
      return: query.return,
    };

    return queryPlace;
  };

  const handleDatesChange = (dates: DatesQuery) => {
    setQuery({
      ...query,
      depart: dates.depart,
      return: dates.return,
    });
  };
  const handleLocationSwap = () => {
    setSwitchRotate(!switchRotate);
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
    const place = getPlaceFromIata(iataCode);
    setQuery({
      ...query,
      [`${key}`]: value,
      [`${key}Iata`]: iataCode,
      [`${key}Text`]: place && "iata" in place ? place.name : "",
    });
  };
  const handleSearchClicked = () => {
    if (onSearch) {
      const queryPlace = convertQuerytoQueryPlace(query);
      if (!queryPlace) return;
      onSearch(queryPlace);
      return;
    }
    setLoading(true);
  };
  const navigation = useNavigation();

  useEffect(() => {
    const queryPlace = convertQuerytoQueryPlace(query);
    if (!queryPlace) return;

    onChange && onChange(queryPlace);
  }, [query]);

  return (
    <Form
      method="post"
      className={`grid gap-y-4 w-full rounded lg:gap-x-4 lg:grid-cols-9 ${
        hasBackground ? `dark:bg-gray-800 bg-white` : ""
      }`}
    >
      <input
        type="hidden"
        name="from"
        value={JSON.stringify(getPlaceFromEntityId(query.from))}
      />
      <input type="hidden" name="to" value={query.toIata} />
      <input type="hidden" name="depart" value={query.depart} />
      <input type="hidden" name="return" value={query.return} />
      <div className="lg:col-span-2 relative">
        <Location
          name="From"
          defaultValue={query.fromText}
          apiUrl={apiUrl}
          onSelect={(value, iataCode) =>
            handleLocationChange(value, "from", iataCode)
          }
        />
        <div className="absolute top-1 -right-5 z-30">
          <div
            onClick={() => handleLocationSwap()}
            className={`rounded-full p-2 bg-blue-600 shadow hover:scale-110 hover:bg-blue-500 ${
              switchRotate ? `rotate-180` : ""
            } transition cursor-pointer`}
          >
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <Location
          name="To"
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
      {onSearch ? (
        <div
          className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
          onClick={handleSearchClicked}
        >
          Add Flight
        </div>
      ) : (
        <>
          {useForm ? (
            <button
              className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
              type="submit"
            >
              {navigation.state === "loading" ? (
                <>
                  <span>
                    <Loading
                      light
                      height="5"
                      aria-label="Spinner button example"
                    />
                  </span>
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
            </button>
          ) : (
            <Link
              rel="nofollow"
              to={`/search/${query.fromIata}/${query.toIata}/${query.depart}/${query.return}`}
              className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
              onClick={handleSearchClicked}
            >
              {navigation.state === "loading" && loading ? (
                <>
                  <span>
                    <Loading
                      light
                      height="5"
                      aria-label="Spinner button example"
                    />
                  </span>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                <>
                  <span>
                    <svg
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </span>
                  <span className="pl-3 font-semibold">Search</span>
                </>
              )}
            </Link>
          )}
        </>
      )}
    </Form>
  );
};
