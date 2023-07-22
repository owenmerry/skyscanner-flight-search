import type { SkyscannerAPIGeoResponse, Geo } from "./geo-response";
import slugify from "slugify";
import geoAll from "~/data/geo.json";
import geoImages from "~/data/geo-images.json";
import geoAirports from "~/data/geo-airport.json";

// SDK Types
export interface GeoSDK {
  places: Place[];
  countries: Place[];
  cities: Place[];
  airports: Place[];
}

export type Place = Geo & {
  images: string[];
  countryEntityId: string;
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

    return {
      ...place,
      countryEntityId,
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
  const cities = places.filter((place) => place.type === "PLACE_TYPE_CITY");
  const airports = places.filter(
    (place) => place.type === "PLACE_TYPE_AIRPORT"
  );

  return {
    places,
    countries,
    cities,
    airports,
  };
};

export const convertGeoToArray = (res?: SkyscannerAPIGeoResponse): Place[] => {
  const geoRes = res ? res : geoAll;
  const places = geoRes.places;
  const placeList = Object.keys(places);
  const list = placeList.map((value) => {
    return (places as any)[value];
  });

  return list;
};
