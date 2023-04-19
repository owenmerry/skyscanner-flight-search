import { useState, useEffect } from 'react';
import { formatDate } from '~/helpers/date';
import { addDays } from 'date-fns';

interface DateProps {
  name?: string;
  min?: string;
  max?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const DateSimpleInput = ({
  name = 'date',
  value = '',
  min,
  max,
  onChange,
}: DateProps): JSX.Element => {
  const [date, setDate] = useState(value);
  const minDate = new Date(min || '');
  const maxDate = new Date(max || '');
  const currentDate = new Date(date);
  const isMinDisabled = min && minDate > addDays(currentDate, -1) || false;
  const isMaxDisabled = max && maxDate < addDays(currentDate, 1) || false;

  useEffect(() => {
    setDate(value);
  }, [value]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onChange && onChange(e.target.value);
  };

  const changeDate = async (number: number) => {
    const currentDate = new Date(date);
    const newDate = addDays(currentDate, number);
    const currentDateFormatted = formatDate(newDate);
    if (min && minDate > newDate) return;
    if (max && maxDate < newDate) return;
    setDate(currentDateFormatted);
    onChange && onChange(currentDateFormatted);
  };



  return (
    <>
      <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={(e) => handleChange(e)} value={date} />
    </>
  );
};
