import { useState } from 'react';

interface DateProps {
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const Date = ({
  name = 'date',
  defaultValue,
  onChange,
}: DateProps): JSX.Element => {
  const [date, setDate] = useState(defaultValue);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onChange && onChange(e.target.value);
  };

  return (
    <div>
      <div>
        {name}: <br />
        <input type="date" onChange={(e) => handleChange(e)} value={date} />
      </div>
    </div>
  );
};
