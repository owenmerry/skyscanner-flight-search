import { useEffect,  useState } from "react";
import type { Query } from "~/types/search";
import Calendar from "../calender/calender";
import { useOutsideClick } from "~/helpers/hooks/outsideClickHook";
import moment from "moment";
import { Button } from "../button/button";

interface DateSelectorProps {
  query: Query;
  onDateChange?: (date: DatesQuery) => void;
}

export const DateSelector = ({ query, onDateChange }: DateSelectorProps) => {
  const [showCalender, setShowCalender] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("depart");
  const [dates, setDates] = useState<DatesQuery>({
    depart: query.depart,
    ...(query.return ? { return: query.return } : {}),
  });

  const refDate = useOutsideClick(() => {
    setShowCalender(false);
  });

  const isDepart = selectedDate === "depart";
  const isReturn = !isDepart;
  const isDepartSelected = isDepart && showCalender;
  const isReturnSelected = !isDepart && showCalender;

  useEffect(() => {
    console.log("update dates", query);
    setDates({
      depart: query.depart,
      ...(query.return ? { return: query.return } : {}),
    });
  }, [query]);

  const handleDateClick = (selected: string) => {
    const changeDate = showCalender && selectedDate !== selected;
    setSelectedDate(selected);
    if (changeDate) return;
    setShowCalender(!showCalender);
  };
  const handleDateChange = (date: string) => {
    let selectedDateUpdated = selectedDate === "return" ? "depart" : "return";
    const returnSelected = showCalender && selectedDate === "return";
    const returnIsBeforeDepart =
      returnSelected && moment(date).isBefore(dates.depart);
    if (returnIsBeforeDepart) selectedDateUpdated = "return";
    onDateChange &&
      onDateChange({
        ...dates,
        ...(isDepart || returnIsBeforeDepart
          ? {
              depart: date,
              return: "",
            }
          : {
              return: date,
            }),
      });
    setSelectedDate(selectedDateUpdated);
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 lg:col-span-3">
        <div
          className="relative cursor-pointer"
          onClick={() => handleDateClick("depart")}
        >
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 ${
              isDepartSelected
                ? "dark:border-primary-600"
                : "dark:border-gray-600"
            } dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-semibold`}
          >
            {dates.depart}
          </div>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => handleDateClick("return")}
        >
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`text-left bg-gray-50 border border-grey-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 ${
              isReturnSelected
                ? "dark:border-primary-600"
                : "dark:border-gray-600"
            } dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-semibold`}
          >
            {dates.return ? dates.return : "No Return"}{" "}
          </div>
        </div>
      </div>
      {showCalender && (
        <div ref={refDate} className="relative z-50">
          <div className="bg-white border border-gray-100 w-full mt-2 absolute dark:bg-gray-800 dark:border-gray-600">
            <Calendar
              onDateSelected={handleDateChange}
              displayDate={dates.depart}
              showNoReturn={isReturn}
              departDate={dates.depart}
              returnDate={dates.return}
            />
            <div className="p-2">
              <Button text="Set Dates" onClick={() => setShowCalender(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
