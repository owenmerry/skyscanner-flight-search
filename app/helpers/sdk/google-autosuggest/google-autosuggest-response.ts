export interface GoogleAutosuggestResponse {
  suggestions: PlacePrediction[];
}

export interface PlacePrediction {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
      matches: {
        endOffset: number;
      }[];
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: {
          endOffset: number;
        }[];
      };
      secondaryText?: {
        text: string;
      };
    };
    types: string[];
  };
}
