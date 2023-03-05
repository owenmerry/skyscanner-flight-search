import { useState } from 'react';
import { Location } from '~/components/location';
import type { FlightQuery } from '~/types/search';

import { getWeekDates, convertDateToYYYMMDDFormat, addWeeksToDate } from '~/helpers/date';

interface FlightWeekSearchControlsProps {
  onChange?: (query: FlightQuery) => void;
  apiUrl?: string;
}

export const FlightWeekSearchControls = ({
  onChange,
  apiUrl = '',
}: FlightWeekSearchControlsProps): JSX.Element => {
  const [location, setLocation] = useState('');
  const [week, setWeek] = useState(0);
  const displayDates = {
    saturday: getWeekDates(addWeeksToDate(new Date(), week)).saturday.toDateString(),
    sunday: getWeekDates(addWeeksToDate(new Date(), week)).sunday.toDateString(),
  };


  const handleQueryChange = (value: string, week: number) => {
    const selectedWeek = getWeekDates(addWeeksToDate(new Date(), week));
    const datesCalculated = {
      depart: convertDateToYYYMMDDFormat(selectedWeek.saturday),
      return: convertDateToYYYMMDDFormat(selectedWeek.sunday),
    }
    onChange && onChange({
      from: '95565050', // London Heathrow
      to: value,
      depart: datesCalculated.depart,
      return: datesCalculated.return,
      tripType: 'return',
    });

    setLocation(value);
  };

  const handleWeekChange = (method: 'add' | 'minus') => {
    const currentWeek = method === 'add' ? week + 1 : method === 'minus' && week !== 0 ? week - 1 : week;
    setWeek(currentWeek);
    if (location !== '') {
      handleQueryChange(location, currentWeek);
    }
  }

  return (
    <div className="flight-week-search">
      <h2>Week Flight Search</h2>
      <Location
        name="To"
        onSelect={(value) => handleQueryChange(value, week)}
        apiUrl={apiUrl}
      />
      <div>{displayDates.saturday} - {displayDates.sunday}</div>
      <div className='week-buttons'>
        <button onClick={() => handleWeekChange('minus')}>-1 week</button>
        <button onClick={() => handleWeekChange('add')}>+1 week</button>
      </div>
    </div>
  );
};
