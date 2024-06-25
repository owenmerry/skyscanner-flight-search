export interface SkyscannerAPICarHireIndicativeResponse {
  status: string;
  content: {
    results: {
      quotes: {
        [key: string]: {
          vehicleType: string;
          seats: number;
          bags: number;
          prices: {
            aggregateType: string;
            price: {
              amount: string;
              unit: string;
              updateStatus: string;
            };
          }[];
          imageUrl: string;
          deeplinkUrl: string;
          monthOfYear: number;
          vendorId: number;
        };
      };
    };
  };
}

export interface SkyscannerAPICarHireIndicativeResponseError {
  code: number;
  message: string;
  details: string[];
}
