import type { SkyscannerAPICreateResponse, LegSDK } from '~/helpers/sdk/skyscannerSDK';

export const isDirectFlights = (legs: LegSDK[]): boolean => {
    return legs.filter(leg => !!(leg.direct)).length === legs.length;
}
export const hasDirectFlights = (res: SkyscannerAPICreateResponse): boolean => {
    return !!(res.content.stats.itineraries.stops.direct.total.count > 0);
}