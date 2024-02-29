import type {
  SkyscannerAPIIndicitiveResponse,
  IndicitiveQuote,
} from "~/types/geo";
import { getDateDisplay, getSEODateDetails } from "~/helpers/date";
import { getPlaceFromEntityId, type Place } from "~/helpers/sdk/place";
import type { Query } from "~/types/search";
import { SkyscannerAPIIndicativeResponse } from "./sdk/indicative/indicative-response";
import { getPrice } from "./sdk/price";

const websiteURL = "http://flights.owenmerry.com";

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
  link?: string;
}

export const getMarkersWorld = (places: Place[]): Markers[] | null => {
  const markers = places.map((place) => {
    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `
      <div class="relative bg-white p-2 border border-indigo-500 rounded-lg">
      
      <div class="text-gray-800 text-sm">
      <a href='/explore/${place.slug}'>
      <div>${
        place.images[0]
          ? `<img width="100px" src='${place.images[0]}&w=100' />`
          : ""
      }</div>
      <div>${place.name}</div>
      </a>
      </div>

      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-indigo-500"></div>
      </div>

     `,
      icon: "\ue153",
      link: `http://localhost:3000/explore/${place.slug}`,
    };
  });
  return markers;
};

export const getMarkersCountry = (
  places: Place[],
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined,
  from: Place | false,
  defaultSearch: Query
): Markers[] | null => {
  if (!indicativeSearch) return [];
  const markers = places.map((place) => {
    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `
      <div class="relative bg-white p-2 border border-indigo-500 rounded-lg">
      
      <div class="text-gray-800 text-sm">
        <a href='/search/${from ? from.iata : ""}/${place.iata}/${
        defaultSearch.depart
      }/${defaultSearch.return}'>
        <div>${place.name}</div>
        </a>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-indigo-500"></div>
      </div>`,
      icon: place.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
      link: `${websiteURL}/search/${from ? from.iata : ""}/${place.iata}/${
        defaultSearch.depart
      }/${defaultSearch.return}`,
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
      // label: `<div>${
      //   place.images[0] ? `<img src='${place.images[0]}&w=250' />` : ""
      // }</div><div class='mt-2 dark:text-black'>${place.name} </div>`,
      label: `
      <div class="relative bg-primary-700 p-2 rounded-lg">

      <div class="text-white text-sm">
        <div>${place.name}</div>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700"></div>
      </div>`,

      icon: place.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
    };
  });
  return markers;
};

export const getMarkersCountryTo = (
  places: Place[],
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined,
  from: Place | false,
  defaultSearch: Query
): Markers[] | null => {
  if (!indicativeSearch) return [];
  const markers = places.map((place) => {
    let priceLowest = "";
    Object.keys(indicativeSearch.content.results.quotes).map((quote) => {
      if (
        indicativeSearch.content.results.quotes[quote].outboundLeg
          .destinationPlaceId === place.entityId
      ) {
        priceLowest = getPrice(
          indicativeSearch.content.results.quotes[quote].minPrice.amount,
          indicativeSearch.content.results.quotes[quote].minPrice.unit
        );
      }
    });

    return {
      location: {
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude,
      },
      label: `
      <div class="relative bg-primary-700 p-2 rounded-lg ">
      
      <div class="text-white text-sm">
        <a href='/search/${from ? from.iata : ""}/${place.iata}/${
        defaultSearch.depart
      }/${defaultSearch.return}'>
        <div>${place.name}</div>
        <div className='font-bold'>${priceLowest}</div>
        </a>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700 hover:bg-primary-600"></div>
      </div>`,
      icon: place.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
      link: `${websiteURL}/search/${from ? from.iata : ""}/${place.iata}/${
        defaultSearch.depart
      }/${defaultSearch.return}`,
    };
  });
  return markers;
};

