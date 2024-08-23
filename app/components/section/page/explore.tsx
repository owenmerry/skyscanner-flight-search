import { useState } from "react";
import { Link } from "@remix-run/react";
import { type Place } from "~/helpers/sdk/place";

export const AllCountries = ({
  countries,
  showAll = false,
  onShowToggle,
}: {
  countries: Place[];
  showAll?: boolean;
  onShowToggle?: () => void;
}) => {
  const [show, setShow] = useState<boolean>(showAll);
  const [filter, setFilter] = useState<string>();
  const countriesFiltered = countries.filter(
    (country) =>
      !filter ||
      (filter && country.name.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
<div className="flex justify-center mb-4">
<svg className="w-6 h-6 text-gray-800 dark:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/>
</svg>

        </div>
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Explore by Country
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Explore all the Countries to world and find your next big adventure.
          </p>
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
          .slice(0, show ? 999 : 30)
          .map((country: Place, key: number) => {
            return (
              <div key={key}>
                <Link
                  className="hover:underline"
                  to={`/country/${country.slug}`}
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
            onClick={onShowToggle ? onShowToggle : () => setShow(!show)}
          >
            {show ? "Show Less Countries" : "Show All Countries"}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
