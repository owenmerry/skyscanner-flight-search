import { Place } from "../place";
import { convertTripDetailsResponsetoSDK } from "./trip-details-helpers";
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
  getAllTrip: (
    props: TripDetailsAllProps
  ) => Promise<TripDetailsResponseSDK[] | TripDetailsError>;
  updateTrip: (
    props: TripDetailsUpdateProps
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
  city?: Place;
  trip: any;
  editHash: string;
  extra: string;
  updatedAt: string;
  createdAt: string;
}

export const getTripDetailsSDK = (props: TripDetailsProps): TripDetailsSDK => {
  return {
    createTrip: createTripDetails,
    getTrip: getTripDetails,
    getAllTrip: getAllTripDetails,
    updateTrip: updateTripDetails,
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

  return convertTripDetailsResponsetoSDK(content);
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

export type TripDetailsAllProps = {
  apiUrl: string;
};
export const getAllTripDetails = async ({
  apiUrl,
}: TripDetailsAllProps): Promise<TripDetailsResponseSDK[] | TripDetailsError> => {
  let content : TripDetailsResponseSDK[] = [],
    error = "";
  try {
    console.log("get data");
    const res = await fetch(`${apiUrl}/trip/details/all`);
    const json: TripDetailsResponse[] = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json.map((trip) => (convertTripDetailsResponsetoSDK(trip)));
    }
  } catch (ex) {}

  if (!content) return { error };

  return content;
};

export type TripDetailsUpdateProps = {
  apiUrl: string;
  id: string;
  editHash: string;
  cityEntityId: string;
  trip: any;
};
export const updateTripDetails = async ({
  apiUrl,
  id,
  editHash,
  cityEntityId,
  trip,
}: TripDetailsUpdateProps): Promise<
  TripDetailsResponse | { error: string }
> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/trip/details/update?id=${id}&editHash=${editHash}&cityEntityId=${cityEntityId}&trip=${JSON.stringify(
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
