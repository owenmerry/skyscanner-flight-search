import { useState, useEffect } from 'react';

import { Link } from '@remix-run/react';
import { Location } from '~/components/location';
import { DateInput } from '~/components/date';
import { getDateFormated } from '~/helpers/date';
import type { FlightQuery } from '~/types/search';

interface FlightSearchControlsProps {
  onSubmit?: (query: FlightQuery) => void;
  defaultQuery?: FlightQuery;
  defaultFrom?: string,
  defaultTo?: string,
  apiUrl?: string;
  fromText?: string;
  toText?: string;
}

export const FlightSearchControls = ({
  onSubmit,
  apiUrl = '',
  defaultQuery = {
    from: '27544008', // London
    to: '95673529', //Dublin
    depart: getDateFormated(1),
    return: getDateFormated(3),
    tripType: 'return',
  },
  defaultFrom = "LON",
  defaultTo = "DUB",
  fromText = "London",
  toText = "Dublin"
}: FlightSearchControlsProps): JSX.Element => {
  const [tripType, setTripType] = useState(defaultQuery.tripType);
  const [query, setQuery] = useState<FlightQuery>(defaultQuery);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const isReturn = query.tripType === 'return';

  useEffect( () => {

  },[]);

  const handleQueryChange = (value: string, key: string) => {
    setQuery({ ...query, [key]: value });
  };
  const handleLocationChange = (value: string, key: string, iataCode: string) => {
    handleQueryChange(value, key);
    if(key === 'from'){
      setFrom(iataCode);
    } else {
      setTo(iataCode);
    }
  }
  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripType(e.target.value);
    setQuery({ ...query, tripType: e.target.value });
  };
  
  const handleSearch = async () => {
    onSubmit && onSubmit(query);
  };

  return (
    <div className="flight-search">
    <h2>Flight Search</h2>
    <div>
      <div>
        <input
          checked={tripType === 'single'}
          type="radio"
          value="single"
          name="trip-type"
          onChange={handleTripTypeChange}
        />{' '}
        Single
        <input
          checked={tripType === 'return'}
          type="radio"
          value="return"
          name="trip-type"
          onChange={handleTripTypeChange}
        />{' '}
        Return
      </div>
    </div>

    <div className="flight-search-controls">
      <Location
        name="From"
        defaultValue={fromText}
        onSelect={(value, iataCode) => handleLocationChange(value, 'from', iataCode)}
        apiUrl={apiUrl}
      />
      <Location
        name="To"
        defaultValue={toText}
        onSelect={(value, iataCode) => handleLocationChange(value, 'to', iataCode)}
        apiUrl={apiUrl}
      />
      <DateInput
        name="Depart"
        defaultValue={query.depart}
        min={getDateFormated()}
        max={query.return}
        onChange={(value : string) => handleQueryChange(value, 'depart')}
      />
      {tripType === 'return' && (
        <DateInput
          name="Return"
          defaultValue={query.return}
          min={query.depart}
          onChange={(value : string) => handleQueryChange(value, 'return')}
        />
      )}
      <Link className='button' to={`/search/${from}/${to}/${query.depart}${isReturn ? `/${query.return}` : '' }`}>Search</Link>
    </div>
  </div>
  );
};
