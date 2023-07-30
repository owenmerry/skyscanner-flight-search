import { Link } from "@remix-run/react";
import moment from "moment";
import activitiesJson from "~/data/activity-details.json";
import { getCountryEntityId } from "~/helpers/sdk/data";
import {
  Place,
  getPlaceFromEntityId,
  getPlaceFromIata,
} from "~/helpers/sdk/place";

export const ActivityLocations = ({
  name,
  from,
}: {
  name: string;
  from: Place;
}) => {
  const allActivities = activitiesJson as unknown as {
    [key: string]: {
      location_name: string;
      description: string;
      nearest_airport: string;
      best_months_to_visit: string[];
    }[];
  };
  const activites = allActivities[name];
  function nextMonth(currentDate: string, month: string) {
    var input = moment(currentDate).add(1, "M");
    var output = input.clone().startOf("month").month(month);
    return output > input ? output : output.add(1, "years");
  }

  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="text-3xl mb-6">{name} Locations</h2>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-4">
        {activites.map((location) => {
          const airport = getPlaceFromIata(location.nearest_airport);
          if (!airport) return <>no airport</>;
          const country = getPlaceFromEntityId(
            getCountryEntityId(airport.parentId)
          );
          if (!country) return <>no country</>;
          return (
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div
                style={{
                  backgroundImage: `url(${country.images[0]}&w=500)`,
                }}
                className={`h-[300px] bg-cover`}
              ></div>
              <div className="my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {location.location_name}
              </div>
              <div>{location.description}</div>
              <div className="mt-4">
                <div className="my-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Nearest Airport:
                </div>
                <div>
                  {airport.name}, {country.name} ({airport.iata})
                </div>
                <div className="mt-2">
                  <Link
                    to={`/explore/${country.slug}`}
                    className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                  >
                    Explore {country.name}{" "}
                  </Link>
                </div>
              </div>
              <div>
                <div className="my-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Best Month to travel:
                </div>
                <div>
                  {location.best_months_to_visit.map((month) => {
                    return (
                      <>
                        <Link
                          to={`/search/${from.iata}/${airport.iata}/${nextMonth(
                            moment().format("YYYY-MM-DD"),
                            moment().month(month).format("M")
                          )
                            .startOf("month")
                            .format("YYYY-MM-DD")}`}
                          className="mr-2 mb-2 md:mb-0 lg:col-span-2 justify-center md:w-auto text-slate-600 bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 inline-flex items-center"
                        >
                          {month}
                        </Link>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
