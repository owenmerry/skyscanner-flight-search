import type { GoogleRouteResponse } from "./google-route-response";

// SDK Types
export type GoogleRouteSDK = GoogleRouteResponse | { error: string };

export type GoogleRouteProps = {
  apiUrl: string;
  origin: {
    latLng?: {
      latitude: string | number;
      longitude: string | number;
    };
    address?: string;
    placeId?: string;
  };
  destination: {
    latLng?: {
      latitude: string | number;
      longitude: string | number;
    };
    address?: string;
    placeId?: string;
  };
  travelMode: "TRANSIT" | "DRIVING" | "WALKING" | "BICYCLING";
  arrivalTime: string;
};

export const getGoogleRouteSDK = async (
  props: GoogleRouteProps
): Promise<GoogleRouteSDK> => {
  const route = await getGoogleRoute(props);

  return route;
};

export const getGoogleRoute = async ({
  origin,
  destination,
  travelMode,
  arrivalTime,
  apiUrl,
}: GoogleRouteProps): Promise<GoogleRouteResponse | { error: string }> => {
  let content,
    error = "";
  try {
    let originQueryParams = "";
    if (origin.placeId) {
      originQueryParams = `&originId=${origin.placeId}`;
    } else if (origin.latLng) {
      originQueryParams = `&originLat=${origin.latLng.latitude}&originLng=${origin.latLng.longitude}`;
    } else if (origin.address) {
      originQueryParams = `&originAddress=${origin.address}`;
    }
    let destinationQueryParams = "";
    if (destination.placeId) {
      destinationQueryParams = `&destinationId=${destination.placeId}`;
    } else if (destination.latLng) {
      destinationQueryParams = `&destinationLat=${destination.latLng.latitude}&destinationLng=${destination.latLng.longitude}`;
    } else if (destination.address) {
      destinationQueryParams = `&destinationAddress=${destination.address}`;
    }

    console.log(`${apiUrl}/service/google/routes?travelMode=${travelMode}${originQueryParams}${destinationQueryParams}&arrivalTime=${arrivalTime}`);

    const res = await fetch(
      `${apiUrl}/service/google/routes?travelMode=${travelMode}${originQueryParams}${destinationQueryParams}&arrivalTime=${arrivalTime}`
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
