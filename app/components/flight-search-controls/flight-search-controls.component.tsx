import { useState } from 'react';

import { Location } from '~/components/location';
import { Date } from '~/components/date';
import type { FlightQuery } from '~/types/search';

interface FlightSearchControlsProps {
  onSubmit?: (query: FlightQuery) => void;
  apiUrl?: string;
}

export const FlightSearchControls = ({
  onSubmit,
  apiUrl = '',
}: FlightSearchControlsProps): JSX.Element => {
  const [tripType, setTripType] = useState('single');
  const [query, setQuery] = useState<FlightQuery>({
    from: '27544008', // London
    to: '95673668', //Edinburgh
    depart: '2022-11-02',
    return: '2022-11-06',
    tripType,
  });

  const handleQueryChange = (value: string, key: string) => {
    setQuery({ ...query, [key]: value });
  };
  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripType(e.target.value);
    setQuery({ ...query, tripType: e.target.value });
  };
  
  const handleSearch = async () => {
    onSubmit && onSubmit(query);
  };

  return (
    <div className="flight-search">
    <h2>Search</h2>
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
        defaultValue={'London'}
        onChange={(value) => handleQueryChange(value, 'from')}
        apiUrl={apiUrl}
      />
      <Location
        name="To"
        defaultValue={'Edinburgh'}
        onChange={(value) => handleQueryChange(value, 'to')}
        apiUrl={apiUrl}
      />
      <Date
        name="Depart"
        defaultValue={query.depart}
        onChange={(value) => handleQueryChange(value, 'depart')}
      />
      {tripType === 'return' && (
        <Date
          name="Return"
          defaultValue={query.return}
          onChange={(value) => handleQueryChange(value, 'return')}
        />
      )}
      <button onClick={handleSearch}>Search</button>
    </div>
  </div>
  );
};