export const getMarkersCountryFrom = (
  places: Place[],
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined,
  from: Place | false,
  defaultSearch: Query
): Markers[] | null => {
  if (!indicativeSearch) return [];
  let markers: Markers[] = [];
  indicativeSearch.content.groupingOptions.byRoute.quotesGroups.forEach(
    (quote) => {
      // quote.quoteIds.map((quoteId) => {
      //   const quoteFlight = indicativeSearch.content.results.quotes[quoteId];
      //   quoteFlight.minPrice.amount
      // })
      console.log("quote");

      const quoteFlight =
        indicativeSearch.content.results.quotes[quote.quoteIds[0]];
      const destinationPlace = getPlaceFromEntityId(
        quoteFlight.outboundLeg.destinationPlaceId
      );
      const originPlace = getPlaceFromEntityId(
        quoteFlight.outboundLeg.originPlaceId
      );
      if (!destinationPlace) return;
      if (!originPlace) return;

      console.log("quote added");

      markers.push({
        location: {
          lat: destinationPlace.coordinates.latitude,
          lng: destinationPlace.coordinates.longitude,
        },
        label: `
      <div class="relative bg-primary-700 p-2 rounded-lg ">
      
      <div class="text-white text-sm">
        <a>
        <div>${destinationPlace.name}</div>
        <div className='font-bold'>${getPrice(
          quoteFlight.minPrice.amount,
          quoteFlight.minPrice.unit
        )}</div>
        </a>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700 hover:bg-primary-600"></div>
      </div>`,
        link: `${websiteURL}/search/${originPlace.iata}/${
          destinationPlace.iata
        }/${getDateDisplay(
          quoteFlight.outboundLeg.departureDateTime,
          "YYYY-MM-DD"
        )}/${getDateDisplay(
          quoteFlight.inboundLeg.departureDateTime,
          "YYYY-MM-DD"
        )}`,
        icon:
          destinationPlace.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
      });
    }
  );

  console.log(markers);

  return markers;
};

export const getMarkersMapSearchComponent = (
  indicativeSearch: SkyscannerAPIIndicativeResponse | undefined
): Markers[] | null => {
  if (!indicativeSearch) return [];
  let markers: Markers[] = [];
  indicativeSearch.content.groupingOptions.byRoute.quotesGroups.forEach(
    (quote) => {
      // quote.quoteIds.map((quoteId) => {
      //   const quoteFlight = indicativeSearch.content.results.quotes[quoteId];
      //   quoteFlight.minPrice.amount
      // })
      console.log("quote");

      const quoteFlight =
        indicativeSearch.content.results.quotes[quote.quoteIds[0]];
      const destinationPlace = getPlaceFromEntityId(
        quoteFlight.outboundLeg.destinationPlaceId
      );
      const originPlace = getPlaceFromEntityId(
        quoteFlight.outboundLeg.originPlaceId
      );
      if (!destinationPlace) return;
      if (!originPlace) return;

      console.log("quote added");

      markers.push({
        location: {
          lat: destinationPlace.coordinates.latitude,
          lng: destinationPlace.coordinates.longitude,
        },
        label: `
      <div class="relative bg-primary-700 p-2 rounded-lg ">
      
      <div class="text-white text-sm">
        <a>
        <div>${destinationPlace.name}</div>
        <div className='font-bold'>${getPrice(
          quoteFlight.minPrice.amount,
          quoteFlight.minPrice.unit
        )}</div>
        </a>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700 hover:bg-primary-600"></div>
      </div>`,
        link: `${websiteURL}/search/${originPlace.iata}/${
          destinationPlace.iata
        }/${getDateDisplay(
          quoteFlight.outboundLeg.departureDateTime,
          "YYYY-MM-DD"
        )}/${getDateDisplay(
          quoteFlight.inboundLeg.departureDateTime,
          "YYYY-MM-DD"
        )}`,
        icon:
          destinationPlace.type === "PLACE_TYPE_AIRPORT" ? "\ue539" : "\ue7f1",
      });
    }
  );

  console.log(markers);

  return markers;
};
