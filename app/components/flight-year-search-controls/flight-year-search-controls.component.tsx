import { Location } from '~/components/location';
import type { FlightCheckQuery } from '~/types/search';

interface FlightYearSearchControlsProps {
  onChange?: (query: FlightCheckQuery) => void;
  apiUrl?: string;
}

export const FlightYearSearchControls = ({
  onChange,
  apiUrl = '',
}: FlightYearSearchControlsProps): JSX.Element => {

  const handleQueryChange = (value: string) => {
    onChange && onChange({
      from: '27544008', // London
      to: value,
    });
  };

  return (
    <div className="flight-week-search">
          <h2>Year Flight Search</h2>
         <Location
        name="To"
        onSelect={(value) => handleQueryChange(value)}
        apiUrl={apiUrl}
      />
  </div>
  );
};