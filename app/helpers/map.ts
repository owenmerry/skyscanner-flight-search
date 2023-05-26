import type { SkyscannerAPIIndicitiveResponse, IndicitiveQuote } from '~/types/geo';
import { getSEODateDetails } from '~/helpers/date';
import type { PlaceExtra } from '~/helpers/sdk/place';

export const filterNonCordItems = (quoteGroups: IndicitiveQuote[], search?: SkyscannerAPIIndicitiveResponse) => {
    return quoteGroups.filter((quoteGroup) => {
        if (!search) return null;
        const {
            placeOutboundDestination,
        } = getSEODateDetails(search.content.results, quoteGroup.quoteIds[0]);

        return !!placeOutboundDestination.coordinates;
    });
}

export const getMarkers = (places: PlaceExtra[]): {
    location: google.maps.LatLngLiteral;
    label: string;
}[] | null => {
    const markers = places.map((place) => {

        return {
            location: {
                lat: place.coordinates.latitude,
                lng: place.coordinates.longitude,
            },
            label: `<div><img src='${place.images[0]}&w=250' /></div><div class='mt-2 dark:text-black'><a href='/explore/${place.slug}'>${place.name}</a></div>`,
        }
    });
    return markers;
}