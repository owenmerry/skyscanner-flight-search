import { useState } from "react";
import { Link } from "@remix-run/react";
import { type Place } from "~/helpers/sdk/place";

export const AllCountries = ({
  countries,
  showAll,
  onShowToggle,
}: {
  countries: Place[];
  showAll: boolean;
  onShowToggle: () => void;
}) => {
  const [filter, setFilter] = useState<string>();
  const countriesFiltered = countries.filter(
    (country) =>
      !filter ||
      (filter && country.name.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
          Search By Country
        </h2>
      </div>
      <div className="my-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Search Country..."
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
        {countriesFiltered
          .slice(0, showAll ? 999 : 30)
          .map((country: Place, key: number) => {
            return (
              <div key={key}>
                <Link
                  className="hover:underline"
                  to={`/explore/${country.slug}`}
                >
                  <div
                    style={{
                      backgroundImage: `url(${country.images[0]}&w=250)`,
                    }}
                    className={`h-[120px] bg-cover`}
                  ></div>
                  <div>{country.name}</div>
                </Link>
              </div>
            );
          })}
      </div>
      {countriesFiltered.length >= 30 ? (
        <div className="text-center mt-4">
          <div
            className="inline-block justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer"
            onClick={onShowToggle}
          >
            {showAll ? "Show Less Countries" : "Show All Countries"}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
