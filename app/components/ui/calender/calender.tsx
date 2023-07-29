import moment from "moment";

interface Props {
  //pricesMap: Map<string, string>;
  onDateChange: Function;
  displayMonth: string;
  selectedDate?: string;
}

type CalendarItemProps = {
  date: Date;
  price?: string;
  isDisabled: boolean;
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
      <div className="">{price ? `£${price}` : "-"}</div>
    </div>
  );
}

export default function Calendar(props: Props) {
  const monthDate = moment(props.displayMonth, "YYYY-MM");

  const startOfGrid = monthDate.clone().startOf("month").startOf("week");
  const endOfGrid = monthDate.clone().endOf("month").endOf("week");

  const items = [];
  const currentDate = startOfGrid.clone();

  while (currentDate.isSameOrBefore(endOfGrid)) {
    const currentStringDate = currentDate.format("YYYY-MM-DD");

    items.push({
      date: currentDate.toDate(),
      //price: props.pricesMap.get(currentStringDate) || "",
      isDisabled: currentDate.month() !== monthDate.month(),
      isSelected: currentStringDate === props.selectedDate,
    });

    currentDate.add(1, "day");
  }

  const onOutboundDateChange = (clickedDate: Date) => {
    const stringDate = moment(clickedDate).format("YYYY-MM-DD");
    props.onDateChange(stringDate);
  };

  return (
    <div className="border-slate-600 rounded-md border-2">
      <div className="p-2">{monthDate.format("MMMM YYYY")}</div>
      <ul className="grid grid-cols-7">
        <li>SUN</li>
        <li>MON</li>
        <li>TUE</li>
        <li>WED</li>
        <li>THU</li>
        <li>FRI</li>
        <li>SAT</li>
      </ul>
      <div className="grid grid-cols-7">
        {items.map((item) => (
          <CalendarItem
            key={item.date.toISOString()}
            onClick={onOutboundDateChange}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
