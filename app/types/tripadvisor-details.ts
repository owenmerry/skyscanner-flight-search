export interface TripadvisorDetailsData {
  location_id: string;
  name: string;
  description: string;
  web_url: string;
  address_obj: {
    street1: string;
    street2: string;
    city: string;
    country: string;
    postalcode: string;
    address_string: string;
  };
  ancestors: {
    level: string;
    name: string;
    location_id: string;
    abbrv?: string;
  }[];
  latitude: string;
  longitude: string;
  timezone: string;
  email: string;
  phone: string;
  website: string;
  write_review: string;
  ranking_data: {
    geo_location_id: string;
    ranking_string: string;
    geo_location_name: string;
    ranking_out_of: string;
    ranking: string;
  };
  rating: string;
  rating_image_url: string;
  num_reviews: string;
  review_rating_count: {
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
  };
  photo_count: string;
  see_all_photos: string;
  hours: {
    periods: {
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }[];
    weekday_text: string[];
  };
  category: {
    name: string;
    localized_name: string;
  };
  subcategory: {
    name: string;
    localized_name: string;
  }[];
  groups: {
    name: string;
    localized_name: string;
    categories: {
      name: string;
      localized_name: string;
    }[];
  }[];
  neighborhood_info: any[];
  trip_types: {
    name: string;
    localized_name: string;
    value: string;
  }[];
  awards: {
    award_type: string;
    year: string;
    images: {
      tiny: string;
      small: string;
      large: string;
    };
    categories: any[];
    display_name: string;
  }[];
}
