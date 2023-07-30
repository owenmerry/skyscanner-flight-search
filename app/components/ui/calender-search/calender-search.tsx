import { getSearchWithCreateAndPoll } from "~/helpers/sdk/query";
import Calendar from "../calender/calender";
import { useEffect, useRef, useState } from "react";
import { Place, getIataFromEntityId } from "~/helpers/sdk/place";
import moment from "moment";

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
    const priceChecked = await getSearchWithCreateAndPoll(
      {
        from: from ? from.entityId : "",
        to: airport.entityId,
        ...(mode === "return"
          ? { depart: returnDepatureDate, return: dateSelected }
          : {
              depart: dateSelected,
            }),
      },
      {
        apiUrl,
      }
    );
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
    <div className="relative z-10 mx-auto max-w-screen-xl py-10">
      <select className="text-black" onChange={handleAirportChange}>
        {airports.map((airport, key) => {
          return <option value={key}>{airport.name}</option>;
        })}
      </select>
      <div className="mt-2">
        <div
          className={`p-4 inline-block rounded-xl ${
            mode === "oneway" ? `bg-slate-600` : ``
          }`}
          onClick={() => handleModeChange("oneway")}
        >
          One way
        </div>
        <div
          className={`p-4 inline-block rounded-xl ${
            mode === "return" ? `bg-slate-600` : ``
          }`}
          onClick={() => handleModeChange("return")}
        >
          Return
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
