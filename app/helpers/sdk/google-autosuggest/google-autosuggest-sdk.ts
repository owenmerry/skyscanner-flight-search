import type { GoogleAutosuggestResponse } from "./google-autosuggest-response";

// SDK Types
export type GoogleAutosuggestSDK =
  | GoogleAutosuggestResponse
  | { error: string };

export const getGoogleAutosuggestSDK = async ({
  search,
  latitude,
  longitude,
  radius,
  apiUrl,
}: {
  apiUrl: string;
  search: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}): Promise<GoogleAutosuggestSDK> => {
  const autosuggest = await getGoogleAutosuggest({
    search,
    latitude,
    longitude,
    radius,
    apiUrl,
  });

  return autosuggest;
};

export const getGoogleAutosuggest = async ({
  search,
  latitude,
  longitude,
  radius,
  apiUrl,
}: {
  apiUrl: string;
  search: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}): Promise<GoogleAutosuggestResponse | { error: string }> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/service/google/places/autosuggest?search=${search}${
        latitude ? `&latitude=${latitude}` : ""
      }${longitude ? `&longitude=${longitude}` : ""}${
        radius ? `&radius=${radius}` : ""
      }`
    );
    const json: GoogleAutosuggestResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content || { error };
};
