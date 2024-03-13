import { FlightQuery, QueryPlace } from "~/types/search";
import { waitSeconds } from "~/helpers/utils";
import { skyscanner } from "../skyscannerSDK";
import { SkyscannerAPICreateResponse } from "./flight-response";
import { SearchSDK, getSortingOptions, stats } from "./flight-functions";

// SDK Types
export interface FlightSDK {
  search: (res: SkyscannerAPICreateResponse) => SearchSDK;
  create: ({
    apiUrl,
    query,
  }: {
    apiUrl: string;
    query: QueryPlace;
  }) => Promise<SearchSDK | { error: string }>;
  poll: ({
    apiUrl,
    token,
    wait,
  }: {
    apiUrl: string;
    token: string;
    wait?: number;
  }) => Promise<SearchSDK | { error: string }>;
  createAndPoll: ({
    apiUrl,
    query,
    sessionToken,
  }: {
    apiUrl?: string;
    sessionToken?: string;
    query?: QueryPlace;
  }) => Promise<SearchSDK | undefined>;
}

export const getFlightSDK = (): FlightSDK => {
  return {
    search: (res) => ({
      sessionToken: res.sessionToken,
      status: res.status,
      action: res.action,
      best: getSortingOptions(res, "best"),
      cheapest: getSortingOptions(res, "cheapest"),
      fastest: getSortingOptions(res, "fastest"),
      stats: stats(res),
    }),
    create: getFlightLiveCreate,
    poll: getFlightLivePoll,
    createAndPoll: getSearchWithCreateAndPoll,
  };
};

//searches

export const getFlightLiveCreate = async ({
  apiUrl,
  query,
}: {
  apiUrl: string;
  query: QueryPlace;
}): Promise<SearchSDK | { error: string }> => {
  let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
  let search: SearchSDK | null = null;

  try {
    const res = await fetch(
      `${apiUrl}/create?from=${query.from.entityId}&to=${
        query.to.entityId
      }&depart=${query.depart}${query?.return ? `&return=${query.return}` : ""}`
    );
    const json = await res.json();

    if (!json && json.statusCode === 500 && json.statusCode !== 200) {
      error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:2-${json.statusCode})`;
    } else {
      search = skyscanner().flight().search(json);
    }
  } catch (ex) {
    //error = `Sorry, something happened and we couldnt do this (code:3catch)`;
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
      search = skyscanner().flight().search(json);
    } else {
      search = skyscanner().flight().search(json);
    }
  } catch (ex) {
    //error = `Sorry, something happened and we couldnt do this (code: 3catch)`;
    console.error("Flight Poll - Error code (3catch)", token);
  }

  return search ? search : { error };
};

export const getSearchWithCreateAndPoll = async ({
  apiUrl = "",
  query,
  sessionToken = "",
}: {
  apiUrl?: string;
  sessionToken?: string;
  query?: QueryPlace;
}): Promise<SearchSDK | undefined> => {
  if (!query) return;
  if (!sessionToken) {
    const flightSearch = await getFlightLiveCreate({
      apiUrl,
      query,
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
    return await getSearchWithCreateAndPoll({ query, apiUrl, sessionToken });
  } else if (flightPoll.status === "RESULT_STATUS_COMPLETE") {
    console.log("got complete", flightPoll.stats.minPrice);
    return flightPoll;
  } else {
    console.log(`got ${flightPoll.status}, retry`);
    return await getSearchWithCreateAndPoll({ query, apiUrl, sessionToken });
  }
};
