import type { Trip } from "~/components/section/what-to-do/what-to-do-map-flight";

type DerichTripParams = {
  trip?: Trip;
};

export function derichTrip({ trip }: DerichTripParams): any {
  if (!trip) return undefined;
  return {
    ...trip,
    destinations: trip.destinations.map((destination) => ({
      ...destination,
      days: destination.days.map((day) => ({
        ...day,
        activities: (day.activities ?? []).map((activity) => ({
          ...activity,
          googlePlace: activity.googlePlace
            ? { id: activity.googlePlace.id }
            : undefined,
        })),
      })),
    })) ?? [],
  };
}