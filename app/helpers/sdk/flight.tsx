import type { LegSDK } from "~/helpers/sdk/flight/flight-functions";
import { getDateFormated } from "~/helpers/date";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { Query, QueryPlace, QueryPlaceString } from "~/types/search";
import { SkyscannerAPICreateResponse } from "./flight/flight-response";
import { getPlaceFromEntityId, getPlaceFromIata } from "./place";

export const isDirectFlights = (legs: LegSDK[]): boolean => {
  return legs.filter((leg) => !!leg.direct).length === legs.length;
};
export const hasDirectFlights = (res: SkyscannerAPICreateResponse): boolean => {
  return !!(res.content.stats.itineraries.stops.direct.total.count > 0);
};
export const getDefualtFlightQuery = (): Query => {
  const fromPlace = getFromPlaceLocalOrDefault();
  return {
    from: fromPlace ? fromPlace.entityId : "95565050",
    fromIata: fromPlace ? fromPlace.iata : "LHR",
    fromText: fromPlace ? fromPlace.name : "London Heathrow",
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
