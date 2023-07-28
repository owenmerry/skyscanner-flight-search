import type { SkyscannerAPIFlightSearchResponse } from "./flight-response";
import { getHotelSearch } from "../query";
import { FlightQuery } from "~/types/search";

// SDK Types
export interface FlightSDK {
  search: SkyscannerAPIFlightSearchResponse | { error: string };
}

export const getFlightSDK = async ({
  res,
  query,
  apiUrl,
}: {
  res?: SkyscannerAPIFlightSearchResponse;
  query?: FlightQuery;
  apiUrl?: string;
}): Promise<FlightSDK> => {
  const search = res
    ? res
    : await getHotelSearch({
        apiUrl: apiUrl ? apiUrl : "",
        query,
      });

  return {
    search,
  };
};
