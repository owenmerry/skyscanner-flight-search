import type { SkyscannerAPIGeoResponse, Geo } from "./geo-response";
import slugify from "slugify";
import geoAll from "~/data/geo.json";
import geoImages from "~/data/geo-images.json";
import geoAirports from "~/data/geo-airport.json";

// SDK Types
export interface GeoSDK {
  places: Place[];
  countries: Place[];
  continent: Place[];
  cities: Place[];
  airports: Place[];
  index: { [key: string]: Place };
}

export type Place = Geo & {
  images: string[];
  countryEntityId: string;
  parent: {
    slug?: string;
  };
  slug: string;
};

export const getGeoSDK = (res?: SkyscannerAPIGeoResponse): GeoSDK => {
  const geoPlaces = convertGeoToArray(res).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const places = geoPlaces.map((place) => {
    const images =
      geoImages.filter((geoImage) => geoImage.entityId === place.entityId)[0]
        ?.images || [];

    const airportWithCountryId = geoAirports.filter(
      (geoAirport) => geoAirport.entityId === place.entityId
    );
    const countryEntityId =
      airportWithCountryId.length > 0
        ? airportWithCountryId[0].countryEntityId
        : "";
    const parent = geoPlaces.find(
      (geoPlace) => geoPlace.entityId === place.parentId
    );
    const parentSlug =
      parent &&
      slugify(parent.name, {
        lower: true,
        strict: true,
      });

    return {
      ...place,
      countryEntityId,
      parent: {
        slug: parentSlug,
      },
      images: images,
      slug: place.name
        ? slugify(place.name, {
            lower: true,
            strict: true,
          })
        : "",
    };
  });
  const countries = places.filter(
    (place) => place.type === "PLACE_TYPE_COUNTRY"
  );
  const continent = places.filter(
    (place) => place.type === "PLACE_TYPE_CONTINENT"
  );
  const cities = places.filter((place) => place.type === "PLACE_TYPE_CITY");
  const airports = places.filter(
    (place) => place.type === "PLACE_TYPE_AIRPORT"
  );
  var index: { [key: string]: Place } = {};
  places.forEach((place) => {
    index[place.entityId] = place;
  });

  return {
    places,
    countries,
    continent,
    cities,
    airports,
    index,
  };
};

export const convertGeoToArray = (res?: SkyscannerAPIGeoResponse): Place[] => {
  const geoAllType = geoAll as unknown as { places: { [key: string]: string } };
  const geoRes = res ? res : geoAllType;
  const places = geoRes.places;
  const placeList = Object.keys(places);
  const list = placeList.map((value) => {
    return (places as any)[value];
  });

  return list;
};
