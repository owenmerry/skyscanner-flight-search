import type { SearchSDK } from "./skyscannerSDK";
import type { FlightQuery } from "~/types/search";
import { skyscanner } from "./skyscannerSDK";
import { waitSeconds } from "~/helpers/utils";
import { SkyscannerAPIHotelSearchResponse } from "~/helpers/sdk/hotel/hotel-response";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";

export const getFlightLiveCreate = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query: FlightQuery;
}): Promise<SearchSDK | { error: string }> => {
  let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
  let search: SearchSDK | null = null;

  try {
    const res = await fetch(
      `${apiUrl}/create?from=${query.from}&to=${query.to}&depart=${
        query.depart
      }${query?.return ? `&return=${query.return}` : ""}`
    );
    const json = await res.json();

    if (!json && json.statusCode === 500 && json.statusCode !== 200) {
      error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:2-${json.statusCode})`;
    } else {
      search = skyscanner().search(json);
    }
  } catch (ex) {
    error = `Sorry, something happened and we couldnt do this (code:3catch)`;
  }

  return search ? search : { error };
};

export const getFlightLivePoll = async ({
  apiUrl,
  token,
  wait,
}: {
  apiUrl: string;
  token: string;
  wait?: number;
}): Promise<SearchSDK | { error: string }> => {
  let error: string = `Sorry, something happened and we couldnt do this (code: 1def)`;
  let search: SearchSDK | null = null;

  try {
    if (wait) {
      await waitSeconds(wait);
    }
    const res = await fetch(`${apiUrl}/poll/${token}`);
    const json = await res.json();

    if (
      (!json && json.statusCode === 500 && json.statusCode !== 200) ||
      Object.keys(json?.content?.results?.itineraries).length === 0
    ) {
      if (Object.keys(json?.content?.results?.itineraries).length === 0) {
        console.error("Flight Poll - No results found on poll", json, token);
      }
      error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code: 2emp)`;
      console.error("Flight Poll - Error Code (2empty)", json, token);
      search = skyscanner().search(json);
    } else {
      search = skyscanner().search(json);
    }
  } catch (ex) {
    error = `Sorry, something happened and we couldnt do this (code: 3catch)`;
    console.error("Flight Poll - Error code (3catch)", token);
  }

  return search ? search : { error };
};

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

export const getIndicative = async ({
  apiUrl,
  query,
  month = new Date().getMonth() + 1,
}: {
  apiUrl: string;
  query?: FlightQuery;
  month?: number;
}): Promise<SkyscannerAPIIndicativeResponse | { error: string }> => {
  let indicative,
    error = "";
  if (!query) return { error: "Query is required" };
  try {
    const res = await fetch(
      `${apiUrl}/price?from=${query.from}&to=${query.to}&month=${month}&groupType=month`
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

export const getSearchWithCreateAndPoll = async (
  updateQuery: {
    from: string;
    to: string;
    depart: string;
    return?: string;
  },
  {
    apiUrl = "",
    sessionToken = "",
  }: {
    apiUrl?: string;
    sessionToken?: string;
  } = {}
): Promise<string | undefined> => {
  if (!sessionToken) {
    const flightSearch = await getFlightLiveCreate({
      apiUrl,
      query: {
        from: updateQuery.from,
        to: updateQuery.to,
        depart: updateQuery.depart,
        return: updateQuery.return,
        tripType: "return",
      },
    });
    if ("error" in flightSearch) return;
    sessionToken = flightSearch.sessionToken;
  }

  const flightPoll = await getFlightLivePoll({
    apiUrl,
    token: sessionToken || "",
    wait: 5,
  });
  //check status
  if ("error" in flightPoll) {
    console.log("got error, retry");
    return await getSearchWithCreateAndPoll(updateQuery, {
      apiUrl,
      sessionToken,
    });
  } else if (flightPoll.status === "RESULT_STATUS_COMPLETE") {
    console.log("got complete", flightPoll.stats.minPrice);
    return flightPoll.stats.minPrice;
  } else {
    console.log(`got ${flightPoll.status}, retry`);
    return await getSearchWithCreateAndPoll(updateQuery, {
      apiUrl,
      sessionToken,
    });
  }
};
