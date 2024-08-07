//geo
import type { SkyscannerAPIGeoResponse } from "./geo/geo-response";
import type { GeoSDK } from "./geo/geo-sdk";
import { getGeoSDK } from "./geo/geo-sdk";
//hotels
import type { SkyscannerAPIHotelSearchResponse } from "./hotel/hotel-response";
import type { HotelSDK } from "./hotel/hotel-sdk";
import { getHotelSDK } from "./hotel/hotel-sdk";
import { FlightQuery, FlightQueryIndicative } from "~/types/search";
//indicative
import type { SkyscannerAPIIndicativeResponse } from "./indicative/indicative-response";
import type { IndicativeSDK } from "./indicative/indicative-sdk";
import { getIndicativeSDK } from "./indicative/indicative-sdk";
//content
import type { SkyscannerAPIContentPageResponse } from "./content/content-response";
import { ContentSDK, getContentSDK } from "./content/content-sdk";
import { getFlightSDK } from "./flight/flight-sdk";
import { FlightSDK } from "./flight/flight-sdk";
import {
  CarHireIndicativeQuery,
  CarHireIndicativeSDK,
  getCarHireIndicativeSDK,
} from "./car-hire-indicative/car-hire-indicative-sdk";
import { SkyscannerAPICarHireIndicativeResponse } from "./car-hire-indicative/care-hire-indicative-response";

// types (Response)

//types (SDK)
export interface SkyscannerSDK {
  flight: () => FlightSDK;
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
    query?: FlightQueryIndicative;
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
  content: ({
    res,
    slug,
    apiUrl,
  }: {
    res?: SkyscannerAPIContentPageResponse;
    slug?: string;
    apiUrl?: string;
  }) => Promise<ContentSDK>;
  carHire: ({
    query,
    apiUrl,
  }: {
    res?: SkyscannerAPICarHireIndicativeResponse;
    query?: CarHireIndicativeQuery;
    apiUrl?: string;
  }) => Promise<CarHireIndicativeSDK>;
}

// functions (SDK)

export const skyscanner = (): SkyscannerSDK => {
  return {
    flight: getFlightSDK,
    geo: (res?: SkyscannerAPIGeoResponse) => getGeoSDK(res),
    hotel: getHotelSDK,
    indicative: getIndicativeSDK,
    content: getContentSDK,
    carHire: getCarHireIndicativeSDK,
  };
};
