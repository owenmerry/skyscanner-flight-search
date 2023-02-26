import { useState, useEffect, useCallback } from 'react';
import type { FlightQuery, FlightUrl } from '~/types/search';

interface HotelsResponse {
  meta: {
    final_status: string;
  },
  results: {
    hotels: {
      hotel_id: string;
      name: string;
      city_name: string;
      property_type: string;
      rating: { value: string; }
      stars: string;
      images: {
        thumbnail?: string;
      }[];
      offers: {
        price: number;
        deeplink: string;
      }[];
    }[];
  };
}

interface HotelListProps {
  query?: FlightQuery;
  apiUrl?: string;
  url?: FlightUrl;
}

export const HotelList = ({
  query,
  apiUrl = '',
  url,
}: HotelListProps): JSX.Element => {
  const [search, setSearch] = useState<HotelsResponse>();
  const hasResults = search && search?.results.hotels.length > 0;
  const numbeOfResults = search && search?.results.hotels.length;

  const handleSearch = useCallback(async (query: FlightQuery) => {
    try {
      const res = await fetch(
        `${apiUrl}/hotel/search?from=${query.from}&to=${query.to}&depart=${query.depart}&return=${query.return}&entityId=${query.to}`);
      const json : HotelsResponse = await res.json();

      if (!json) {
      } else {
        setSearch(json);
        if(json.meta.final_status !== "COMPLETED") {
          handleSearch(query);
        }
      }
    } catch (ex) {
    }
  }, [apiUrl]);

  useEffect(() => {
    query && handleSearch(query);
  }, [query, handleSearch]);

  return (
    <>
    {!hasResults ? '' : (
      <div className="hotels">
        <h2>Hotels ({numbeOfResults} Results)</h2>
        <div className="hotels-results">
          {search?.results.hotels.sort((a,b) => a.offers[0].price - b.offers[0].price).map((hotel) => (
            <div className='hotel' key={hotel.hotel_id}>
              <img src={hotel.images[0]?.thumbnail} />
              <h2>{hotel.name}</h2>
              <div>Prices: 
                <b>£{hotel.offers[0].price}</b>
              </div>
              <div><a className='button' href={`http://${hotel.offers[0].deeplink}`} target="_blank">View Deal</a></div>
              <div><a href={`https://www.skyscanner.net/hotels/location/hotels/place/ht-${hotel.hotel_id}?checkin=${query?.depart}&checkout=${query?.return}&adults=1&rooms=1`} target="_blank">View on Skyscanner</a></div>
            </div>
          ))}
        </div>
      </div>)}
    </>
  );
};
