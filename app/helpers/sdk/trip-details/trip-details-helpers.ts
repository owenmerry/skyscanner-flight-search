import type { TripDetailsResponse } from "./trip-details-response";
import type { TripDetailsResponseSDK } from "./trip-details-sdk";
import { getPlaceFromEntityId } from "../place";

export const convertTripDetailsResponsetoSDK = (
  tripDetails: TripDetailsResponse
): TripDetailsResponseSDK => {
    const city = getPlaceFromEntityId(tripDetails.cityEntityId);

  return {
    ...tripDetails,
    city: city ? city : undefined,
    trip: JSON.parse(JSON.parse(tripDetails.trip)),
    extra: "",
  };
}