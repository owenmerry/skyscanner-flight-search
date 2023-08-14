import moment from "moment";
import { QueryPlace } from "~/types/search";

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
