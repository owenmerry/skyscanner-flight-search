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

export interface Flight {
  score: number;
  itineraryId: string;
}

export interface Agent {
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

export interface Carrier {
  name: string;
  allianceId: string;
  imageUrl: string;
  iata: string;
  icao: string;
  displayCode: string;
}

export interface Itinerary {
  pricingOptions: {
    price: { amount: string; unit: string };
    items: { deepLink: string; agentId: string }[];
  }[];
  legIds: string[];
}

export interface Leg {
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

export interface Segment {
  originPlaceId: string;
  destinationPlaceId: string;
  durationInMinutes: number;
  departureDateTime: DateTime;
  arrivalDateTime: DateTime;
  marketingFlightNumber: string;
  marketingCarrierId: string;
  operatingCarrierId: string;
}

export interface Place {
  entityId: string;
  parentId: string;
  name: string;
  type: string;
  iata: string;
}

export interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
