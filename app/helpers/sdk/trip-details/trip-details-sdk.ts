import type { TripDetailsResponse } from "./trip-details-response";

// SDK Types
export type TripDetailsSDK = {
  getTrip: ({
    apiUrl,
    id,
  }: TripDetailsProps) => Promise<TripDetailsResponseSDK | TripDetailsError>;
  createTrip: (
    props: TripDetailsCreateProps
  ) => Promise<TripDetailsResponse | TripDetailsError>;
};

export type TripDetailsProps = {
  apiUrl: string;
  id: string;
};
export type TripDetailsError = {
  error: string;
};

export interface TripDetailsResponseSDK {
  id: string;
  cityEntityId: string;
  trip: any;
  extra: string;
  updatedAt: string;
  createdAt: string;
}

export const getTripDetailsSDK = (
  props: TripDetailsProps
): TripDetailsSDK => {
  return {
    createTrip: createTripDetails,
    getTrip: getTripDetails,
  };
};

export const getTripDetails = async ({
  apiUrl,
  id,
}: TripDetailsProps): Promise<TripDetailsResponseSDK | TripDetailsError> => {
  let content,
    error = "";
  try {
    const res = await fetch(`${apiUrl}/trip/details/${id}`);
    const json: TripDetailsResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  if (!content) return { error };

  return {
    ...content,
    trip: JSON.parse(content.trip),
    extra: "",
  };
};

export type TripDetailsCreateProps = {
  apiUrl: string;
  cityEntityId: string;
  trip: any;
};
export const createTripDetails = async ({
  apiUrl,
  cityEntityId,
  trip,
}: TripDetailsCreateProps): Promise<
  TripDetailsResponse | { error: string }
> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/trip/details/create?cityEntityId=${cityEntityId}&trip=${JSON.stringify(
        trip
      )}`
    );
    const json: TripDetailsResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  if (!content) return { error };

  return content;
};
