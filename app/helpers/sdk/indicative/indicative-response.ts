export interface SkyscannerAPIIndicativeResponse {
  status: string;
  content?: {
    results: IndicitiveResults;
    groupingOptions: {
      byRoute: {
        quotesGroups: IndicitiveQuote[];
      };
      byDate: {
        quotesOutboundGroups: IndicitiveQuoteDate[];
        quotesInboundGroups: IndicitiveQuoteDate[];
      };
    };
  };
}

export interface IndicitiveQuote {
  originPlaceId: string;
  destinationPlaceId: string;
  quoteIds: string[];
}
export interface IndicitiveQuoteDate {
  monthYearDate: {
    day: number;
    month: number;
    year: number;
  };
  quoteIds: string[];
}
export interface IndicitiveQuoteResult {
  minPrice: {
    amount: string;
    unit: string;
    updateStatus: string;
  };
  isDirect: boolean;
  outboundLeg: {
    originPlaceId: string;
    destinationPlaceId: string;
    departureDateTime: SkyscannerDateTimeObject;
    quoteCreationTimestamp: string;
    marketingCarrierId: string;
  };
  inboundLeg: {
    originPlaceId: string;
    destinationPlaceId: string;
    departureDateTime: SkyscannerDateTimeObject;
    quoteCreationTimestamp: string;
    marketingCarrierId: string;
  };
}

export interface IndicitiveResults {
  quotes: {
    [key: string]: IndicitiveQuoteResult;
  };
  places: {
    [key: string]: {
      entityId: string;
      name: string;
      type: string;
      iata: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  carriers: {
    [key: string]: IndicitiveCarrier;
  };
}

export interface IndicitiveCarrier {
  displayCode: string;
  iata: string;
  icao: string;
  imageUrl: string;
  name: string;
}

export interface SkyscannerDateTimeObject {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
