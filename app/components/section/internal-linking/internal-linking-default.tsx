import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

interface InternalLinkingDefaultProps {
  type?: string;
}

export const InternalLinkingDefault = ({
  type,
}: InternalLinkingDefaultProps) => {
  const places = skyscanner().geo();
  const ITEMS_TO_SHOW = 100;
  const ITEMS_TO_SHOW_ROUTES_TOP = 100;
  const ITEMS_TO_SHOW_ROUTES_LEVEL1 = 100;

  const [inputValue, setInputValue] = useState<string>();
  const [filter] = useDebounce(inputValue, 100);

  const filterItems = (
    places: Place[],
    {
      filterString,
      filterBy,
      filterStringAppend,
      filterStringPrepend,
    }: {
      filterString?: string;
      filterBy?: string;
      filterStringAppend?: string;
      filterStringPrepend?: string;
    } = {}
  ) => {
    return places.filter(
      (place) =>
        !filter ||
        (filter &&
          `${filterStringAppend}${
            filterString ? filterString : place.name.toLowerCase()
          }${filterStringPrepend}`.includes(
            (filterBy ? filterBy : filter).toLowerCase()
          ))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="p-4 mx-auto max-w-screen-xl sm:p-8 lg:p-10">
        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
            Internal Links
          </h2>
        </div>
        <div className="my-4">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Search..."
          />
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8 sm:mt-16 sm:grid-cols-3 lg:grid-cols-5 sm:space-y-0">
          <div>
            <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Countries
            </h3>
            <ul className="text-gray-500 dark:text-gray-400">
              {filterItems(places.countries)
                .slice(0, ITEMS_TO_SHOW)
                .map((place) => (
                  <li className="mb-4" key={`countries.${place.entityId}`}>
                    <a
                      href={`/pages/country/${place.entityId}`}
                      className=" hover:underline"
                    >
                      {place.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Airports
            </h2>
            <ul className="text-gray-500 dark:text-gray-400">
              {filterItems(places.airports)
                .slice(0, ITEMS_TO_SHOW)
                .map((place) => (
                  <li className="mb-4" key={`airport.${place.entityId}`}>
                    <a
                      href={`/pages/airport/${place.entityId}`}
                      className=" hover:underline"
                    >
                      {place.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Cities
            </h2>
            <ul className="text-gray-500 dark:text-gray-400">
              {filterItems(places.cities)
                .slice(0, ITEMS_TO_SHOW)
                .map((place) => (
                  <li className="mb-4" key={`cities.${place.entityId}`}>
                    <a
                      href={`/pages/cities/${place.entityId}`}
                      className=" hover:underline"
                    >
                      {place.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Places
            </h2>
            <ul className="text-gray-500 dark:text-gray-400">
              {filterItems(places.places)
                .slice(0, ITEMS_TO_SHOW)
                .map((place) => (
                  <li className="mb-4" key={`places.${place.entityId}`}>
                    <a
                      href={`/pages/places/${place.entityId}`}
                      className=" hover:underline"
                    >
                      {place.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Routes
            </h2>
            <ul className="text-gray-500 dark:text-gray-400">
              {filterItems(places.places, {
                filterStringAppend: ``,
                filterBy: filter?.split(",")[0],
              })
                .slice(0, ITEMS_TO_SHOW_ROUTES_TOP)
                .map((placeTop) => (
                  <>
                    {filterItems(places.places, {
                      filterStringPrepend: ``,
                      filterBy: filter?.split(",")[1],
                    })
                      .slice(0, ITEMS_TO_SHOW_ROUTES_LEVEL1)
                      .map((placeLevel1) => {
                        return (
                          <li
                            className="mb-4"
                            key={`places.${placeTop.entityId}.${placeLevel1.entityId}`}
                          >
                            <a
                              href={`/pages/flights/${placeTop.entityId}/route/${placeLevel1.entityId}/`}
                              className=" hover:underline"
                            >
                              {placeTop.name} to {placeLevel1.name}
                            </a>
                          </li>
                        );
                      })}
                  </>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
