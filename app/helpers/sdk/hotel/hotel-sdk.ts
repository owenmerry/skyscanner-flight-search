import type { SkyscannerAPIHotelSearchResponse } from "./hotel-response";
import { getHotelSearch } from "../query";
import { FlightQuery } from "~/types/search";

// SDK Types
export interface HotelSDK {
  search: SkyscannerAPIHotelSearchResponse | { error: string };
}

export const getHotelSDK = async ({
  res,
  query,
  apiUrl,
}: {
  res?: SkyscannerAPIHotelSearchResponse;
  query?: FlightQuery;
  apiUrl?: string;
}): Promise<HotelSDK> => {
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
