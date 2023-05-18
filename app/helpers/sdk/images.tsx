import { getImages } from '~/helpers/sdk/query';
import geoData from "~/data/geo.json";
import type { Place } from "~/helpers/sdk/place";


export type CountryImagesJSON = (Place & {
    images: string[];
});

export const runSaveImages = async (apiUrl: string) => {
    const places: { [key: string]: Place } = geoData.places;
    const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));
    let countryCount = 0;
    let countryJSON: CountryImagesJSON[] = [];
    const group = 9; //run 6
    const groupShow = 20;

    const countries = placeList.filter(place => place.type === 'PLACE_TYPE_COUNTRY').sort((a, b) => a.name.localeCompare(b.name));

    for (const country of countries) {
        countryCount++;
        if (countryCount >= (groupShow * (group - 1)) + 1 && countryCount <= groupShow * group) {
            const imageResponse = await getImages({ apiUrl, query: country.name });
            countryJSON.push({
                ...country,
                images: imageResponse,
            });
            console.log(country.name);
        }
    }

    return countryJSON;
}