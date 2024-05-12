import { toHoursAndMinutes } from "./dateTime";
import { FlightSDK } from "./flight/flight-functions";

export interface SearchFilters {
  numberOfResultsToShow?: number;
  numberOfStops?: number[];
  agentTypes?: (
    | "AGENT_TYPE_TRAVEL_AGENT"
    | "AGENT_TYPE_AIRLINE"
    | "AGENT_TYPE_UNSPECIFIED"
  )[];
  mashup?: boolean;
  outboundTime?: { min: number; max: number };
  returnTime?: { min: number; max: number };
  duration?: number;
}

export const filterNumberOfResultsToShow = (
  flights: FlightSDK[],
  numberToShow: number
) => {
  return flights.slice(0, numberToShow);
};

export const filterNumberOfStops = (flights: FlightSDK[], stops: number[]) => {
  return flights.filter(
    (flight) =>
      flight.legs.filter((leg) => stops.includes(leg.stops)).length ===
      flight.legs.length
  );
};

export const filterMashups = (flights: FlightSDK[], mashup: boolean) => {
  return flights.filter(
    (flight) =>
      flight.prices.filter((price) => price.deepLinks.length > 1).length > 0
  );
};

export const filterOutbound = (
  flights: FlightSDK[],
  time: { min: number; max: number }
) => {
  return flights.filter(
    (flight) =>
      Number(flight.legs[0].departureTime.split(":")[0]) >= time.min &&
      Number(flight.legs[0].departureTime.split(":")[0]) <= time.max
  );
};
export const filterReturn = (
  flights: FlightSDK[],
  time: { min: number; max: number }
) => {
  return flights.filter((flight) =>
    flight.legs[1]
      ? Number(flight.legs[1].departureTime.split(":")[0]) >= time.min &&
        Number(flight.legs[1].departureTime.split(":")[0]) <= time.max
      : true
  );
};

export const filterDuration = (flights: FlightSDK[], duration: number) => {
  return flights.filter((flight) =>
    flight.legs.filter(
      (leg) => toHoursAndMinutes(leg.duration).hours <= duration
    ).length === 0
      ? false
      : true
  );
};

export const filterAgentTypes = (
  flights: FlightSDK[],
  agentTypes: (
    | "AGENT_TYPE_TRAVEL_AGENT"
    | "AGENT_TYPE_AIRLINE"
    | "AGENT_TYPE_UNSPECIFIED"
  )[]
) => {
  return flights.filter(
    (flight) =>
      flight.prices.filter(
        (price) =>
          price.deepLinks.filter((link) => agentTypes.includes(link.type))
            .length > 0
      ).length > 0
  );
};

export const addSearchResultFilters = (
  flights: FlightSDK[],
  {
    numberOfResultsToShow = 10,
    numberOfStops = [],
    agentTypes = [],
    mashup,
    outboundTime,
    returnTime,
    duration,
  }: SearchFilters
) => {
  let flightsFiltered = flights;

  // number of stops
  if (numberOfStops.length > 0) {
    flightsFiltered = filterNumberOfStops(flightsFiltered, numberOfStops);
  }

  // agent types
  if (agentTypes.length > 0) {
    flightsFiltered = filterAgentTypes(flightsFiltered, agentTypes);
  }

  // mashups
  if (mashup) {
    flightsFiltered = filterMashups(flightsFiltered, mashup);
  }

  // mashups
  if (mashup) {
    flightsFiltered = filterMashups(flightsFiltered, mashup);
  }

  // outbound time
  if (outboundTime) {
    flightsFiltered = filterOutbound(flightsFiltered, outboundTime);
  }

  // return time
  if (returnTime) {
    flightsFiltered = filterReturn(flightsFiltered, returnTime);
  }

  // duration
  if (duration) {
    flightsFiltered = filterDuration(flightsFiltered, duration);
  }

  // numbeResultsToShow
  const flightsTotal = flightsFiltered.length;
  flightsFiltered = filterNumberOfResultsToShow(
    flightsFiltered,
    numberOfResultsToShow
  );

  return {
    results: flightsFiltered,
    total: flightsTotal,
  };
};
