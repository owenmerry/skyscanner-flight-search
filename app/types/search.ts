export interface FlightQuery {
    to: string;
    from: string;
    depart: string;
    return?: string;
    tripType: string;
}

export interface FlightUrl {
    to: string,
    from: string,
    depart: string,
    return?: string,
    itineraryId?: string,
}
