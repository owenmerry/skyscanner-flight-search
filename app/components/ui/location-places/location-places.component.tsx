import { useEffect, useState } from "react";
import { PlaceGoogle } from "~/components/section/map/map-planner";
import { useOutsideClick } from "~/helpers/hooks/outsideClickHook";

import { searchAutoSuggest } from "~/helpers/sdk/autosuggest";
import type { Place as PlaceAutosuggest } from "~/helpers/sdk/autosuggest";
import {
  GoogleAutosuggestResponse,
  PlacePrediction,
  Prediction,
} from "~/helpers/sdk/google-autosuggest/google-autosuggest-response";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

interface LocationProps {
  name?: string;
  apiUrl?: string;
  defaultValue?: string;
  clearOnSelect?: boolean;
  place?: Place;
  onChange?: (value: string) => void;
  onSelect?: ({ placeGoogle }: { placeGoogle: PlaceGoogle }) => void;
}

export const LocationPlaces = ({
  name = "location",
  apiUrl = "",
  defaultValue,
  clearOnSelect = false,
  onChange,
  onSelect,
  place,
}: LocationProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const refAutoSuggest = useOutsideClick(() => {
    setShowAutoSuggest(false);
  });

  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    const locationBias = place
      ? {
          latitude: place.coordinates.latitude,
          longitude: place.coordinates.longitude,
          radius: 500,
        }
      : undefined;
    const autosuggest = await skyscanner().services.google.autosuggest({
      apiUrl,
      search: inputValue,
      ...locationBias,
    });
    if ("error" in autosuggest) return;
    onChange && onChange(e.target.value);
    setPredictions(autosuggest.suggestions);
    setShowAutoSuggest(true);
  };

  const handleSelect = async (selected: string) => {
    console.log(selected);
    const details = await skyscanner().services.google.details({
      placeId: selected,
      apiUrl,
    });
    if (!details || "error" in details) return;
    console.log(details);

    // const place = await getPlaceFromEntityId(geoId);
    // if (!place) return;
    setSearchTerm('');
    // setSearchOrigin([]);
    // setShowAutoSuggest(false);
    // onChange && onChange(geoId);
    onSelect &&
      onSelect({
        placeGoogle: {
          id: details.id,
          name: details.displayName.text,
          images: details.photos.map((image) => image.name),
          location: details.location,
          types: details.types,
        },
      });
    // if (clearOnSelect) setSearchTerm("");
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
      {showAutoSuggest && predictions.length > 0 && (
        <div ref={refAutoSuggest} className="relative z-50">
          <ul className="bg-white border border-slate-100 w-full mt-2 absolute dark:bg-slate-800 dark:border-slate-600">
            {predictions.map((prediction) => (
              <li
                key={prediction.placePrediction.placeId}
                onClick={() => handleSelect(prediction.placePrediction.placeId)}
                className="grid grid-cols-2 content-center flex-auto p-4 border-b-2 border-slate-100 relative cursor-pointer hover:bg-slate-100  dark:hover:bg-slate-900 dark:border-slate-600"
              >
                <div className="text-left">
                  <div>
                    {prediction.placePrediction.text.text.split(",")[0]}
                  </div>
                  <div className="text-xs truncate">
                    {
                      prediction.placePrediction.structuredFormat.secondaryText
                        ?.text
                    }
                  </div>
                </div>
                <div className="text-right text-xs self-center">
                  {prediction.placePrediction.types[0]}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
