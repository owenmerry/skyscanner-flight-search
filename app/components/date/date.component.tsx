import { useState } from 'react';
import { formatDate } from '~/helpers/date';
import { addDays } from 'date-fns';

interface DateProps {
  name?: string;
  min?: string;
  max?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const DateInput = ({
  name = 'date',
  defaultValue = '',
  min,
  max,
  onChange,
}: DateProps): JSX.Element => {
  const [date, setDate] = useState(defaultValue);
  const minDate = new Date(min || '');
  const maxDate = new Date(max || '');
  const currentDate = new Date(date);
  const isMinDisabled = min && minDate > addDays(currentDate,-1) || false;
  const isMaxDisabled = max && maxDate < addDays(currentDate,1) || false;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onChange && onChange(e.target.value);
  };

  const changeDate = async (number : number) => {
    const currentDate = new Date(date);
    const newDate = addDays(currentDate, number);
    const currentDateFormatted = formatDate(newDate);
    if(min && minDate > newDate) return;
    if(max && maxDate < newDate) return;
    setDate(currentDateFormatted);
    onChange && onChange(currentDateFormatted);
  };

  return (
    <div>
      <div>
        {name}: <br />
        <button className='button-small' disabled={isMinDisabled} onClick={() => changeDate(-1)}>-</button>
        <input type="date" onChange={(e) => handleChange(e)} value={date} />
        <button className='button-small' disabled={isMaxDisabled} onClick={() => changeDate(1)}>+</button>
      </div>
    </div>
  );
};
