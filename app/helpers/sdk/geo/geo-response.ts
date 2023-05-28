export interface SkyscannerAPIGeoResponse {
    status: string;
    places: {
        [key: string]: {
            entityId: string;
            parentId: string;
            name: string;
            type: 'PLACE_TYPE_COUNTRY' | 'PLACE_TYPE_CITY' | 'PLACE_TYPE_AIRPORT',
            iata: string;
            coordinates: {
                latitude: number;
                longitude: number;
            }
        }[];
    }
}

export interface Geo {
    entityId: string;
    parentId: string;
    name: string;
    type: string;
    iata: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    images?: string[];
    slug?: string;
}