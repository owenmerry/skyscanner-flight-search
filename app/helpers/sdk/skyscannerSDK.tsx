import { getPrice } from "./price";
import { getDateTime, getTime } from "./dateTime";
import { convertDeepLink } from "./link";
import { hasDirectFlights, isDirectFlights } from "./flight";
//geo
import type { SkyscannerAPIGeoResponse } from "./geo/geo-response";
import type { GeoSDK } from "./geo/geo-sdk";
import { getGeoSDK } from "./geo/geo-sdk";
//hotels
import type { SkyscannerAPIHotelSearchResponse } from "./hotel/hotel-response";
import type { HotelSDK } from "./hotel/hotel-sdk";
import { getHotelSDK } from "./hotel/hotel-sdk";
import { FlightQuery } from "~/types/search";
//indicative
import type { SkyscannerAPIIndicativeResponse } from "./indicative/indicative-response";
import type { IndicativeSDK } from "./indicative/indicative-sdk";
import { getIndicativeSDK } from "./indicative/indicative-sdk";

// types (Response)

export interface SkyscannerAPICreateResponse {
  sessionToken: string;
  action: string;
  status: string;
  content: {
    results: {
      agents: { [key: string]: Agent };
      itineraries: { [key: string]: Itinerary };
      legs: { [key: string]: Leg };
      carriers: { [key: string]: Carrier };
      places: { [key: string]: Place };
      segments: { [key: string]: Segment };
    };
    sortingOptions: {
      best: Flight[];
      cheapest: Flight[];
      fastest: Flight[];
    };
    stats: {
      itineraries: {
        total: {
          count: number;
          minPrice: {
            amount: string;
            unit: string;
          };
        };
        stops: {
          direct: {
            total: {
              count: number;
              minPrice: {
                amount: string;
                unit: string;
              };
            };
          };
          oneStop: {
            total: {
              count: number;
              minPrice: {
                amount: string;
                unit: string;
              };
            };
          };
        };
      };
    };
  };
}

interface Flight {
  score: number;
  itineraryId: string;
}

interface Agent {
  feedbackCount: number;
  imageUrl: string;
  isOptimisedForMobile: boolean;
  name: string;
  rating: number;
  type:
    | "AGENT_TYPE_UNSPECIFIED"
    | "AGENT_TYPE_TRAVEL_AGENT"
    | "AGENT_TYPE_AIRLINE";
  ratingBreakdown: {
    customerService: number;
    reliablePrices: number;
    clearExtraFees: number;
    easeOfBooking: number;
    other: number;
  };
}

interface Carrier {
  name: string;
  allianceId: string;
  imageUrl: string;
  iata: string;
}

interface Itinerary {
  pricingOptions: {
    price: { amount: string; unit: string };
    items: { deepLink: string; agentId: string }[];
  }[];
  legIds: string[];
}

interface Leg {
  originPlaceId: string;
  destinationPlaceId: string;
  durationInMinutes: number;
  departureDateTime: DateTime;
  arrivalDateTime: DateTime;
  stopCount: number;
  segmentIds: string[];
  marketingCarrierIds: string[];
  operatingCarrierIds: string[];
}

interface Segment {
  originPlaceId: string;
  destinationPlaceId: string;
  durationInMinutes: number;
  departureDateTime: DateTime;
  arrivalDateTime: DateTime;
}

interface Place {
  entityId: string;
  parentId: string;
  name: string;
  type: string;
  iata: string;
}

interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

//types (SDK)
export interface SkyscannerSDK {
  search: (res: SkyscannerAPICreateResponse) => SearchSDK;
  geo: (res?: SkyscannerAPIGeoResponse) => GeoSDK;
  indicative: ({
    res,
    query,
    apiUrl,
    month,
    year,
    groupType,
  }: {
    res?: SkyscannerAPIIndicativeResponse;
    query?: FlightQuery;
    apiUrl?: string;
    month?: number;
    year?: number;
    groupType?: string;
  }) => Promise<IndicativeSDK>;
  hotel: ({
    res,
    query,
    apiUrl,
  }: {
    res?: SkyscannerAPIHotelSearchResponse;
    query?: FlightQuery;
    apiUrl?: string;
  }) => Promise<HotelSDK>;
}

export interface SearchSDK {
  sessionToken: string;
  action: string;
  status: string;
  best: FlightSDK[];
  cheapest: FlightSDK[];
  fastest: FlightSDK[];
  stats: StatsSDK;
}

export interface FlightSDK {
  itineraryId: string;
  prices: PriceSDK[];
  price: string;
  deepLink: string;
  legs: LegSDK[];
  isDirectFlights: boolean;
}

interface PriceSDK {
  price: string;
  deepLinks: DeepLinkSDK[];
}
interface DeepLinkSDK {
  link: string;
  type:
    | "AGENT_TYPE_UNSPECIFIED"
    | "AGENT_TYPE_TRAVEL_AGENT"
    | "AGENT_TYPE_AIRLINE";
  agentImageUrl: string;
  agentName: string;
}
interface StatsSDK {
  total: number;
  minPrice: string;
  hasDirectFlights: boolean;
}
interface SegmentSDK {
  id: string;
  from: string;
  to: string;
  duration: number;
  departure: string;
  arrival: string;
}

export interface CarrierSDK {
  name: string;
  imageUrl: string;
  iata: string;
  allianceId: string;
}

