import type { SkyscannerAPIIndicativeResponse } from "./indicative-response";
import { FlightQuery, FlightQueryIndicative } from "~/types/search";

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
  query?: FlightQueryIndicative;
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

export const getIndicative = async ({
  apiUrl,
  query,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  groupType,
}: {
  apiUrl: string;
  query?: FlightQueryIndicative;
  month?: number;
  year?: number;
  groupType?: string;
}): Promise<SkyscannerAPIIndicativeResponse | { error: string }> => {
  let indicative,
    error = "";
  if (!query) return { error: "Query is required" };
  try {
    const res = await fetch(
      `${apiUrl}/price?from=${query.from}&to=${
        query.to
      }&month=${month}&year=${year}&tripType=${query.tripType}${
        groupType ? `&groupType=${groupType}` : ``
      }`
    );
    const json: SkyscannerAPIIndicativeResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      indicative = json;
    }
  } catch (ex) {}

  return indicative || { error };
};
