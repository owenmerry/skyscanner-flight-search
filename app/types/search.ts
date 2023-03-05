export interface FlightQuery {
    from: string;
    to: string;
    depart: string;
    return?: string;
    tripType: string;
}

export interface FlightCheckQuery {
    from: string;
    to: string;
}

export interface FlightUrl {
    from: string,
    to: string,
    depart: string,
    return?: string,
    itineraryId?: string,
}
