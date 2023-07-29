import type {
  SkyscannerAPIIndicitiveResponse,
  IndicitiveQuote,
} from "~/types/geo";
import { getSEODateDetails } from "~/helpers/date";
import type { Place } from "~/helpers/sdk/place";
import type { Query } from "~/types/search";

export const filterNonCordItems = (
  quoteGroups: IndicitiveQuote[],
  search?: SkyscannerAPIIndicitiveResponse
) => {
  return quoteGroups.filter((quoteGroup) => {
    if (!search) return null;
    const { placeOutboundDestination } = getSEODateDetails(
      search.content.results,
      quoteGroup.quoteIds[0]
    );

    return !!placeOutboundDestination.coordinates;
  });
};

export interface Markers {
  location: google.maps.LatLngLiteral;
  label: string;
  icon?: string;
}

export const getMarkersWorld = (places: Place[]): Markers[] | null => {
  const markers = places.map((place) => {
    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `<div>${
        place.images[0] ? `<img src='${place.images[0]}&w=250' />` : ""
      }</div><div class='mt-2 dark:text-black'><a href='/explore/${
        place.slug
      }'>${place.name}</a></div>`,
      icon: "\ue153",
    };
  });
  return markers;
};

export const getMarkersCountry = (
  places: Place[],
  from: Place | false,
  defaultSearch: Query
): Markers[] | null => {
  const markers = places.map((place) => {
    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `<div>${
        place.images[0] ? `<img src='${place.images[0]}&w=250' />` : ""
      }</div><div class='mt-2 dark:text-black'><a href='/search/${
        from ? from.iata : ""
      }/${place.iata}/${defaultSearch.depart}/${defaultSearch.return}'>${
        place.name
      }</a></div>`,
      icon: place.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
    };
  });
  return markers;
};

export const getFlightSearch = (places: Place[]): Markers[] | null => {
  const markers = places.map((place) => {
    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `<div>${
        place.images[0] ? `<img src='${place.images[0]}&w=250' />` : ""
      }</div><div class='mt-2 dark:text-black'>${place.name} </div>`,
      icon: place.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
    };
  });
  return markers;
};
