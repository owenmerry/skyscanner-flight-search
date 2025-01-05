import type { QueryPlace } from "~/types/search";
import type { FlightHistoryResponse } from "./flight-history-response";

export type FlightHistorySDK = FlightHistoryResponse | { error: string };

export const getFlightHistorySDK = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query: QueryPlace;
}): Promise<FlightHistorySDK> => {
  const autosuggest = await getFlightHistory({
    apiUrl,
    query,
  });

  return autosuggest;
};

export const getFlightHistory = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query: QueryPlace;
}): Promise<FlightHistorySDK> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/flight/history?from=${query.from.entityId}&to=${
        query.to.entityId
      }&depart=${query.depart}${query.return ? `&return=${query.return}` : ""}`
    );
    const json: FlightHistoryResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search";
    } else {
      content = json.filter(price => price.price !== null);
    }
  } catch (ex) {}

  return content || { error };
};
