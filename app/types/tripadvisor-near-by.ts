
export interface TripadvisorNearByResponse {
  data: TripadvisorNearByData[];
}

export interface TripadvisorNearByData {
  address_obj: {
    street1?: string;
    street2?: string;
    city: string;
    state?: string;
    address_string: string;
    country: string;
    postalcode?: string;
  };
  location_id: string;
  name: string;
}