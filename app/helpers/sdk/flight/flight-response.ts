export interface SkyscannerAPIFlightSearchResponse {
  meta: {
    final_status: string;
    total: number;
  };
  results: {
    hotels: {
      hotel_id: string;
      name: string;
      city_name: string;
      property_type: string;
      stars: string;
      images: {
        thumbnail?: string;
        dynamic: string;
      }[];
      offers: {
        price: number;
        deeplink: string;
      }[];
      rating: { value: string };
      reviews_count: number;
      review_summary: {
        score: number;
        score_desc: string;
        score_image_url: string;
      };
      total_images: number;
      distance: number;
    }[];
    average_min_price: number;
  };
}
