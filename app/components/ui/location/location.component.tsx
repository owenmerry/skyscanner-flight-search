import { useEffect, useState } from "react";
import { useOutsideClick } from "~/helpers/hooks/outsideClickHook";

import { searchAutoSuggest } from "~/helpers/sdk/autosuggest";
import type { Place } from "~/helpers/sdk/autosuggest";

interface LocationProps {
  name?: string;
  apiUrl?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string, iataCode: string) => void;
}

export const Location = ({
  name = "location",
  apiUrl = "",
  defaultValue,
  onChange,
  onSelect,
}: LocationProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [searchOrigin, setSearchOrigin] = useState<Place[]>([]);
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const refAutoSuggest = useOutsideClick(() => {
    setShowAutoSuggest(false);
  });

  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange && onChange(e.target.value);
    const originResults = await searchAutoSuggest(e.target.value, apiUrl);
    const originResultsFiltered = originResults.filter(
      (suggest) => suggest.iataCode
    );
    setSearchOrigin(originResultsFiltered);
    setShowAutoSuggest(true);
  };

  const handleSelect = async (
    placeId: string,
    geoId: string,
    iataCode: string
  ) => {
    setSearchTerm(placeId);
    setSearchOrigin([]);
    setShowAutoSuggest(false);
    onChange && onChange(geoId);
    onSelect && onSelect(geoId, iataCode);
  };

  const handleInputClick = () => {
    setShowAutoSuggest(true);
  };

  return (
    <div>
      <label htmlFor="location-form" className="sr-only">
        From
      </label>
      <div onClick={handleInputClick} className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          value={searchTerm}
          type="text"
          onChange={(e) => handleSearch(e)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="From"
        />
      </div>
      {showAutoSuggest && searchOrigin.length > 0 && (
        <div ref={refAutoSuggest} className="relative z-20">
          <ul className="bg-white border border-gray-100 w-full mt-2 absolute dark:bg-gray-800 dark:border-gray-600">
            {searchOrigin.map((place, key) => (
              <li
                key={place.entityId}
                onClick={() =>
                  handleSelect(
                    place.name,
                    place.entityId,
                    place?.iataCode || ""
                  )
                }
                className="grid grid-cols-2 content-center flex-auto p-4 border-b-2 border-gray-100 relative cursor-pointer hover:bg-slate-100  dark:hover:bg-gray-900 dark:border-gray-600"
              >
                <div className="text-left">
                  <div>
                    {place.name}
                    {place.cityId !== "" && <> ({place.iataCode})</>}
                  </div>
                  <div className="text-xs">{place.countryName}</div>
                </div>
                <div className="text-right text-xs self-center">
                  {place.type === "PLACE_TYPE_AIRPORT" ? "Airport" : ""}
                  {place.type === "PLACE_TYPE_CITY" ? "City" : ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
