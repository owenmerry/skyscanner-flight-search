import type { LegSDK } from "~/helpers/sdk/flight/flight-functions";
import { getDateFormated } from "~/helpers/date";
import type { Query, QueryPlace, QueryPlaceString } from "~/types/search";
import type { SkyscannerAPICreateResponse } from "./flight/flight-response";
import { getPlaceFromIata } from "./place";

export const isDirectFlights = (legs: LegSDK[]): boolean => {
  return legs.filter((leg) => !!leg.direct).length === legs.length;
};
export const hasDirectFlights = (res: SkyscannerAPICreateResponse): boolean => {
  return !!(res.content.stats.itineraries.stops.direct.total.count > 0);
};
export const getDefualtFlightQuery = (): Query => {
  return {
    from: "95565050",
    fromIata: "LHR",
    fromText: "London Heathrow",
    to: "95673529", //Dublin
    toIata: "DUB", //Dublin
    toText: "Dublin", //Dublin
    depart: getDateFormated(1),
    return: getDateFormated(3),
    tripType: "return",
  };
};

export const getQueryPlaceFromQuery = (
  query: QueryPlaceString
): QueryPlace | undefined => {
  const fromPlace = getPlaceFromIata(query.from);
  const toPlace = getPlaceFromIata(query.to);
  if (!fromPlace || !toPlace) return;
  return {
    ...query,
    from: fromPlace,
    to: toPlace,
  };
};

export const getQueryFromQueryPlace = (
  query: QueryPlace
): Query => {
  return {
    from: query.from.entityId,
    fromIata: query.from.iata,
    fromText: query.from.name,
    to: query.to.entityId,
    toIata: query.to.iata,
    toText: query.to.name,
    depart: query.depart,
    return: query.return,
    tripType: query.return ? 'return' : 'single',
  };
};
