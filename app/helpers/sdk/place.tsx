import geoData from "~/data/geo.json";

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

export const getEntityIdFromIata = (iata: string): string => {
  const places = geoData.places;
  const placeList = Object.keys(places);
  const iataList = placeList.map((value) => {
    return ((places as any)[value]);
  })
  const iataFound = iataList.filter(item => item.iata === iata);
  return iataFound.length > 0 ? iataFound[0].entityId : '';
}