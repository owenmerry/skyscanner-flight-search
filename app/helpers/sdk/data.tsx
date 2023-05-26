import geoExtra from "~/data/geo-extra.json";
import slugify from 'slugify';
import { getPlaceFromEntityId, getGeoList } from '~/helpers/sdk/place';
import type { PlaceExtra } from '~/helpers/sdk/place';


export const getAllParents = (entityId: string): PlaceExtra[] => {
    const parents: PlaceExtra[] = [];

    for (let count = 0; count < 10; count++) {
        console.log(`- checking parent ${entityId}...`);
        const parent = getPlaceFromEntityId(entityId);
        if (parent === false) return parents;
        console.log(`-- found ${parent.name}...`);
        parents.push(parent);
        if (parent.parentId === '') {
            return parents;
        }
    }


    return parents;
}


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
        }
    })

}