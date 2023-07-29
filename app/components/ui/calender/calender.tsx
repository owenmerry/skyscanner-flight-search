import moment from "moment";
import { useState } from "react";

interface Props {
  prices?: { price: string; date: string }[];
  displayDate?: string;
  selectedDate?: string;
  onDateSelected?: (date: string) => void;
}

type CalendarItemProps = {
  date: Date;
  price?: string;
  isDisabled?: boolean;
  isSelected: boolean;
  onClick: Function;
};

function CalendarItem({
  date,
  price,
  isDisabled,
  isSelected,
  onClick,
}: CalendarItemProps) {
  return (
    <div
      className="border-slate-600 border-2 p-4 hover:bg-slate-700"
      onClick={() => !isDisabled && onClick(date)}
    >
      <div className="">{date.getDate()}</div>
      <div className="">{price ? `${price}` : "-"}</div>
    </div>
  );
}

export default function Calendar({
  displayDate = moment(new Date()).format("YYYY-MM-DD"),
  onDateSelected,
  selectedDate,
  prices = [],
}: Props) {
  //controls
  const [calenderDate, setCalenderDate] = useState(displayDate);
  const monthDate = moment(calenderDate, "YYYY-MM");

  const startOfGrid = monthDate.clone().startOf("month").startOf("week");
  const endOfGrid = monthDate.clone().endOf("month").endOf("week");

  const items = [];
  const currentDate = startOfGrid.clone();

  while (currentDate.isSameOrBefore(endOfGrid)) {
    const currentStringDate = currentDate.format("YYYY-MM-DD");

    items.push({
      date: currentDate.toDate(),
      price:
        prices.filter((price) => price.date === currentStringDate)[0]?.price ||
        "",
      //isDisabled: currentDate.month() !== monthDate.month(),
      isSelected: currentStringDate === selectedDate,
    });

    currentDate.add(1, "day");
  }

  const handleDateSelected = (clickedDate: Date) => {
    const stringDate = moment(clickedDate).format("YYYY-MM-DD");
    onDateSelected && onDateSelected(stringDate);
  };

  return (
    <div className="relative z-10 mx-auto max-w-screen-xl">
      <button
        className="p-4 hover:bg-slate-700"
        onClick={() =>
          setCalenderDate(
            moment(calenderDate).subtract(1, "M").format("YYYY-MM-DD")
          )
        }
      >
        -
      </button>
      <button
        className="p-4 hover:bg-slate-700"
        onClick={() =>
          setCalenderDate(
            moment(new Date()).subtract(1, "M").format("YYYY-MM-DD")
          )
        }
      >
        Today
      </button>
      <button
        className="p-4 hover:bg-slate-700"
        onClick={() =>
          setCalenderDate(moment(calenderDate).add(1, "M").format("YYYY-MM-DD"))
        }
      >
        +
      </button>
      <div className="border-slate-600 rounded-md border-2">
        <div className="p-2">{monthDate.format("MMMM YYYY")}</div>
        <ul className="grid grid-cols-7">
          <li className="p-2">SUN</li>
          <li className="p-2">MON</li>
          <li className="p-2">TUE</li>
          <li className="p-2">WED</li>
          <li className="p-2">THU</li>
          <li className="p-2">FRI</li>
          <li className="p-2">SAT</li>
        </ul>
        <div className="grid grid-cols-7">
          {items.map((item) => (
            <CalendarItem
              key={item.date.toISOString()}
              onClick={handleDateSelected}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
