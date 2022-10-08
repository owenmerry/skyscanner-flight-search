import { useState } from 'react';

import { searchAutoSuggest } from '~/helpers/sdk/autosuggest';
import type { Place } from '~/helpers/sdk/autosuggest';

interface LocationProps {
  name?: string;
  apiUrl?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const Location = ({
  name = 'location',
  apiUrl = '',
  defaultValue,
  onChange,
}: LocationProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [searchOrigin, setSearchOrigin] = useState<Place[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange && onChange(e.target.value);
    const originResults = await searchAutoSuggest(e.target.value, apiUrl);

    setSearchOrigin(originResults);
  };

  const handleSelect = async (placeId: string, geoId: string) => {
    setSearchTerm(placeId);
    setSearchOrigin([]);
    onChange && onChange(geoId);
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
            {searchOrigin.map((place) => (
              <div
                key={place.placeId}
                onClick={() => handleSelect(place.name, place.entityId)}
              >
                {place.name}{' '}
                {place.cityId !== '' && (
                  <>
                    {place.name} ({place.iataCode}) - <i>{place.countryName}</i>
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
