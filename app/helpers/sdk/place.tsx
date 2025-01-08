import { skyscanner } from "./skyscannerSDK";
import type { Place } from "~/helpers/sdk/geo/geo-sdk";
export type { Place } from "~/helpers/sdk/geo/geo-sdk";

const geoData = skyscanner().geo();
const geoDataList = skyscanner().geo().places;

export const getEntityIdFromIata = (iata: string): string => {
  const list = getGeoList();
  const found = list.filter((item) => item.iata === iata);
  return found.length > 0 ? found[0].entityId : "";
};

export const getIataFromEntityId = (entityId: string): string => {
  const list = getGeoList();
  const found = list.filter((item) => item.entityId === entityId);
  return found.length > 0 ? found[0].iata : "";
};

export const getPlaceFromIata = (iata: string): Place | false => {
  const list = getGeoList();
  const found = list.filter((item) => item.iata === iata);
  return found.length > 0 ? found[0] : false;
};

export const getPlacesFromIatas = (iatas?: string[]): Place[] => {
  if (!iatas) return [];
  const places: Place[] = [];
  iatas.forEach((iata) => {
    const place = getPlaceFromIata(iata);
    if (place) {
      places.push(place);
    }
  });

  return places;
};

export const getPlaceFromSlug = (
  slug: string,
  type: string | string[],
  options?: {
    parentId?: string;
  }
): Place | false => {
  const list = getGeoList();
  const found = list.filter(
    (item) =>
      item.slug === slug &&
      (typeof type === "string"
        ? item.type === type
        : type.includes(item.type)) &&
      (options?.parentId ? options?.parentId === item.parentId : true)
  );
  return found.length > 0 ? found[0] : false;
};

export const getPlaceChildren = (place: Place): Place[] => {
  const list = getGeoList().filter((item) => item.parentId === place.entityId);
  return list;
};

export const getPlaceType = (place: Place): string => {
  const placeType: { [key: string]: string } = {
    PLACE_TYPE_CITY: "City",
    PLACE_TYPE_COUNTRY: "Country",
    PLACE_TYPE_CONTINENT: "Continent",
    PLACE_TYPE_ISLAND: "Island",
    PLACE_TYPE_AIRPORT: "Airport",
  };

  return placeType[place.type];
};

export const getPlaceFromEntityId = (entityId: string): Place | false => {
  const list = getGeoIndex();
  const found = list[entityId];
  return found ? found : false;
};

export const getGeoList = (): Place[] => {
  const list = geoDataList;

  return list;
};

export const getGeoIndex = (): { [key: string]: Place } => {
  const index = getGeo().index as unknown as { [key: string]: Place };

  return index;
};

export const getGeo = () => {
  return geoData;
};
