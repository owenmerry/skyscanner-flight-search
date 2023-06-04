import { getImages } from "~/helpers/sdk/query";
import geoData from "~/data/geo.json";
import type { Place } from "~/helpers/sdk/place";
import { getAllParents } from "~/helpers/sdk/data";

export const runSaveImages = async (apiUrl: string) => {
  const places: { [key: string]: Place } = geoData.places;
  const placeList: Place[] = Object.keys(places).map(
    (placeKey) => places[placeKey]
  );
  let countryCount = 0;
  let countryJSON: Place[] = [];
  const group = 12; //run 6
  const groupShow = 20;

  const countries = placeList
    .filter((place) => place.type === "PLACE_TYPE_COUNTRY")
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const country of countries) {
    countryCount++;
    if (
      countryCount >= groupShow * (group - 1) + 1 &&
      countryCount <= groupShow * group
    ) {
      const imageResponse = await getImages({ apiUrl, query: country.name });
      countryJSON.push({
        ...country,
        images: imageResponse,
      });
      console.log(country.name);
    }
  }

  return countryJSON;
};

export const getRandomImageNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const getImagesFromParents = (entityId: string) => {
  const parents = getAllParents(entityId);
  const parentsWithImages = parents.filter((item) => item.images.length > 0);

  return parentsWithImages[0].images;
};
