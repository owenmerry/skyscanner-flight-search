import { useState } from "react";
import { Link } from "@remix-run/react";
import { DateSimpleInput } from "~/components/date/index";
import { Location } from "~/components/location";
import { getDateFormated } from "~/helpers/date";
import { Spinner } from "flowbite-react";
import { Query } from "~/types/search";
import { useNavigation } from "@remix-run/react";
import {
  setFromLocationLocalStorage,
  getFromPlaceLocalOrDefault,
  getSearchFromLocalStorage,
  addSearchToLocalStorage,
  removeAllSearchFromLocalStorage,
} from "~/helpers/local-storage";

export const Overlay = () => {
  return (
    <div className="opacity-50 bg-white dark:bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
  );
};
export const Gradient = () => {
  return (
    <div className="bg-gradient-to-t from-white dark:from-gray-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
  );
};
interface TextProps {
  flightDefault: Query;
}
export const Text = ({ flightDefault }: TextProps) => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        {flightDefault.fromText} to {flightDefault.toText}
      </h1>
      <p className="mb-2">
        {flightDefault.depart} to {flightDefault.return}
      </p>
    </div>
  );
};

interface NewFeatureProps {
  text?: string;
  url?: string;
}
export const NewFeature = ({
  text = "See our new feature",
  url,
}: NewFeatureProps) => {
  return (
    <a
      href={url}
      className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-white hover:bg-gray-200  rounded-full dark:bg-gray-800 dark:text-white  dark:hover:bg-gray-700"
      role="alert"
    >
      <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
        New
      </span>{" "}
      <span className="text-sm font-medium">{text}</span>
      <svg
        className="ml-2 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
};
interface FlightFormProps {
  apiUrl?: string;
  buttonLoading?: boolean;
  flightDefault: Query;
}
export const FlightForm = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
}: FlightFormProps) => {
  const [previousSearches, setPreviousSearches] = useState(
    getSearchFromLocalStorage().reverse().slice(0, 5)
  );
  const [tripType, setTripType] = useState<string>("return");
  const [query, setQuery] = useState<Query>(flightDefault);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQueryChange = (value: string, key: string) => {
    setQuery({ ...query, [key]: value });
  };
  const handleLocationChange = (
    value: string,
    key: string,
    iataCode: string
  ) => {
    if (key === "from") setFromLocationLocalStorage(iataCode);
    handleQueryChange(value, key);
    handleQueryChange(iataCode, `${key}Iata`);
  };
  const handleSearchClicked = () => {
    setLoading(true);
    addSearchToLocalStorage(query);
  };
  const navigation = useNavigation();
  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripType(e.target.value);
    setQuery({ ...query, tripType: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl p-4 border bg-opacity-75 dark:bg-opacity-75 border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className=" text-left mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-2xl dark:text-white">
        Search
      </h1>

      <form action="#" className="mt-8 w-full rounded lg:mt-4">
        <div className={`grid gap-y-4 lg:gap-x-4 lg:grid-cols-9`}>
          <div className="lg:col-span-2">
            <Location
              name="From"
              defaultValue={query.fromText}
              apiUrl={apiUrl}
              onSelect={(value, iataCode) =>
                handleLocationChange(value, "from", iataCode)
              }
            />
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
          <div
            date-rangepicker=""
            className="grid grid-cols-2 gap-x-4 lg:col-span-3"
          >
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <DateSimpleInput
                name="Depart"
                value={query.depart}
                onChange={(value: string) => handleQueryChange(value, "depart")}
              />
            </div>
            {tripType === "return" && (
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <DateSimpleInput
                  name="return"
                  value={query.return}
                  onChange={(value: string) =>
                    handleQueryChange(value, "return")
                  }
                />
              </div>
            )}
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
        </div>
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

interface HeroPageProps {
  newFeature?: string;
  newFeatureURL?: string;
  apiUrl?: string;
  showText?: boolean;
  buttonLoading?: boolean;
  flightDefault?: Query;
  backgroundImage?: string;
  showFlightForm?: boolean;
}

export const HeroPage = ({
  newFeature,
  newFeatureURL,
  apiUrl,
  showText = true,
  showFlightForm = true,
  buttonLoading = false,
  flightDefault,
  backgroundImage = "",
}: HeroPageProps) => {
  const fromPlace = getFromPlaceLocalOrDefault();
  if (fromPlace === false) return <></>;

  const flightQuery = flightDefault
    ? flightDefault
    : {
        from: fromPlace.entityId,
        fromIata: fromPlace.iata,
        fromText: fromPlace.name,
        to: "95673529", //Dublin
        toIata: "DUB", //Dublin
        toText: "Dublin", //Dublin
        depart: getDateFormated(1),
        return: getDateFormated(3),
        tripType: "return",
      };

  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage}&w=1500)` }}
      className={`relative bg-cover bg-center`}
    >
      <Overlay />
      <Gradient />
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        {newFeature ? <NewFeature text={newFeature} url={newFeatureURL} /> : ``}
        {showText ? <Text flightDefault={flightQuery} /> : ``}
        {showFlightForm ? (
          <FlightForm
            apiUrl={apiUrl}
            buttonLoading={buttonLoading}
            flightDefault={flightQuery}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
