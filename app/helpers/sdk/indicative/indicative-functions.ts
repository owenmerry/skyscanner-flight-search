import {
  getTripDays,
  getUpdatedFromTimestamps,
  getYYYYMMDDFromSkyscannerDate,
} from "~/helpers/date";
import { getAllParents } from "../data";
import { getPlaceFromEntityId, type Place } from "../place";
import { getPrice, getPriceRaw } from "../price";
import type {
  IndicitiveCarrier,
  SkyscannerAPIIndicativeResponse,
  SkyscannerDateTimeObject,
} from "./indicative-response";

export interface IndicativeQuotesSDK {
  id: string;
  from: Place;
  to: Place;
  parents: Place[];
  parentsString: string[];
  continent: Place;
  country: Place;
  city?: Place;
  isDirect: boolean;
  price: {
    display: string;
    raw?: number;
    amount: string;
    unit: string;
  };
  query: {
    from: Place;
    to: Place;
    depart: string;
    return: string;
  };
  legs: {
    depart: {
      date: SkyscannerDateTimeObject;
      dateString: string;
      carrier: IndicitiveCarrier;
    };
    return: {
      date: SkyscannerDateTimeObject;
      dateString: string;
      carrier: IndicitiveCarrier;
    };
  };
  days: number;
  tripDays: string;
  updated: string;
}

export const getIndicativeQuotesSDK = (
  search: SkyscannerAPIIndicativeResponse
): IndicativeQuotesSDK[] => {
  const indicativeContent = search.content;
  if(!indicativeContent) return [];
  const quote = Object.keys(indicativeContent.results.quotes).map((quoteKey) => {
    const quote = indicativeContent.results.quotes[quoteKey];
    const from = getPlaceFromEntityId(quote.outboundLeg.originPlaceId);
    const to = getPlaceFromEntityId(quote.outboundLeg.destinationPlaceId);
    if (!from || !to) return undefined;
    const parents = getAllParents(to.entityId);
    const parentsString = parents.map((parent) => parent.entityId);
    const outboundDateString = getYYYYMMDDFromSkyscannerDate(
      quote.outboundLeg.departureDateTime
    );
    const inboundDateString = getYYYYMMDDFromSkyscannerDate(
      quote.inboundLeg.departureDateTime
    );
    const country = parents.filter(
      (parent) => parent.type === "PLACE_TYPE_COUNTRY"
    )[0];
    const continent = parents.filter(
      (parent) => parent.type === "PLACE_TYPE_CONTINENT"
    )[0];
    const city = parents.filter(
      (parent) => parent.type === "PLACE_TYPE_CITY"
    )[0];
    const days = getTripDays(outboundDateString, inboundDateString);

    return {
      id: quoteKey,
      from,
      to,
      parents,
      parentsString,
      isDirect: quote.isDirect,
      country,
      continent,
      city,
      query: {
        from,
        to,
        depart: outboundDateString,
        return: inboundDateString,
      },
      price: {
        display: getPrice(quote.minPrice.amount, quote.minPrice.unit),
        raw: getPriceRaw(quote.minPrice.amount, quote.minPrice.unit),
        amount: quote.minPrice.amount,
        unit: quote.minPrice.unit,
      },
      legs: {
        depart: {
          date: quote.outboundLeg.departureDateTime,
          dateString: outboundDateString,
          carrier:
          indicativeContent.results.carriers[
              quote.outboundLeg.marketingCarrierId
            ],
        },
        return: {
          date: quote.inboundLeg.departureDateTime,
          dateString: inboundDateString,
          carrier:
          indicativeContent.results.carriers[
              quote.inboundLeg.marketingCarrierId
            ],
        },
      },
      days,
      tripDays: days === 1 ? `${days} day` : `${days} days`,
      updated: getUpdatedFromTimestamps(
        quote.outboundLeg.quoteCreationTimestamp,
        quote.inboundLeg.quoteCreationTimestamp
      ),
    };
  });
  const quoteAll = quote
    .filter((item) => item !== undefined)
    .sort((a, b) => {
      // Convert the amount strings to numbers
      const priceA = parseFloat(a.price.amount);
      const priceB = parseFloat(b.price.amount);

      // Sort in ascending order
      return priceA - priceB;
    });

  return quoteAll;
};
