import { useState } from 'react';

import { searchAutoSuggest } from '~/helpers/sdk/autosuggest';
import type { Place } from '~/helpers/sdk/autosuggest';

interface LocationProps {
  name?: string;
  apiUrl?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string, iataCode: string) => void;
}

export const Location = ({
  name = 'location',
  apiUrl = '',
  defaultValue,
  onChange,
  onSelect,
}: LocationProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [searchOrigin, setSearchOrigin] = useState<Place[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange && onChange(e.target.value);
    const originResults = await searchAutoSuggest(e.target.value, apiUrl);

    setSearchOrigin(originResults);
  };

  const handleSelect = async (placeId: string, geoId: string, iataCode: string) => {
    setSearchTerm(placeId);
    setSearchOrigin([]);
    onChange && onChange(geoId);
    onSelect && onSelect(geoId, iataCode);
  };

  return (
    <div>
      <div>
        {name}: <br />
        <input
          value={searchTerm}
          type="text"
          onChange={(e) => handleSearch(e)}
        />
        {searchOrigin.length > 0 && (
          <div>
            Results for :
            {searchOrigin.map((place,key) => (
              <div
                key={place.entityId}
                onClick={() => handleSelect(place.name, place.entityId, place.iataCode)}
              >
                {place.name}{' '}
                {place.cityId !== '' && (
                  <>
                    ({place.iataCode}) - <i>{place.countryName}</i>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
