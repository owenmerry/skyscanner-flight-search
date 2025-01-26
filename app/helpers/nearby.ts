import type { Place } from "./sdk/geo/geo-sdk";

export const getSearchLink = (from?: Place, to?: Place) : string | undefined => {
    if (!from || !to) return undefined;

    return `/search/${from.iata}/${to.iata}/2025-06-01/2025-06-10`;
  }