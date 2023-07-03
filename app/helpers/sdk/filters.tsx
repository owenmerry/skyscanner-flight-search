import { FlightSDK } from "~/helpers/sdk/skyscannerSDK";

export interface SearchFilters {
  numberOfResultsToShow?: number;
  numberOfStops?: number[];
  agentTypes?: (
    | "AGENT_TYPE_TRAVEL_AGENT"
    | "AGENT_TYPE_AIRLINE"
    | "AGENT_TYPE_UNSPECIFIED"
  )[];
  mashup?: boolean;
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
