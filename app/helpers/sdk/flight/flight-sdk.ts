import { QueryPlace } from "~/types/search";
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
    mode,
  }: {
    apiUrl: string;
    query: QueryPlace;
    mode?: "complete";
  }) => Promise<SearchSDK | { error: string }>;
  poll: ({
    apiUrl,
    token,
    wait,
    mode,
  }: {
    apiUrl: string;
    token: string;
    wait?: number;
    mode?: "complete";
  }) => Promise<SearchSDK | { error: string }>;
  createAndPoll: ({
    apiUrl,
    query,
    sessionToken,
    preCall,
    preCallWait
  }: {
    apiUrl?: string;
    sessionToken?: string;
    query?: QueryPlace;
    preCall?: boolean;
    preCallWait?: number;
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
  mode,
}: {
  apiUrl: string;
  query: QueryPlace;
  mode?: "complete";
}): Promise<SearchSDK | { error: string }> => {
  let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
  let search: SearchSDK | null = null;

  try {
    const res = await fetch(
      `${apiUrl}/create?from=${query.from.entityId}&to=${
        query.to.entityId
      }&depart=${query.depart}${
        query?.return ? `&return=${query.return}` : ""
      }${mode ? `&mode=${mode}` : ""}`
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

export const getFlightLiveCreateLite = async ({
  apiUrl,
  query,
  mode,
}: {
  apiUrl: string;
  query: QueryPlace;
  mode?: "complete";
}): Promise<
  SearchSDK | { error: string } | { status: string; sessionToken: string }
> => {
  let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
  let search: SearchSDK | null = null;

  try {

    const res = await fetch(
      `${apiUrl}/create?from=${query.from.entityId}&to=${
        query.to.entityId
      }&depart=${query.depart}${
        query?.return ? `&return=${query.return}` : ""
      }${mode ? `&mode=${mode}` : ""}`
    );
    const json = await res.json();

    if (!json && json.statusCode === 500 && json.statusCode !== 200) {
      error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:2-${json.statusCode})`;
    } else {
      if (mode !== "complete" || json.status === "RESULT_STATUS_COMPLETE") {
        console.time('sdk check');
        search = skyscanner().flight().search(json);
        console.timeEnd('sdk check');
      } else {
        search = json;
      }
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
  query,
  mode,
}: {
  apiUrl: string;
  token: string;
  wait?: number;
  query?: QueryPlace;
  mode?: "complete";
}): Promise<SearchSDK | { error: string }> => {
  let error: string = `Sorry, something happened and we couldnt do this (code: 1def)`;
  let search: SearchSDK | null = null;

  try {
    if (wait) {
      await waitSeconds(wait);
    }
    const res = await fetch(
      `${apiUrl}/poll/${token}${
        query
          ? `?from=${query.from.entityId}&to=${query.to.entityId}&depart=${
              query.depart
            }${query?.return ? `&return=${query.return}` : ""}${
              mode ? `&mode=${mode}` : ""
            }`
          : ""
      }`
    );
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
  preCall = false,
  preCallWait = 5,
}: {
  apiUrl?: string;
  sessionToken?: string;
  query?: QueryPlace;
  preCall?: boolean;
  preCallWait?: number;
}): Promise<SearchSDK | undefined> => {
  if (!query) return;
  if (!sessionToken) {

    if(preCall){
      getFlightLiveCreateLite({
        apiUrl,
        query,
        mode: "complete",
      });
      await waitSeconds(preCallWait);
    }

    const flightSearch = await getFlightLiveCreateLite({
      apiUrl,
      query,
      mode: "complete",
    });
    if ("error" in flightSearch) return;
    sessionToken = flightSearch.sessionToken;

    if (flightSearch.status === "RESULT_STATUS_COMPLETE") {
      if (!("cheapest" in flightSearch)) return;
      return flightSearch;
    }
  }

  const flightPoll = await getFlightLivePoll({
    apiUrl,
    token: sessionToken || "",
    wait: 5,
    query,
    mode: "complete",
  });
  //check status
  if ("error" in flightPoll) {
    return await getSearchWithCreateAndPoll({ query, apiUrl, sessionToken });
  } else if (flightPoll.status === "RESULT_STATUS_COMPLETE") {
    return flightPoll;
  } else {
    return await getSearchWithCreateAndPoll({ query, apiUrl, sessionToken });
  }
};
