interface SkyscannerAPIAutoSuggestResponse {
  places: SkyscannerPlace[];
}

export interface SkyscannerPlace {
  cityId: string;
  cityName: string;
  cityNameEn: string;
  countryId: string;
  countryName: string;
  geoContainerId: string;
  entityId: string;
  highlighting: number[][];
  iataCode?: string;
  localizedPlaceName: string;
  location: string;
  placeId: string;
  parentId: string;
  name: string;
  placeNameEn: string;
  regionId: string;
  resultingPhrase: string;
  untransliteratedResultingPhrase: string;
  type: "PLACE_TYPE_AIRPORT" | "PLACE_TYPE_CITY";
  airportInformation: {
    iataCode: string;
    name: string;
    countryId: string;
    cityId: string;
    entityId: string;
    parentId: string;
    distance: {
      value: number;
      unitCode: "mile";
    };
    location: string;
  };
}

export const searchAutoSuggest = async (
  searchTerm: string,
  apiUrl: string,
  {
    type,
    vertical,
  }: {
    type?: ("PLACE_TYPE_CITY" | "PLACE_TYPE_AIRPORT" | "PLACE_TYPE_COUNTRY")[];
    vertical?: "flights" | "hotels";
  } = {}
) => {
  if (searchTerm === "") return [];
  const res = await fetch(
    `${apiUrl}/autosuggest/${vertical || "flights"}/${searchTerm}${
      type ? `?type=${type.join(",")}` : ""
    }`
  );
  const json: SkyscannerAPIAutoSuggestResponse = await res.json();

  return json.places;
};
