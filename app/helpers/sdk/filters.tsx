import { FlightSDK } from '~/helpers/sdk/flightSDK';

export interface SearchFilters {
    numberOfResultsToShow?: number;
    numberOfStops?: number[];
}

export const filterNumberOfResultsToShow = (flights: FlightSDK[], numberToShow: number) => {

    return flights.slice(0, numberToShow);
}

export const filterNumberOfStops = (flights: FlightSDK[], stops: number[]) => {

    return flights.filter((flight) => flight.legs.filter(leg => stops.includes(leg.stops)).length === flight.legs.length);
}

export const addSearchResultFilters = (flights: FlightSDK[],
    {
        numberOfResultsToShow = 10,
        numberOfStops = [],
    }: SearchFilters) => {
    let flightsFiltered = flights;

    // number of stops
    console.log(numberOfStops);
    if (numberOfStops.length > 0) {
        flightsFiltered = filterNumberOfStops(flightsFiltered, numberOfStops)
    }

    // numbeResultsToShow
    const flightsTotal = flightsFiltered.length;
    flightsFiltered = filterNumberOfResultsToShow(flightsFiltered, numberOfResultsToShow);


    return {
        results: flightsFiltered,
        total: flightsTotal,
    };
}