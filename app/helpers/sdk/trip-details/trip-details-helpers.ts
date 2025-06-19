import type { TripDetailsResponse } from "./trip-details-response";
import type { TripDetailsResponseSDK } from "./trip-details-sdk";
import { getPlaceFromEntityId } from "../place";
import type { Place } from "../place";
import { searchAutoSuggest } from "../autosuggest";
import type { SkyscannerPlace } from "../autosuggest";
import { getCountryEntityId } from "../data";
import slugify from "slugify";

export const convertTripDetailsResponsetoSDK = async (
  tripDetails: TripDetailsResponse,
  apiUrl: string
): Promise<TripDetailsResponseSDK> => {
  let city: undefined | Place;
  debugger;
  const cityByEntityId = getPlaceFromEntityId(tripDetails.cityEntityId);
  if (cityByEntityId) {
    city = getPlaceFromEntityId(tripDetails.cityEntityId) || undefined;
  }
  if (!city) {
    const autosuggest = await searchAutoSuggest(
      tripDetails.cityEntityId,
      apiUrl,
      {
        type: ["PLACE_TYPE_CITY", "PLACE_TYPE_AIRPORT", "PLACE_TYPE_COUNTRY"],
      }
    );
    if (autosuggest.length > 0) {
      city = convertSkyscannerPlaceToPlace(autosuggest[0]);
    }
  }

  return {
    ...tripDetails,
    city: city ? city : undefined,
    trip: JSON.parse(JSON.parse(tripDetails.trip)),
    extra: "",
  };
};

export const convertSkyscannerPlaceToPlace = (
  skyscannerPlace: SkyscannerPlace
): Place => {
  return {
    entityId: skyscannerPlace.entityId,
    parentId: skyscannerPlace.parentId,
    name: skyscannerPlace.name,
    type: skyscannerPlace.type,
    iata: "",
    coordinates: {
      latitude: Number(skyscannerPlace.location.split(",")[0]),
      longitude: Number(skyscannerPlace.location.split(",")[1]),
    },
    images: [],
    slug: slugify(skyscannerPlace.name, {
      lower: true,
      strict: true,
    }),
    countryEntityId: getCountryEntityId(skyscannerPlace.parentId),
    country: {
      slug: slugify(skyscannerPlace.countryName, {
        lower: true,
        strict: true,
      }),
    },
  };
};
