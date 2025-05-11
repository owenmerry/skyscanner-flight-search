import { useEffect, useState } from "react";
import { useOutsideClick } from "~/helpers/hooks/outsideClickHook";

import { searchAutoSuggest } from "~/helpers/sdk/autosuggest";
import type { Place as PlaceAutosuggest } from "~/helpers/sdk/autosuggest";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";

interface LocationProps {
  name?: string;
  apiUrl?: string;
  defaultValue?: string;
  clearOnSelect?: boolean;
  onChange?: (value: string) => void;
  onSelect?: (value: string, iataCode: string, place: Place) => void;
  types?: ("PLACE_TYPE_CITY" | "PLACE_TYPE_AIRPORT" | "PLACE_TYPE_COUNTRY")[];
  vertical?: "flights" | "hotels";
}

export const Location = ({
  name = "location",
  apiUrl = "",
  defaultValue,
  clearOnSelect = false,
  onChange,
  onSelect,
  types,
  vertical,
}: LocationProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [searchOrigin, setSearchOrigin] = useState<PlaceAutosuggest[]>([]);
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
    const originResults = await searchAutoSuggest(e.target.value, apiUrl, {
      type: types,
      vertical,
    });
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
    const place = await getPlaceFromEntityId(geoId);
    if (!place) return;
    setSearchTerm(placeId);
    setSearchOrigin([]);
    setShowAutoSuggest(false);
    onChange && onChange(geoId);
    onSelect && onSelect(geoId, iataCode, place);
    if (clearOnSelect) setSearchTerm("");
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
            className="w-5 h-5 text-slate-500 dark:text-slate-400"
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
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-semibold"
          placeholder={name || "From"}
        />
      </div>
      {showAutoSuggest && searchOrigin.length > 0 && (
        <div ref={refAutoSuggest} className="relative z-50">
          <ul className="bg-white border border-slate-100 w-full mt-2 absolute dark:bg-slate-800 dark:border-slate-600">
            {searchOrigin.map((place, key) => (
              <li
                key={place.entityId}
                onClick={() =>
                  handleSelect(
                    place.airportInformation
                      ? place.airportInformation.name
                      : place.name,
                    place.airportInformation
                      ? place.airportInformation.entityId
                      : place.entityId,
                    place.airportInformation
                      ? place.airportInformation.iataCode || ""
                      : place?.iataCode || ""
                  )
                }
                className="grid grid-cols-2 gap-2 content-center flex-auto p-4 border-b-2 border-slate-100 relative cursor-pointer hover:bg-slate-100  dark:hover:bg-slate-900 dark:border-slate-600"
              >
                <div className="text-left break-words">
                  <div>
                    {place.airportInformation ? (
                      <>
                        {place.airportInformation.name}
                        {place.airportInformation.cityId !== "" && (
                          <> ({place.airportInformation.iataCode})</>
                        )}
                      </>
                    ) : (
                      <>
                        {place.name}
                        {place.cityId !== "" && <> ({place.iataCode})</>}
                      </>
                    )}
                  </div>
                  <div className="text-xs">
                    {place.airportInformation
                      ? place.airportInformation.countryId
                      : place.countryName}
                  </div>
                </div>
                {place.airportInformation ? (
                  <div className="text-right text-xs self-center">
                    {place.airportInformation.distance.value.toFixed(0)}
                    {place.airportInformation.distance.unitCode === "mile"
                      ? " miles"
                      : " km"}{" "}
                    <span>
                      from <span className="font-bold">{place.name}</span>
                    </span>
                  </div>
                ) : (
                  <div className="text-right text-xs self-center">
                    {place.type === "PLACE_TYPE_AIRPORT" ? "Airport" : ""}
                    {place.type === "PLACE_TYPE_CITY" ? "City" : ""}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
