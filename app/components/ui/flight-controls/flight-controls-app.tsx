import { ReactNode, useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { Query, QueryPlace } from "~/types/search";
import { Location } from "~/components/ui/location";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { Loading } from "~/components/ui/loading/loading.component";
import { useNavigation } from "@remix-run/react";
import { getSearchFromLocalStorage } from "~/helpers/local-storage";
import { DateSelector } from "../date/date-selector";
import { getPlaceFromEntityId, getPlaceFromIata } from "~/helpers/sdk/place";
import { Box, Button, Drawer, Typography } from "@mui/material";
import styled from "@emotion/styled";
import {
  getDateYYYYMMDDToDisplay,
  getTripDaysLengthFromYYYYMMDD,
} from "~/helpers/date";

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

const FlightsSearchForm: React.FC<FlightControlsAppProps> = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
  showPreviousSearches = true,
  onSearch,
  onChange,
}) => {
  const defaultQuery: Query = flightDefault
    ? flightDefault
    : getDefualtFlightQuery();
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [switchRotate, setSwitchRotate] = useState<boolean>(false);

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
    console.log("changed query", {
      query,
    });

    onChange && onChange(queryPlace);
  }, [query]);

  return (
    <form
      action="#"
      className="grid gap-y-4 w-full rounded lg:gap-x-4 lg:grid-cols-9"
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
        <div className="absolute top-1 -right-5 z-30">
          <div onClick={() => handleLocationSwap()} className={`rounded-full p-2 bg-blue-600 shadow hover:scale-110 hover:bg-blue-500 ${switchRotate ? `rotate-180` : ''} transition cursor-pointer`}>
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
        <Link
          to={`/search/${query.fromIata}/${query.toIata}/${query.depart}/${query.return}`}
          className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
          onClick={handleSearchClicked}
        >
          {navigation.state === "loading" && loading ? (
            <>
              <span>
                <Loading aria-label="Spinner button example" />
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
        </Link>
      )}
    </form>
  );
};

const FlightControlsDrawer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  type ToggleDrawer = (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;

  const toggleDrawer: ToggleDrawer = (open) => () => {
    setOpen(open);
  };

  return (
    <div>
      <a
        className="text-primary-700 font-bold cursor-pointer"
        onClick={toggleDrawer(true)}
      >
        Modify
      </a>

      <Drawer
        PaperProps={{
          sx: { borderTopLeftRadius: "16px", borderTopRightRadius: "16px" },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        {children}
      </Drawer>
    </div>
  );
};

interface FlightControlsAppProps {
  apiUrl?: string;
  buttonLoading?: boolean;
  flightDefault?: Query;
  showPreviousSearches?: boolean;
  onSearch?: (query: QueryPlace) => void;
  onChange?: (query: QueryPlace) => void;
}
export const FlightControlsApp = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
  showPreviousSearches = true,
  onSearch,
}: FlightControlsAppProps) => {
  const flightDefaultPlace =
    (flightDefault && convertQuerytoQueryPlace(flightDefault)) || null;
  console.log("check here", flightDefault);
  return (
    <div className="bg-white dark:bg-gray-800 border-gray-300 border-b dark:border-0">
      <div className="mx-auto max-w-screen-xl lg:px-12 px-4 py-2 sm:py-4 sm:px-4">
        <div className="p-4 hidden sm:block">
          <FlightsSearchForm
            apiUrl={apiUrl}
            buttonLoading={buttonLoading}
            flightDefault={flightDefault}
            showPreviousSearches={showPreviousSearches}
            onSearch={onSearch}
            onChange={onSearch}
          />
        </div>
        <div className="p-4 sm:hidden flex">
          <div className="flex-1">
            <div>
              <span className="font-bold">{flightDefaultPlace?.from.name}</span>{" "}
              to{" "}
              <span className="font-bold">{flightDefaultPlace?.to.name}</span>
            </div>
            <div>
              <span className="font-bold">
                {getDateYYYYMMDDToDisplay(
                  flightDefaultPlace?.depart,
                  "Do MMMM"
                )}{" "}
              </span>
              {flightDefaultPlace?.return ? (
                <>
                  to{" "}
                  <span className="font-bold">
                    {getDateYYYYMMDDToDisplay(
                      flightDefaultPlace.return,
                      "Do MMMM"
                    )}
                  </span>{" "}
                  <span className="italic text-sm">
                    (
                    {getTripDaysLengthFromYYYYMMDD(
                      flightDefaultPlace.depart,
                      flightDefaultPlace.return
                    )}
                    )
                  </span>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="">
            <FlightControlsDrawer>
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold mb-4">Change Search</h2>
                <FlightsSearchForm
                  apiUrl={apiUrl}
                  buttonLoading={buttonLoading}
                  flightDefault={flightDefault}
                  showPreviousSearches={showPreviousSearches}
                  onSearch={onSearch}
                />
              </div>
            </FlightControlsDrawer>
          </div>
        </div>
      </div>
    </div>
  );
};
