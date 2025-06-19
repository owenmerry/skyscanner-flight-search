import type { PlaceGoogle } from "~/components/section/map/map-planner";
import type { Trip } from "~/components/section/what-to-do/what-to-do-map-flight";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

type EnrichTripParams = {
  trip: Trip;
  apiUrl: string;
};

export async function enrichTrip({
  trip,
  apiUrl,
}: EnrichTripParams): Promise<Trip> {

  const enrichedTripDestinations = await Promise.all(
    trip.destinations.map(async (destination) => {
      const enrichedDays = await Promise.all(
        (destination.days ?? []).map(async (day) => {
          const enrichedActivities = await Promise.all(
            (day.activities ?? []).map(async (activity) => {
              const placeGoogle = await skyscanner().services.google.details({
                apiUrl,
                placeId: activity?.googlePlace?.id || "",
              });

              if ("error" in placeGoogle) {
                return activity; // Return original if failed
              }

              const googlePlace: PlaceGoogle = {
                id: placeGoogle.id,
                name: placeGoogle.displayName.text,
                types: placeGoogle.types,
                images: placeGoogle.photos?.map((photo) => photo.name) || [],
                location: placeGoogle.location,
              };

              return {
                ...activity,
                googlePlace,
              };
            })
          );

          return {
            ...day,
            activities: enrichedActivities,
          };
        })
      );

      return {
        ...destination,
        days: enrichedDays,
      };
    })
  );

  return {
    ...trip,
    destinations: enrichedTripDestinations,
  };
}
