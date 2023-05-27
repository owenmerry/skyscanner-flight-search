import slugify from "slugify";
import geoAll from "~/data/geo.json";
import geoData from "~/data/geo-extra.json";

export interface Place {
  entityId: string;
  parentId: string;
  name: string;
  type: string;
  iata: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type PlaceExtra = (Place & {
  images: string[];
  slug: string;
});

export const getEntityIdFromIata = (iata: string): string => {
  const list = getGeoList();
  const found = list.filter(item => item.iata === iata);
  return found.length > 0 ? found[0].entityId : '';
}

export const getIataFromEntityId = (entityId: string): string => {
  const list = getGeoList();
  const found = list.filter(item => item.entityId === entityId);
  return found.length > 0 ? found[0].iata : '';
}

export const getPlaceFromIata = (iata: string): PlaceExtra | false => {
  const list = getGeoList();
  const found = list.filter(item => item.iata === iata);
  return found.length > 0 ? found[0] : false;
}

export const getPlaceFromSlug = (slug: string): PlaceExtra | false => {
  const list = getGeoList();
  const found = list.filter(item => item.slug === slug);
  return found.length > 0 ? found[0] : false;
}

export const getPlaceFromEntityId = (entityId: string): PlaceExtra | false => {
  const list = getGeoList();
  const found = list.filter(item => item.entityId === entityId);
  return found.length > 0 ? found[0] : false;
}

export const getGeoList = (): PlaceExtra[] => {
  const places = geoAll.places;
  const placeList = Object.keys(places);
  const list = placeList.map((value) => {
    return convertPlaceToPlaceExtra((places as any)[value]);
  })

  return list;
}

const convertPlaceToPlaceExtra = (place: Place): PlaceExtra => {
  const found = geoData.filter(item => item.entityId === place.entityId);
  const placeExtra = found.length > 0 ? found[0] : false;
  return placeExtra || {
    ...place,
    images: [],
    slug: place.name ? slugify(place.name, {
      lower: true,
      strict: true,
    }) : ''
  };
}