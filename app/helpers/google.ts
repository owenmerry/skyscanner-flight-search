import type { GeoSDK } from "./sdk/geo/geo-sdk";
import type { GoogleDetailsResponse } from "./sdk/google-details/google-details-response";
import type { Place } from "./sdk/place";
import { skyscanner } from "./sdk/skyscannerSDK";

export const getGoogleLocationFromId = async ({
  placeId,
  apiUrl,
}: {
  placeId?: string;
  apiUrl: string;
}): Promise<GoogleDetailsResponse | undefined> => {
  if (!placeId) return undefined;
  const googleDetails = await skyscanner().services.google.details({
    placeId: placeId,
    apiUrl,
  });

  return "error" in googleDetails ? undefined : googleDetails;
};

export const getSkyscannerPlaceNearbyByLatLng = async ({
  location,
  apiUrl,
}: {
  location?: { latitude: number; longitude: number };
  apiUrl: string;
}): Promise<{
    geo: GeoSDK;
    iataPlace?: Place;
    iataPlaceAirport?: Place;
    iataPlaceCity?: Place;
    iataPlaceCountry?: Place;
} | undefined> => {
  if (!location || !location.latitude || !location.longitude) return undefined;
  const nearby = await skyscanner()
    .geoAll()
    .nearby({
      apiUrl,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    if("error" in nearby) return undefined;

    const iataPlaceAirport = nearby.places.find((place) => place.type === "PLACE_TYPE_AIRPORT" && place.iata);
    const iataPlaceCity = nearby.places.find((place) => place.type === "PLACE_TYPE_CITY" && place.iata);
    const iataPlaceCountry = nearby.places.find((place) => place.type === "PLACE_TYPE_COUNTRY" && place.iata);
    const iataPlace = iataPlaceCity || iataPlaceAirport;

  return {
    geo: nearby,
    iataPlace: iataPlace,
    iataPlaceAirport,
    iataPlaceCity,
    iataPlaceCountry,
  };
};
