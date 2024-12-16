import { redirect } from "@remix-run/node";
import moment from "moment";
import type { Moment } from "moment";
import type { QueryPlace } from "~/types/search";
import { getTripDays } from "./date";

/**
 * Handles outdated dates in a URL for a flights website.
 * @param urlDate - The date string from the URL in 'YYYY-MM-DD' format.
 * @param route - The base route for the flights (e.g., "/flights").
 * @returns A Remix Response object if a redirect is required, or `null` if no action is needed.
 */
export function handleOutdatedDate(query: QueryPlace): Response | null {
  // Parse the date from the URL
  const parsedDate: Moment = moment(query.depart); // strict parsing
  const today: Moment = moment();
  const redirectSettings = { status: 301 };

  // Validate if the date format is correct
  // if (!parsedDate.isValid()) {
  //   // Redirect to a generic route search page if the date format is invalid
  //   return redirect(
  //     `/search/${query.from.iata}/${query.to.iata}?redirect=past-date`,
  //     redirectSettings
  //   );
  // }

  // Check if the date is in the past
  if (parsedDate.isBefore(today, "day")) {
    // Redirect to the same route with today's date
    const updatedDepartDate: Moment = today.add(1, "week");
    const updatedDepartDateString: string =
      updatedDepartDate.format("YYYY-MM-DD");

    if (!query.return) {
      return redirect(
        `/search/${query.from.iata}/${query.to.iata}/${updatedDepartDateString}?message=past-date`,
        redirectSettings
      );
    }

    const updatedReturnDate: Moment = updatedDepartDate.add(
      getTripDays(query.depart, query.return) - 1,
      "days"
    );
    const updatedReturnDateString: string =
      updatedReturnDate.format("YYYY-MM-DD");

    return redirect(
      `/search/${query.from.iata}/${query.to.iata}/${updatedDepartDateString}/${updatedReturnDateString}?message=past-date`,
      redirectSettings
    );
  }

  // If the date is valid and not outdated, no redirect is required
  return null;
}
