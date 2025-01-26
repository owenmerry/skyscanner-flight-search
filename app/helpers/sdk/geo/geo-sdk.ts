import type { SkyscannerAPIGeoResponse, Geo } from "./geo-response";
import slugify from "slugify";
import geoAll from "~/data/geo.json";
import geoCountries from "~/data/geo-country.json";
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
  country: {
    slug?: string;
  };
  slug: string;
};

export const getGeoSDK = (res?: SkyscannerAPIGeoResponse): GeoSDK => {
  return convertGeoToSeoSDK(res);
};
export const convertGeoToSeoSDK = (res?: SkyscannerAPIGeoResponse): GeoSDK => {
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
    const country = geoCountries.filter(
      (geoCountry) => geoCountry.entityId === place.parentId
    );
    const countryEntityId =
      airportWithCountryId.length > 0
        ? airportWithCountryId[0].countryEntityId
        : "";
    const countrySlug = country.length > 0 ? country[0].slug : "";

    return {
      ...place,
      countryEntityId,
      country: {
        slug: countrySlug,
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

export const getGeoNearby = async ({
  apiUrl,
  location: { latitude, longitude },
}: {
  apiUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
}): Promise<GeoSDK | { error: string }> => {
  let content,
    error = "";
  try {
    const res = await fetch(
      `${apiUrl}/flights/geo/nearest?latitude=${latitude}&longitude=${longitude}`
    );
    const json: SkyscannerAPIGeoResponse = await res.json();

    if (!json) {
      error =
        "Sorry, something happened and we couldnt do this search, maybe try a differnt search";
    } else {
      content = json;
    }
  } catch (ex) {}

  return content ? convertGeoToSeoSDK(content) : { error };
};

export interface GeoAllSDK {
  all: (res?: SkyscannerAPIGeoResponse) => GeoSDK;
  nearby: ({
    apiUrl,
    location: { latitude, longitude },
  }: {
    apiUrl: string;
    location: {
      latitude: number;
      longitude: number;
    };
  }) => Promise<GeoSDK | { error: string }>;
}

export const getGeoAllSDK = (): GeoAllSDK => {
  return {
    all: getGeoSDK,
    nearby: getGeoNearby,
  };
};
