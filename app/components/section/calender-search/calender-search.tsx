import Calendar from "../../ui/calender/calender";
import { useEffect, useRef, useState } from "react";
import { Place, getIataFromEntityId } from "~/helpers/sdk/place";
import moment from "moment";
import { ToggleSwitch } from "flowbite-react";
import { getSearchWithCreateAndPoll } from "~/helpers/sdk/flight/flight-sdk";

interface CalenderSearchProps {
  airports: Place[];
  from: Place;
  apiUrl?: string;
}

export const CalenderSearch = ({
  airports,
  from,
  apiUrl,
}: CalenderSearchProps) => {
  const [airport, setAirport] = useState<Place>(airports[0]);
  const [prices, setPrices] = useState<
    { price: string; date: string; link?: string }[]
  >([]);
  const [mode, setMode] = useState<string>("oneway");
  const [returnDepatureDate, setReturnDepatureDate] = useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const previousInputValue = useRef<{ price: string; date: string }[]>([]);

  useEffect(() => {
    previousInputValue.current = prices;
  }, [prices]);

  const handlePriceAdd = async (dateSelected: string) => {
    const updatedPricesLoading = [
      ...prices.filter((price) => price.price !== dateSelected),
      {
        price: "loading...",
        date: dateSelected,
      },
    ];
    setPrices(updatedPricesLoading);

    const priceQuery = {
      from: from ? from.entityId : "",
      to: airport.entityId,
      ...(mode === "return"
        ? { depart: returnDepatureDate, return: dateSelected }
        : {
            depart: dateSelected,
          }),
    };
    const priceSearch = await getSearchWithCreateAndPoll({
      query: {
        from: from,
        to: airport,
        ...(mode === "return"
          ? { depart: returnDepatureDate, return: dateSelected }
          : {
              depart: dateSelected,
            }),
      },
      apiUrl,
    });
    const priceChecked = priceSearch?.stats.minPrice;
    if (!priceChecked) return;
    const updatedPrices = [
      ...previousInputValue.current.filter(
        (price) => price.date !== dateSelected
      ),
      {
        price: priceChecked,
        date: dateSelected,
        link: `/search/${getIataFromEntityId(
          priceQuery.from
        )}/${getIataFromEntityId(priceQuery.to)}/${priceQuery.depart}${
          "return" in priceQuery ? `/${priceQuery.return}` : ""
        }`,
      },
    ];
    setPrices(updatedPrices);
  };
  const handleAirportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrices([]);
    setAirport(airports[Number(e.target.value)]);
  };
  const handleDepartDateChange = (dateSelected: string) => {
    setPrices([]);
    setReturnDepatureDate(dateSelected);
  };
  const handleModeChange = (modeChanged: string) => {
    setPrices([]);
    setMode(modeChanged);
  };

  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
        Search {from.name} Flight Prices
      </h2>
      <div className="mb-4 flex items-center">
        <select
          className="mr-2 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          onChange={handleAirportChange}
        >
          {airports.map((airport, key) => {
            return <option value={key}>{airport.name}</option>;
          })}
        </select>
        <div>
          <ToggleSwitch
            checked={mode === "return"}
            label="Return Flight"
            onChange={(toggle) =>
              handleModeChange(toggle ? "return" : "oneway")
            }
          />
        </div>
      </div>
      <div
        className={mode === "return" ? `md:grid md:grid-cols-2 md:gap-2` : ""}
      >
        {mode === "return" ? (
          <Calendar
            selectedDate={returnDepatureDate}
            onDateSelected={(dateSelected) =>
              handleDepartDateChange(dateSelected)
            }
          />
        ) : (
          ""
        )}
        <Calendar
          onPriceCheck={(dateSelected) => handlePriceAdd(dateSelected)}
          prices={prices}
          displayDate={returnDepatureDate}
        />
      </div>
    </div>
  );
};
