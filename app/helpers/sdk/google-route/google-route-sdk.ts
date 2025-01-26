import type { GoogleRouteResponse } from "./google-route-response";

// SDK Types
export type GoogleRouteSDK = GoogleRouteResponse | { error: string };

export type GoogleRouteProps = {
  apiUrl: string;
  origin: {
    latLng?: {
      latitude: string;
      longitude: string;
    };
    address?: string;
    placeId?: string;
  };
  destination: {
    latLng?: {
      latitude: string;
      longitude: string;
    };
    address?: string;
    placeId?: string;
  };
  travelMode: "TRANSIT" | "DRIVING" | "WALKING" | "BICYCLING";
  arrivalTime: string;
};

export const getGoogleRouteSDK = async (props : GoogleRouteProps): Promise<GoogleRouteSDK> => {
  const route = await getGoogleRoute(props);

  return route;
};

export const getGoogleRoute = async (
  {
    origin,
    destination,
    travelMode,
    arrivalTime,
    apiUrl,
  }: GoogleRouteProps
): Promise<
  GoogleRouteResponse | { error: string }
> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/service/google/routes?travelMode=${travelMode}&originId=${origin.placeId}&destinationId=${destination.placeId}&arrivalTime=${arrivalTime}`
    );
    const json: GoogleRouteResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content || { error };
};
