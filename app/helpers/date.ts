import { addDays, formatDistance } from "date-fns";
import type { IndicitiveResults } from "~/types/geo";
import type { SkyscannerDateTimeObject } from "./sdk/indicative/indicative-response";
import moment from "moment";

export const getNextDay = (date = new Date(), dayNumber: number) => {
  const dateCopy = new Date(date.getTime());

  const nextDay = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + dayNumber) % 7 || 7)
    )
  );

  return nextDay;
};

export const getNextFriday = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());

  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
    )
  );

  return nextFriday;
};

export const getNextSunday = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());

  const nextSunday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 7) % 7 || 7)
    )
  );

  return nextSunday;
};

export const getWeekendDates = (date: Date) => {
  const friday = getNextFriday(date);

  return {
    friday,
    sunday: getNextSunday(friday),
  };
};

export const getWeekDates = (date: Date) => {
  const saturday = getNextDay(date, 6);

  return {
    saturday,
    sunday: addWeeksToDate(getNextDay(saturday, 7), 1),
  };
};

export const convertDateToYYYMMDDFormat = (date: Date) =>
  date.toISOString().split("T")[0];

export const addWeeksToDate = (date: Date, numberOfWeeks: number) => {
  date.setDate(date.getDate() + numberOfWeeks * 7);
  return date;
};

export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const getDateFormated = (add?: number): string => {
  const dateAdd = add || 0;
  const date = new Date();
  const updatedDate = addDays(date, dateAdd);

  return formatDate(updatedDate);
};

export const getSEODateDetails = (
  results: IndicitiveResults,
  quoteKey: string
) => {
  const quote = results.quotes[quoteKey];
  const placeInboundOrigin = results.places[quote.inboundLeg.originPlaceId];
  const placeInboundDestination =
    results.places[quote.inboundLeg.destinationPlaceId];
  const placeOutboundOrigin = results.places[quote.outboundLeg.originPlaceId];
  const placeOutboundDestination =
    results.places[quote.outboundLeg.destinationPlaceId];
  const dateOutbound = new Date(
    Number(quote.outboundLeg.quoteCreationTimestamp) * 1000
  );
  const dateInbound = new Date(
    Number(quote.inboundLeg.quoteCreationTimestamp) * 1000
  );
  const dateOutboundFlight = new Date(
    quote.outboundLeg.departureDateTime.year,
    quote.outboundLeg.departureDateTime.month,
    quote.outboundLeg.departureDateTime.day
  );
  const dateInboundFlight = new Date(
    quote.inboundLeg.departureDateTime.year,
    quote.inboundLeg.departureDateTime.month,
    quote.inboundLeg.departureDateTime.day
  );
  const dateOutboundAgo = formatDistance(dateOutbound, new Date(), {
    addSuffix: true,
  });
  const dateInboundAgo = formatDistance(dateInbound, new Date(), {
    addSuffix: true,
  });
  const tripDays = formatDistance(dateOutboundFlight, dateInboundFlight, {
    addSuffix: false,
  });

  return {
    quote,
    placeInboundOrigin,
    placeInboundDestination,
    placeOutboundOrigin,
    placeOutboundDestination,
    dateOutbound,
    dateOutboundAgo,
    dateOutboundFlight,
    dateInbound,
    dateInboundAgo,
    dateInboundFlight,
    tripDays,
  };
};

export const getDateDisplay = (
  dateTime: SkyscannerDateTimeObject,
  display?: string
) => {
  return moment(`${dateTime.year}-${dateTime.month}-${dateTime.day}`).format(
    display || "MMM Do"
  );
};

export const getDateYYYYMMDDToDisplay = (
  dateTime?: string,
  display?: string
) => {
  if (!dateTime) return "";
  return moment(dateTime).format(display || "MMM Do");
};

export const getYYYYMMDDtoDateObject = (dateTime?: string) => {
  if (!dateTime) return undefined;
  return new Date(
    Number(dateTime.split("-")[0]),
    Number(dateTime.split("-")[0]),
    Number(dateTime.split("-")[0])
  );
};

export const getTripDaysLengthFromYYYYMMDD = (
  dateTimeStart?: string,
  dateTimeEnd?: string
) => {
  if (!dateTimeStart || !dateTimeEnd) return "";

  const start = moment(dateTimeStart);
  const end = moment(dateTimeEnd);
  const daysDiff = moment.duration(end.diff(start)).asDays();
  if (daysDiff === 0) return "same day trip";

  return `${daysDiff} day trip`;
};

export const getNextXMonthsStartDayAndEndDay = (months: number) => {
  let n = 0;
  let arRet = [];

  for (; n < months; n++) {
    const month = moment().startOf("month").add(n, "months");
    const monthFirstDay = month.startOf("month");
    const monthLastDay = month.endOf("month");
    arRet.push({
      displayMonthText: month.format("MMMM YYYY"),
      smallMonth: month.format("MMM"),
      firstDay: monthFirstDay.format("YYYY-MM-DD"),
      lastDay: monthLastDay.format("YYYY-MM-DD"),
      year: monthLastDay.format("YYYY"),
      month: monthLastDay.format("MM"),
    });
  }

  return arRet;
};

export const getYYYYMMDDFromSkyscannerDate = (date: SkyscannerDateTimeObject) => {
  const numberTwoDigits = (myNumber: number) => {
    return ("0" + myNumber).slice(-2);
  };
  return `${date.year}-${numberTwoDigits(
    date.month
  )}-${numberTwoDigits(date.day)}`;
};

export const getTripDays = (
  departDate: string,
  returnDate: string
) => {
  const departDateObject = new Date(departDate);
  const returnDateObject = addDays(new Date(returnDate), 1);

  return formatDistance(departDateObject, returnDateObject, {
  });
};

export const getUpdatedFromTimestamps = (outboundLegTimestamp : string, inboundLegTimestamp :string) => {
  const departUpdateTimestamp = new Date(
    Number(outboundLegTimestamp) * 1000
  );
  const returnUpdateTimestamp = new Date(
    Number(inboundLegTimestamp) * 1000
  );
  const updateTimestamp =
    departUpdateTimestamp >= returnUpdateTimestamp
      ? departUpdateTimestamp
      : returnUpdateTimestamp;

  return formatDistance(updateTimestamp, new Date(), {
    addSuffix: true,
  });
};
