import { useState } from 'react';
import { Location } from '~/components/location';
import type { FlightQuery } from '~/types/search';

import { getWeekendDates, convertDateToYYYMMDDFormat, addWeeksToDate } from '~/helpers/date';

interface FlightWeekendSearchControlsProps {
  onChange?: (query: FlightQuery) => void;
  apiUrl?: string;
}

export const FlightWeekendSearchControls = ({
  onChange,
  apiUrl = '',
}: FlightWeekendSearchControlsProps): JSX.Element => {
  const [location, setLocation] = useState('');
  const [week, setWeek] = useState(0);
  const displayDates = {
      friday: getWeekendDates(addWeeksToDate(new Date(), week)).friday.toDateString(),
      sunday: getWeekendDates(addWeeksToDate(new Date(), week)).sunday.toDateString(),
    };


  const handleQueryChange = (value: string,week: number) => {
    const weekend = getWeekendDates(addWeeksToDate(new Date(), week));
    const datesCalculated = {
      depart: convertDateToYYYMMDDFormat(weekend.friday),
      return: convertDateToYYYMMDDFormat(weekend.sunday),
    }
    onChange && onChange({
      from: '27544008', // London
      to: value,
      depart: datesCalculated.depart,
      return: datesCalculated.return,
      tripType: 'return',
    });

    setLocation(value);
  };

  const handleWeekChange = (method : 'add' | 'minus') => {
    const currentWeek = method === 'add' ? week + 1 : method === 'minus' && week !== 0 ? week - 1 : week;
    setWeek(currentWeek);
    if(location !== ''){
      handleQueryChange(location, currentWeek);
    }
  }

  return (
    <div className="flight-weekend-search">
          <h2>Weekend Flight Search</h2>
         <Location
        name="To"
        onSelect={(value) => handleQueryChange(value, week)}
        apiUrl={apiUrl}
      />
      <div>{displayDates.friday} - {displayDates.sunday}</div>
      <div className='weekend-buttons'>
        <button onClick={() => handleWeekChange('minus')}>-1</button>
        <button onClick={() => handleWeekChange('add')}>+1</button>
      </div>
  </div>
  );
};
