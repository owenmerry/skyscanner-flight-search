//geo
import type { SkyscannerAPIGeoResponse } from "./geo/geo-response";
import type { GeoAllSDK, GeoSDK } from "./geo/geo-sdk";
import { getGeoAllSDK, getGeoSDK } from "./geo/geo-sdk";
//hotels
import type { SkyscannerAPIHotelSearchResponse } from "./hotel/hotel-response";
import type { HotelSDK } from "./hotel/hotel-sdk";
import { getHotelSDK } from "./hotel/hotel-sdk";
import type {
  FlightQuery,
  FlightQueryIndicative,
  QueryPlace,
} from "~/types/search";
//indicative
import type { SkyscannerAPIIndicativeResponse } from "./indicative/indicative-response";
import type { IndicativeSDK } from "./indicative/indicative-sdk";
import { getIndicativeSDK } from "./indicative/indicative-sdk";
//content
import type { SkyscannerAPIContentPageResponse } from "./content/content-response";
import { getContentSDK } from "./content/content-sdk";
import type { ContentSDK } from "./content/content-sdk";
import { getFlightSDK } from "./flight/flight-sdk";
import type { FlightSDK } from "./flight/flight-sdk";
import type {
  CarHireIndicativeQuery,
  CarHireIndicativeSDK,
} from "./car-hire-indicative/car-hire-indicative-sdk";
import { getCarHireIndicativeSDK } from "./car-hire-indicative/car-hire-indicative-sdk";
import type { SkyscannerAPICarHireIndicativeResponse } from "./car-hire-indicative/care-hire-indicative-response";
import { getGoogleAutosuggestSDK } from "./google-autosuggest/google-autosuggest-sdk";
import type { GoogleAutosuggestSDK } from "./google-autosuggest/google-autosuggest-sdk";
import type { GoogleDetailsSDK } from "./google-details/google-details-sdk";
import { getGoogleDetailsSDK } from "./google-details/google-details-sdk";
import type { FlightHistorySDK } from "./flight-history/flight-history-sdk";
import { getFlightHistorySDK } from "./flight-history/flight-history-sdk";
import { getGoogleRouteSDK } from "./google-route/google-route-sdk";
import type {
  GoogleRouteProps,
  GoogleRouteSDK,
} from "./google-route/google-route-sdk";
import type {
  TripDetailsProps,
  TripDetailsSDK,
} from "./trip-details/trip-details-sdk";
import { getTripDetailsSDK } from "./trip-details/trip-details-sdk";

// types (Response)

//types (SDK)
export interface SkyscannerSDK {
  flight: () => FlightSDK;
  geo: (res?: SkyscannerAPIGeoResponse) => GeoSDK;
  geoAll: (res?: SkyscannerAPIGeoResponse) => GeoAllSDK;
  indicative: ({
    res,
    query,
    apiUrl,
    month,
    year,
    endMonth,
    endYear,
    groupType,
  }: {
    res?: SkyscannerAPIIndicativeResponse;
    query?: FlightQueryIndicative;
    apiUrl?: string;
    month?: number;
    year?: number;
    endMonth?: number;
    endYear?: number;
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
  flightHistory: ({
    query,
    apiUrl,
  }: {
    query: QueryPlace;
    apiUrl: string;
  }) => Promise<FlightHistorySDK>;
  content: ({
    res,
    slug,
    apiUrl,
    preview,
  }: {
    res?: SkyscannerAPIContentPageResponse;
    slug?: string;
    apiUrl?: string;
    preview?: boolean;
  }) => Promise<ContentSDK>;
  carHire: ({
    query,
    apiUrl,
  }: {
    res?: SkyscannerAPICarHireIndicativeResponse;
    query?: CarHireIndicativeQuery;
    apiUrl?: string;
  }) => Promise<CarHireIndicativeSDK>;
  tripDetails: (props: TripDetailsProps) => TripDetailsSDK;
  services: {
    google: {
      autosuggest: ({
        search,
        latitude,
        longitude,
        radius,
      }: {
        apiUrl: string;
        search: string;
        latitude?: number;
        longitude?: number;
        radius?: number;
      }) => Promise<GoogleAutosuggestSDK>;
      details: ({
        placeId,
      }: {
        apiUrl: string;
        placeId: string;
      }) => Promise<GoogleDetailsSDK>;
      route: (props: GoogleRouteProps) => Promise<GoogleRouteSDK>;
    };
  };
}

// functions (SDK)

export const skyscanner = (): SkyscannerSDK => {
  return {
    flight: getFlightSDK,
    flightHistory: getFlightHistorySDK,
    geo: (res?: SkyscannerAPIGeoResponse) => getGeoSDK(res),
    geoAll: (res?: SkyscannerAPIGeoResponse) => getGeoAllSDK(),
    hotel: getHotelSDK,
    indicative: getIndicativeSDK,
    content: getContentSDK,
    carHire: getCarHireIndicativeSDK,
    tripDetails: getTripDetailsSDK,
    services: {
      google: {
        autosuggest: getGoogleAutosuggestSDK,
        details: getGoogleDetailsSDK,
        route: getGoogleRouteSDK,
      },
    },
  };
};
