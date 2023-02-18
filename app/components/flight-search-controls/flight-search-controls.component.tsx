import { useState } from 'react';

import { Location } from '~/components/location';
import { DateInput } from '~/components/date';
import { getDateFormated } from '~/helpers/date';
import type { FlightQuery } from '~/types/search';

interface FlightSearchControlsProps {
  onSubmit?: (query: FlightQuery) => void;
  apiUrl?: string;
}

export const FlightSearchControls = ({
  onSubmit,
  apiUrl = '',
}: FlightSearchControlsProps): JSX.Element => {
  const [tripType, setTripType] = useState('return');
  const [query, setQuery] = useState<FlightQuery>({
    from: '27544008', // London
    to: '95673529', //Dublin
    depart: getDateFormated(1),
    return: getDateFormated(3),
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
        defaultValue={'London'}
        onChange={(value) => handleQueryChange(value, 'from')}
        apiUrl={apiUrl}
      />
      <Location
        name="To"
        defaultValue={'Dublin'}
        onChange={(value) => handleQueryChange(value, 'to')}
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
      <button onClick={handleSearch}>Search</button>
    </div>
  </div>
  );
};
