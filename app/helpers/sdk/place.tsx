import slugify from "slugify";
import geoAll from "~/data/geo.json";
import geoData from "~/data/geo-extra.json";
import type { Geo } from "~/helpers/sdk/geo/geo-response";
import type { Place } from "~/helpers/sdk/geo/geo-sdk";
export type { Place } from "~/helpers/sdk/geo/geo-sdk";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

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

export const getPlaceFromSlug = (slug: string, type: string): Place | false => {
  const list = getGeoList();
  const found = list.filter((item) => item.slug === slug && item.type === type);
  return found.length > 0 ? found[0] : false;
};

export const getPlaceFromEntityId = (entityId: string): Place | false => {
  const list = getGeoObject();
  const found = list[entityId];
  return found ? found : false;
};

export const getGeoList = (): Place[] => {
  const list = skyscanner().geo().places;

  return list;
};

export const getGeoObject = (): { [key: string]: Place } => {
  const list = geoAll.places as unknown as { [key: string]: Place };

  return list;
};

export const getGeo = () => {
  return skyscanner().geo();
};
