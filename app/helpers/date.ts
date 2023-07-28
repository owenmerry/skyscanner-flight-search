import { addDays } from "date-fns";
import { formatDistance } from "date-fns";
import { IndicitiveResults } from "~/types/geo";

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
