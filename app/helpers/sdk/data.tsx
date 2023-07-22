import geoExtra from "~/data/geo-extra.json";
import slugify from "slugify";
import { getPlaceFromEntityId, getGeoList } from "~/helpers/sdk/place";
import type { Place } from "~/helpers/sdk/place";

export const getAllParents = (entityId: string): Place[] => {
  const parents: Place[] = [];
  const first = getPlaceFromEntityId(entityId);
  if (!first) return parents;
  parents.push(first);

  for (let count = 0; count < 10; count++) {
    console.log(`- checking parent ${entityId}...`);
    const parent = getPlaceFromEntityId(parents[parents.length - 1].parentId);
    if (parent === false) return parents;
    console.log(`-- found ${parent.name}...`);
    parents.push(parent);
    if (parent.parentId === "") {
      return parents;
    }
  }

  return parents;
};

export const getCountryEntityId = (entityId: string): string => {
  var entityCheck = entityId;
  console.log(`checking ${entityCheck}`);

  for (let count = 0; count < 10; count++) {
    const place = getPlaceFromEntityId(entityCheck);
    if (place === false) return "";
    if (place.type === "PLACE_TYPE_COUNTRY") {
      console.log(`country ${place.name}`);
      return place.entityId;
    } else {
      console.log(`check parent ${place.parentId}`);
      entityCheck = place.parentId;
    }
  }

  return "";
};

export const updateGEOSlug = () => {
  return geoExtra.map((geo) => {
    // const parents = getAllParents(geo.parentId);
    // console.log(`===== Place ${geo.name}...`);

    return {
      ...geo,
      slug: slugify(geo.name, {
        lower: true,
        strict: true,
      }),
      //parents,
    };
  });
};

export const getAirportWithCountries = () => {
  const places = getGeoList();
  const airports = places.filter(
    (place) => place.type === "PLACE_TYPE_AIRPORT"
  );
  const airportsWithCountry = airports.map((airport) => {
    const countryEntity = getCountryEntityId(airport.parentId);

    return {
      iata: airport.iata,
      entityId: airport.entityId,
      name: airport.name,
      countryEntityId: countryEntity,
    };
  });

  return airportsWithCountry;
};
