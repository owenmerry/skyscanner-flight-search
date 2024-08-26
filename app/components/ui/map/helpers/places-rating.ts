import type { MapMarker } from "../map-control.component";

export const calculateDynamicThreshold = (
  places: google.maps.places.PlaceResult[]
): number => {
  const reviewCounts = places
    .map((place) => place.user_ratings_total || 0)
    .filter((count) => count > 0); // Filter out places with undefined or 0 reviews

  if (reviewCounts.length === 0) {
    return 0; // If no valid reviews, return 0 to include all
  }

  reviewCounts.sort((a, b) => a - b);

  const median = reviewCounts[Math.floor(reviewCounts.length / 2)];
  const average = reviewCounts.reduce((a, b) => a + b, 0) / reviewCounts.length;
  const percentile25 = reviewCounts[Math.floor(reviewCounts.length * 0.25)];

  const dynamicThreshold = Math.min(median, average, percentile25);
  return dynamicThreshold;
};

export const sortPlacesByDynamicTrustworthiness = (
  places: google.maps.places.PlaceResult[]
): google.maps.places.PlaceResult[] => {
  const threshold = calculateDynamicThreshold(places);

  // Filter and sort based on the dynamically calculated threshold
  const filteredPlaces = places.filter(
    (place) => (place.user_ratings_total || 0) >= threshold
  );
  const sortedPlaces = filteredPlaces.sort((a, b) => {
    // Primary sort by the number of reviews, handling undefined
    const reviewsA = a.user_ratings_total || 0;
    const reviewsB = b.user_ratings_total || 0;

    if (reviewsB !== reviewsA) {
      return reviewsB - reviewsA;
    }

    // Secondary sort by rating, handling undefined
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;

    return ratingB - ratingA;
  });

  return sortedPlaces;
};

export const getGooglePlaces = async ({
  map,
  location,
  radius = 5000, // 5 kilometers
  type = "tourist_attraction",
}: {
  map: google.maps.Map;
  location: google.maps.LatLngLiteral;
  radius?: number;
  type?: string;
}): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise(async (resolve, reject) => {
    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    // Create a Places service instance
    var service = new PlacesService(map);

    // Perform a nearby search for tourist attractions
    service.nearbySearch(
      {
        location: location,
        radius,
        type,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const sortedPlaces = sortPlacesByDynamicTrustworthiness(results);
          resolve(sortedPlaces);
        }
      }
    );
  });
};

export const getAttractionMarkersFromPlaces = ({
  places,
}: {
  places: google.maps.places.PlaceResult[]
}): MapMarker[] => {
  const markers: MapMarker[] = [];
  let count = 0;
  for (const place of places) {
    if (place.geometry?.location) {
      count++;
      markers.push({
        label: `
        <div class="relative bg-pink-700 p-2 rounded-lg ">
        <div class=" text-white text-sm">
        <svg class="w-4 h-4 text-gray-800 dark:text-white inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8M4 9.5v-.955a1 1 0 0 1 .458-.84l7-4.52a1 1 0 0 1 1.084 0l7 4.52a1 1 0 0 1 .458.84V9.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5Z"/>
        </svg>
        <div class='font-bold'>${count} - ${place.name}</div>
        <div class='font-semibold text-xs'>Rating: ${place.rating}</div>
        </div>
        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-pink-700 "></div>
        </div>
        `,
        location: {
          lat: place.geometry?.location.lat(),
          lng: place.geometry?.location.lng(),
        },
      });
    }
  }

  return markers;
};
