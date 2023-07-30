import { useState } from "react";
import { Link } from "react-router-dom";
import activitiesJson from "~/data/activity-details.json";

export const AllActivities = () => {
  const [showAll, setShowAll] = useState(false);
  const allActivities = activitiesJson as unknown as {
    [key: string]: {
      images: string[];
      locations: {
        location_name: string;
        description: string;
        nearest_airport: string;
        best_months_to_visit: string[];
      }[];
    };
  };
  const activites = Object.keys(allActivities);
  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="text-3xl mb-6">Activities</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
        {activites
          .slice(0, showAll ? 99999 : 30)
          .map((activityKey: string, key: number) => {
            const activity = allActivities[activityKey];
            return (
              <div className="">
                <Link
                  className="hover:underline"
                  to={`/activity/${activityKey}`}
                >
                  <div
                    style={{
                      backgroundImage: `url(${activity.images[0]}&w=250)`,
                    }}
                    className={`h-[120px] bg-cover`}
                  ></div>
                  <div>{activityKey}</div>
                </Link>
              </div>
            );
          })}
      </div>
      {activites.length >= 30 ? (
        <div className="text-center mt-4">
          <div
            className="inline-block justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less Activties" : "Show All Activties"}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
