import moment from "moment";
import { useEffect, useState } from "react";

interface Props {
  prices?: { price: string; date: string; link?: string }[];
  displayDate?: string;
  selectedDate?: string;
  onDateSelected?: (date: string) => void;
  onPriceCheck?: (date: string) => void;
  showNoReturn?: boolean;
}

type CalendarItemProps = {
  date: Date;
  price?: string;
  isDisabled?: boolean;
  isSelected: boolean;
  link?: string;
  onClick?: Function;
  onPriceCheck: Function;
};

function CalendarItem({
  date,
  price,
  isDisabled,
  isSelected,
  onClick,
  onPriceCheck,
  link,
}: CalendarItemProps) {
  return (
    <div
      className={` p-4 hover:bg-slate-700 border-2 rounded-md ${
        isSelected ? `border-blue-600` : `border-transparent`
      }
      ${onClick ? `cursor-pointer` : ``}
      `}
      onClick={() => !isDisabled && onClick && onClick(date)}
    >
      <div className="">{date.getDate()}</div>
      <div
        className="cursor-pointer"
        onClick={() => !isDisabled && onPriceCheck(date)}
      >
        {price ? `${price}` : "-"}
      </div>
      {link ? (
        <div>
          <a className="text-sm underline" href={link} target="_blank">
            Go to Search
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default function Calendar({
  displayDate = moment(new Date()).format("YYYY-MM-DD"),
  onDateSelected,
  onPriceCheck,
  selectedDate,
  prices = [],
  showNoReturn,
}: Props) {
  //controls
  const [calenderDate, setCalenderDate] = useState(displayDate);
  const monthDate = moment(calenderDate, "YYYY-MM");

  const startOfGrid = monthDate.clone().startOf("month").startOf("week");
  const endOfGrid = monthDate.clone().endOf("month").endOf("week");

  const items = [];
  const currentDate = startOfGrid.clone();

  useEffect(() => {
    setCalenderDate(displayDate);
  }, [displayDate]);

  while (currentDate.isSameOrBefore(endOfGrid)) {
    const currentStringDate = currentDate.format("YYYY-MM-DD");

    items.push({
      date: currentDate.toDate(),
      price:
        prices.filter((price) => price.date === currentStringDate)[0]?.price ||
        "",
      //isDisabled: currentDate.month() !== monthDate.month(),
      link:
        prices.filter(
          (price) => price.date === currentStringDate && price.link
        )[0]?.link || undefined,
      isSelected: currentStringDate === selectedDate,
    });

    currentDate.add(1, "day");
  }

  const handleDateSelected = (clickedDate: Date) => {
    const stringDate = moment(clickedDate).format("YYYY-MM-DD");
    onDateSelected && onDateSelected(stringDate);
  };
  const handlePriceCheck = (clickedDate: Date) => {
    const stringDate = moment(clickedDate).format("YYYY-MM-DD");
    onPriceCheck && onPriceCheck(stringDate);
  };

  return (
    <div className="">
      <div className="flex">
        <div
          className="p-4 hover:bg-slate-700 cursor-pointer"
          onClick={() =>
            setCalenderDate(
              moment(calenderDate).subtract(1, "M").format("YYYY-MM-DD")
            )
          }
        >
          -
        </div>
        <div
          className="p-4 hover:bg-slate-700 cursor-pointer"
          onClick={() =>
            setCalenderDate(moment(new Date()).format("YYYY-MM-DD"))
          }
        >
          Today
        </div>
        <div
          className="p-4 hover:bg-slate-700 cursor-pointer"
          onClick={() =>
            setCalenderDate(
              moment(calenderDate).add(1, "M").format("YYYY-MM-DD")
            )
          }
        >
          +
        </div>
        {showNoReturn ? (
          <div
            className="p-4 hover:bg-slate-700 cursor-pointer"
            onClick={() => {
              onDateSelected && onDateSelected("");
            }}
          >
            No Return
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="border-slate-600">
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
              onPriceCheck={handlePriceCheck}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
