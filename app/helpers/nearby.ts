import type { GeoSDK } from "./sdk/geo/geo-sdk";

export const getNearbySearchLink = (from?: GeoSDK, to?: GeoSDK) : string | undefined => {
    if (!from || !to) return undefined;
    const fromIata = from.places.find((place) => place.type === "PLACE_TYPE_CITY" && place.iata) || from.places.find((place) => place.type === "PLACE_TYPE_AIRPORT" && place.iata);
    const toIata = to.places.find((place) => place.type === "PLACE_TYPE_CITY" && place.iata) || to.places.find((place) => place.type === "PLACE_TYPE_AIRPORT" && place.iata);
    if (!fromIata || !toIata) return undefined;

    return `/search/${fromIata.iata}/${toIata.iata}/2025-06-01/2025-06-10`;
  }