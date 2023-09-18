import type { SkyscannerAPIIndicativeResponse } from "./indicative-response";
import { getIndicative } from "../query";
import { FlightQuery } from "~/types/search";

// SDK Types
export interface IndicativeSDK {
  search: SkyscannerAPIIndicativeResponse | { error: string };
}

export const getIndicativeSDK = async ({
  res,
  query,
  apiUrl,
  month,
  year,
  groupType,
}: {
  res?: SkyscannerAPIIndicativeResponse;
  query?: FlightQuery;
  apiUrl?: string;
  month?: number;
  year?: number;
  groupType?: string;
}): Promise<IndicativeSDK> => {
  const search = res
    ? res
    : await getIndicative({
        apiUrl: apiUrl ? apiUrl : "",
        query,
        month,
        year,
        groupType,
      });

  return {
    search,
  };
};
