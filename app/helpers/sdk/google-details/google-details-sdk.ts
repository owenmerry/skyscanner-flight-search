import type { GoogleDetailsResponse } from "./google-details-response";

// SDK Types
export type GoogleDetailsSDK =
  | GoogleDetailsResponse
  | { error: string };

export const getGoogleDetailsSDK = async ({
  placeId,
  apiUrl,
}: {
  apiUrl: string;
  placeId: string;
}): Promise<GoogleDetailsSDK> => {
  const details = await getGoogleDetails({
    placeId,
    apiUrl,
  });

  return details;
};

export const getGoogleDetails = async ({
placeId,
  apiUrl,
}: {
  apiUrl: string;
  placeId: string;
}): Promise<GoogleDetailsResponse | { error: string }> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/service/google/places/details/${placeId}`
    );
    const json: GoogleDetailsResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content || { error };
};
