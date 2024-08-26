import type { MapMarker } from "../map-control.component";
import { GooglePlacesType } from "../types/places-types";

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

// Function to calculate Bayesian Average Rating
export const calculateBayesianAverage = ({
  rating,
  reviewCount,
  globalAverage,
  confidenceLevel,
}: {
  rating?: number;
  reviewCount?: number;
  globalAverage: number;
  confidenceLevel: number;
}): number => {
  // If reviewCount is undefined, treat it as 0
  const count = reviewCount ?? 0;

  // If the rating is undefined, return the global average
  if (rating === undefined) {
    return globalAverage;
  }

  // Calculate Bayesian average
  return (
    (rating * count + globalAverage * confidenceLevel) /
    (count + confidenceLevel)
  );
};

export const calculateGlobalAverage = (
  places: google.maps.places.PlaceResult[]
): number => {
  const totalRating = places.reduce(
    (sum, place) => sum + (place.rating || 0),
    0
  );
  const totalPlacesWithRating = places.filter(
    (place) => place.rating !== undefined
  ).length;

  // Avoid division by zero
  if (totalPlacesWithRating === 0) {
    return 0;
  }

  return totalRating / totalPlacesWithRating;
};

export const sortPlacesByDynamicTrustworthiness = (
  places: google.maps.places.PlaceResult[]
): google.maps.places.PlaceResult[] => {
  const globalAverage = calculateGlobalAverage(places);

  // Define the confidence level (C)
  const confidenceLevel = 20;

  // Calculate Bayesian average for each place and add it to the place object
  const ratedList: { rating: number; place: google.maps.places.PlaceResult }[] =
    places.map((place) => ({
      rating: calculateBayesianAverage({
        rating: place.rating,
        reviewCount: place.user_ratings_total,
        globalAverage,
        confidenceLevel
    }),
      place,
    }));

  // Sort places by Bayesian average rating, descending
  ratedList.sort((a, b) => b.rating! - a.rating!);

  const placesSorted = ratedList.map(place => place.place)

  return placesSorted;
};

export const sortPlacesByBayesianAverage = (
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
  keyword = "things to do",
}: {
  map: google.maps.Map;
  location: google.maps.LatLngLiteral;
  radius?: number;
  type?: GooglePlacesType;
  keyword?: string;
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
        keyword,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          //resolve(results);
          const sortedPlaces = sortPlacesByDynamicTrustworthiness(results);
          //const sortedPlaces = sortPlacesByBayesianAverage(results);
          resolve(sortedPlaces);
        }
      }
    );
  });
};

export const getMarkersFromPlaces = ({
  places,
  icon
}: {
  places: google.maps.places.PlaceResult[];
  icon: string;
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
        ${icon}
        <div class='font-semibold text-xs'>${place.rating}</div>
        </div>
        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-pink-700 "></div>
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