export interface LegSDK {
  id: string;
  from: string;
  to: string;
  duration: number;
  departure: string;
  arrival: string;
  stops: number;
  direct: boolean;
  segments: SegmentSDK[];
  fromIata: string;
  toIata: string;
  fromEntityId: number;
  toEntityId: number;
  departureTime: String;
  arrivalTime: String;
  carriers: CarrierSDK[];
}

// functions (SDK)

export const skyscanner = (): SkyscannerSDK => {
  return {
    search: (res: SkyscannerAPICreateResponse) => ({
      sessionToken: res.sessionToken,
      status: res.status,
      action: res.action,
      best: getSortingOptions(res, "best"),
      cheapest: getSortingOptions(res, "cheapest"),
      fastest: getSortingOptions(res, "fastest"),
      stats: stats(res),
    }),
    geo: (res?: SkyscannerAPIGeoResponse) => getGeoSDK(res),
    hotel: getHotelSDK,
    indicative: getIndicativeSDK,
  };
};

export const getSortingOptions = (
  res: SkyscannerAPICreateResponse,
  type: "best" | "cheapest" | "fastest"
): FlightSDK[] => {
  const bestUpdated = res.content.sortingOptions[type].map((item) => {
    const flight: Itinerary = res.content.results.itineraries[
      item.itineraryId
    ] || {
      amount: "",
      unit: "",
    };
    const legs = flight.legIds.map((legItem): LegSDK => {
      const legRef = legItem;
      const leg: Leg = res.content.results.legs[legRef];
      const segments = leg.segmentIds.map((segmentItem): SegmentSDK => {
        const segmentRef = segmentItem;
        const segment: Segment = res.content.results.segments[segmentRef];

        return {
          id: segmentRef,
          from: res.content.results.places[segment.originPlaceId].name,
          to: res.content.results.places[segment.destinationPlaceId].name,
          duration: segment.durationInMinutes,
          departure: getDateTime(
            segment.departureDateTime.day,
            segment.departureDateTime.month,
            segment.departureDateTime.year,
            segment.departureDateTime.hour,
            segment.departureDateTime.minute
          ),
          arrival: getDateTime(
            segment.arrivalDateTime.day,
            segment.arrivalDateTime.month,
            segment.arrivalDateTime.year,
            segment.arrivalDateTime.hour,
            segment.arrivalDateTime.minute
          ),
        };
      });
      const carriers = leg.operatingCarrierIds.map(
        (carrierItem): CarrierSDK => {
          const carrierRef = carrierItem;
          const carrier: Carrier = res.content.results.carriers[carrierRef];

          return {
            ...carrier,
          };
        }
      );

      return {
        id: legRef,
        from: res.content.results.places[leg.originPlaceId].name,
        to: res.content.results.places[leg.destinationPlaceId].name,
        duration: leg.durationInMinutes,
        departure: getDateTime(
          leg.departureDateTime.day,
          leg.departureDateTime.month,
          leg.departureDateTime.year,
          leg.departureDateTime.hour,
          leg.departureDateTime.minute
        ),
        arrival: getDateTime(
          leg.arrivalDateTime.day,
          leg.arrivalDateTime.month,
          leg.arrivalDateTime.year,
          leg.arrivalDateTime.hour,
          leg.arrivalDateTime.minute
        ),
        stops: leg.stopCount,
        direct: leg.stopCount === 0,
        segments: segments,
        carriers: carriers,
        fromIata: res.content.results.places[leg.originPlaceId].iata,
        toIata: res.content.results.places[leg.destinationPlaceId].iata,
        fromEntityId: Number(
          res.content.results.places[leg.originPlaceId].entityId
        ),
        toEntityId: Number(
          res.content.results.places[leg.destinationPlaceId].entityId
        ),
        departureTime: getTime(
          leg.departureDateTime.hour,
          leg.departureDateTime.minute
        ),
        arrivalTime: getTime(
          leg.arrivalDateTime.hour,
          leg.arrivalDateTime.minute
        ),
      };
    });

    return {
      itineraryId: item.itineraryId,
      prices:
        flight.pricingOptions.map((pricingOption) => {
          return {
            price: getPrice(
              pricingOption.price.amount,
              pricingOption.price.unit
            ),
            deepLinks: pricingOption.items.map((item) => {
              const agent = res.content.results.agents[item.agentId];

              return {
                link: convertDeepLink(item.deepLink),
                type: agent.type,
                agentImageUrl: agent.imageUrl,
                agentName: agent.name,
              };
            }),
          };
        }) || [],
      price:
        (flight.pricingOptions[0] &&
          getPrice(
            flight.pricingOptions[0].price.amount,
            flight.pricingOptions[0].price.unit
          )) ||
        "",
      deepLink:
        (flight.pricingOptions[0] &&
          flight.pricingOptions[0].items[0].deepLink) ||
        "",
      legs: legs,
      isDirectFlights: isDirectFlights(legs),
    };
  });

  return bestUpdated;
};

export const stats = (res: SkyscannerAPICreateResponse): StatsSDK => {
  return {
    total: res.content.stats.itineraries.total.count,
    minPrice: getPrice(
      res.content.stats.itineraries.total.minPrice.amount,
      res.content.stats.itineraries.total.minPrice.unit
    ),
    hasDirectFlights: hasDirectFlights(res),
  };
};
