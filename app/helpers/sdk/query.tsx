import type { FlightQuery, QueryPlace } from "~/types/search";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";

export const getImages = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query: string;
}): Promise<string[]> => {
  let imagesMin: string[] = [];
  try {
    const res = await fetch(`${apiUrl}/images?query=${query}`);
    const json = await res.json();
    imagesMin = json.response.results.map(
      (item: any) => item.urls.raw + "&w=1200"
    );
  } catch (ex) {}

  return imagesMin;
};

export const getHotelSearch = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query?: FlightQuery;
}): Promise<SkyscannerAPIHotelSearchResponse | { error: string }> => {
  let hotels,
    error = "";
  if (!query) return { error: "Query is required" };
  try {
    const res = await fetch(
      `${apiUrl}/hotel/search?from=${query.from}&to=${query.to}&depart=${query.depart}&return=${query.return}&entityId=${query.to}`
    );
    const json: SkyscannerAPIHotelSearchResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      hotels = json;
    }
  } catch (ex) {}

  return hotels || { error };
};

export const queryToString = (query: QueryPlace) => {
  return JSON.stringify(query);
}
