import { useState, useEffect } from "react";

import { Link } from "@remix-run/react";
import { Location } from "~/components/ui/location";
import { DateInput } from "~/components/date";
import { getDateFormated, addWeeksToDate, formatDate } from "~/helpers/date";
import type { FlightQuery } from "~/types/search";

interface FlightSearchControlsProps {
  onSubmit?: (query: FlightQuery) => void;
  defaultQuery?: FlightQuery;
  defaultFrom?: string;
  defaultTo?: string;
  apiUrl?: string;
  fromText?: string;
  toText?: string;
}

export const FlightSearchControls = ({
  onSubmit,
  apiUrl = "",
  defaultQuery = {
    from: "95565050", // London Heathrow
    to: "95673529", //Dublin
    depart: getDateFormated(1),
    return: getDateFormated(3),
    tripType: "return",
  },
  defaultFrom = "LHR",
  defaultTo = "DUB",
  fromText = "London Heathrow",
  toText = "Dublin",
}: FlightSearchControlsProps): JSX.Element => {
  const [tripType, setTripType] = useState(defaultQuery.tripType);
  const [query, setQuery] = useState<FlightQuery>(defaultQuery);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const isReturn = query.tripType === "return";

  useEffect(() => {}, [query.depart]);

  const handleQueryChange = (value: string, key: string) => {
    setQuery({ ...query, [key]: value });
  };
  const handleLocationChange = (
    value: string,
    key: string,
    iataCode: string
  ) => {
    handleQueryChange(value, key);
    if (key === "from") {
      setFrom(iataCode);
    } else {
      setTo(iataCode);
    }
  };
  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripType(e.target.value);
    setQuery({ ...query, tripType: e.target.value });
  };

  const handleSearch = async () => {
    onSubmit && onSubmit(query);
  };

  const handleWeekChange = (method: "add" | "minus") => {
    const sumDate = method === "add" ? 1 : -1;
    const departDate = formatDate(
      addWeeksToDate(new Date(query.depart), sumDate)
    );
    const returnDate = query.return
      ? formatDate(addWeeksToDate(new Date(query.return), sumDate))
      : null;
    setQuery({
      ...query,
      depart: departDate,
      ...(returnDate && { return: returnDate }),
    });
  };

  return (
    <div className="flight-search">
      <h2>Flight Search</h2>
      <div>
        <div>
          <input
            checked={tripType === "single"}
            type="radio"
            value="single"
            name="trip-type"
            onChange={handleTripTypeChange}
          />{" "}
          Single
          <input
            checked={tripType === "return"}
            type="radio"
            value="return"
            name="trip-type"
            onChange={handleTripTypeChange}
          />{" "}
          Return
        </div>
      </div>

      <div className="flight-search-controls">
        <Location
          name="From"
          defaultValue={fromText}
          onSelect={(value, iataCode) =>
            handleLocationChange(value, "from", iataCode)
          }
          apiUrl={apiUrl}
        />
        <Location
          name="To"
          defaultValue={toText}
          onSelect={(value, iataCode) =>
            handleLocationChange(value, "to", iataCode)
          }
          apiUrl={apiUrl}
        />
        <DateInput
          name="Depart"
          value={query.depart}
          min={getDateFormated()}
          max={query.return}
          onChange={(value: string) => handleQueryChange(value, "depart")}
        />
        {tripType === "return" && (
          <DateInput
            name="Return"
            value={query.return}
            min={query.depart}
            onChange={(value: string) => handleQueryChange(value, "return")}
          />
        )}
        <Link
          className="button"
          to={`/search/${from}/${to}/${query.depart}${
            isReturn ? `/${query.return}` : ""
          }`}
        >
          Search
        </Link>
      </div>
      <div className="week-buttons">
        <button onClick={() => handleWeekChange("minus")}>-1 week</button>
        <button onClick={() => handleWeekChange("add")}>+1 week</button>
      </div>
    </div>
  );
};
