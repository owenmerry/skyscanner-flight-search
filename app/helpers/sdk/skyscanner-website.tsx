import moment from "moment";
import { QueryPlace } from "~/types/search";
import { LegSDK } from "./flight/flight-functions";

export const getSkyscannerLink = (query: QueryPlace, bookingId?: string) => {
  const getBookingDate = (dateString: string) =>
    moment(dateString).format("YYMMDD");
  return `https://www.skyscanner.net/transport/flights/${query.from.iata}/${
    query.to.iata
  }/${getBookingDate(query.depart)}${
    query.return ? `/${getBookingDate(query.return)}` : ""
  }${bookingId ? `/config/${encodeURIComponent(bookingId)}` : ""}`;
};
export const getSkyscannerSearchLink = (query: QueryPlace) => {
  return `https://skyscanner.net/g/referrals/v1/flights/day-view/?origin=${
    query.from.iata
  }&destination=${query.to.iata}&outboundDate=${query.depart}${
    query.return ? `&inboundDate=${query.return}` : ""
  }`;
};
export const getSkyscannerMultiCityLink = (
  leg: LegSDK,
  query: QueryPlace,
  iata: string,
  addDate: number
) => {
  let dateUpdated = false;
  const locations = leg.segments.map((segment) => {
    const date = moment(segment.departure.split(" ")[0], ["DD/MM/YYYY"]);
    const isDateChange = segment.fromIata == iata || dateUpdated === true;
    if (isDateChange) dateUpdated = true;
    return {
      origin: segment.fromIata,
      destination: segment.toIata,
      date: isDateChange
        ? date.add(addDate, "days").format("YYYY-MM-DD")
        : date.format("YYYY-MM-DD"),
    };
  });
  if (query.return) {
    locations.push({
      origin: locations[locations.length - 1].destination,
      destination: locations[0].origin,
      date: query.return,
    });
  }
  const getLocationsString = (
    locations: {
      origin: string;
      destination: string;
      date: string;
    }[]
  ) => {
    let params = "";

    locations.map((location, key) => {
      params = `${params}origin${key}=${location.origin}`;
      params = `${params}&destination${key}=${location.destination}`;
      params = `${params}&date${key}=${location.date}&`;
    });
    return params;
  };

  return `https://skyscanner.net/g/referrals/v1/flights/multicity/?${getLocationsString(
    locations
  )}`;
};
