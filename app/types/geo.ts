export interface SkyscannerAPIIndicitiveResponse {
    status: string;
    content: {
        results: IndicitiveResults;
        groupingOptions: {
            byRoute: {
                quotesGroups: IndicitiveQuote[];
            }
        };
    }
}

export interface IndicitiveQuote {
    originPlaceId: string;
    destinationPlaceId: string;
    quoteIds: string[];
}


export interface IndicitiveResults {
    quotes: {
        [key: string]: {
            minPrice: {
                amount: string;
                unit: string;
                updateStatus: string;
            }
            isDirect: boolean;
            outboundLeg: {
                originPlaceId: string;
                destinationPlaceId: string;
                departureDateTime: {
                    year: number;
                    month: number;
                    day: number;
                    hour: number;
                    minute: number;
                    second: number;
                };
                quoteCreationTimestamp: string;
                marketingCarrierId: string;
            };
            inboundLeg: {
                originPlaceId: string;
                destinationPlaceId: string;
                departureDateTime: {
                    year: number;
                    month: number;
                    day: number;
                    hour: number;
                    minute: number;
                    second: number;
                };
                quoteCreationTimestamp: string;
                marketingCarrierId: string;
            }
        }
    };
    places: {
        [key: string]: {
            entityId: string;
            name: string;
            type: string;
            iata: string;
            coordinates: {
                latitude: number;
                longitude: number;
            }
        };
    };

}