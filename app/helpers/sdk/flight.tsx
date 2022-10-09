import { getPrice } from './price';
import { getDateTime, getTime } from './dateTime';
import { convertDeepLink } from './link';

// types (Response)

interface SkyscannerAPICreateResponse {
  sessionToken: string;
  status: string;
  content: {
    results: {
      agents: { [key: string]: Agent };
      itineraries: { [key: string]: Itinerary };
      legs: { [key: string]: Leg };
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
    | 'AGENT_TYPE_UNSPECIFIED'
    | 'AGENT_TYPE_TRAVEL_AGENT'
    | 'AGENT_TYPE_AIRLINE';
  ratingBreakdown: {
    customerService: number;
    reliablePrices: number;
    clearExtraFees: number;
    easeOfBooking: number;
    other: number;
  };
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
  search: () => SearchSDK;
}

export interface SearchSDK {
  sessionToken: string;
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
}

interface PriceSDK {
  price: string;
  deepLinks: DeepLinkSDK[];
}
interface DeepLinkSDK {
  link: string;
  type:
    | 'AGENT_TYPE_UNSPECIFIED'
    | 'AGENT_TYPE_TRAVEL_AGENT'
    | 'AGENT_TYPE_AIRLINE';
  agentImageUrl: string;
  agentName: string;
}
interface StatsSDK {
  total: number;
  minPrice: string;
}
interface SegmentSDK {
  id: string;
  from: string;
  to: string;
  duration: number;
  departure: string;
  arrival: string;
}

interface LegSDK {
  id: string;
  from: string;
  to: string;
  duration: number;
  departure: string;
  arrival: string;
  stops: number;
  segments: SegmentSDK[];
  fromIata: string;
  toIata: string;
  departureTime: String;
  arrivalTime: String;
}

// functions (SDK)

export const skyscanner = (res: SkyscannerAPICreateResponse): SkyscannerSDK => {
  return {
    search: () => ({
      sessionToken: res.sessionToken,
      status: res.status,
      best: getSortingOptions(res, 'best'),
      cheapest: getSortingOptions(res, 'cheapest'),
      fastest: getSortingOptions(res, 'fastest'),
      stats: stats(res),
    }),
  };
};

export const getSortingOptions = (
  res: SkyscannerAPICreateResponse,
  type: 'best' | 'cheapest' | 'fastest',
): FlightSDK[] => {
  const bestUpdated = res.content.sortingOptions[type].map((item) => {
    const flight: Itinerary = res.content.results.itineraries[
      item.itineraryId
    ] || {
      amount: '',
      unit: '',
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
            segment.departureDateTime.minute,
          ),
          arrival: getDateTime(
            segment.arrivalDateTime.day,
            segment.arrivalDateTime.month,
            segment.arrivalDateTime.year,
            segment.arrivalDateTime.hour,
            segment.arrivalDateTime.minute,
          ),
        };
      });

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
          leg.departureDateTime.minute,
        ),
        arrival: getDateTime(
          leg.arrivalDateTime.day,
          leg.arrivalDateTime.month,
          leg.arrivalDateTime.year,
          leg.arrivalDateTime.hour,
          leg.arrivalDateTime.minute,
        ),
        stops: leg.stopCount,
        segments: segments,
        fromIata: res.content.results.places[leg.originPlaceId].iata,
        toIata: res.content.results.places[leg.destinationPlaceId].iata,
        departureTime: getTime(
          leg.departureDateTime.hour,
          leg.departureDateTime.minute,
        ),
        arrivalTime: getTime(
          leg.arrivalDateTime.hour,
          leg.arrivalDateTime.minute,
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
              pricingOption.price.unit,
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
            flight.pricingOptions[0].price.unit,
          )) ||
        '',
      deepLink:
        (flight.pricingOptions[0] &&
          flight.pricingOptions[0].items[0].deepLink) ||
        '',
      legs: legs,
    };
  });

  return bestUpdated;
};

export const stats = (res: SkyscannerAPICreateResponse): StatsSDK => {
  return {
    total: res.content.stats.itineraries.total.count,
    minPrice: getPrice(
      res.content.stats.itineraries.total.minPrice.amount,
      res.content.stats.itineraries.total.minPrice.unit,
    ),
  };
};
