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
      stars: string;
      images: {
        thumbnail?: string;
        dynamic: string;
      }[];
      offers: {
        price: number;
        deeplink: string;
      }[];
      rating: { value: string; }
      reviews_count: number;
      review_summary: {
        score: number;
        score_desc: string;
        score_image_url: string;
      };
      total_images: number;
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
              <div className="hotel-image" style={{backgroundImage: `url(${hotel.images[0]?.dynamic})` }}></div>
              <div className='hotel-details hotel-title'>
              <h2>{hotel.name}</h2>
              <div className='hotel-rating'>
                <div><b>{hotel.review_summary.score.toFixed(1)}</b></div>
                <div><img style={{height: '1rem'}} src={hotel.review_summary.score_image_url.replace('.png', '.svg')} /></div>
                <div>{hotel.reviews_count.toLocaleString()}</div>
              </div>

              </div>
              <div className='hotel-details hotel-price'>
              <div>
                <b>£{hotel.offers[0].price.toLocaleString()}</b> Total Stay
                <div><a className='button' href={`http://${hotel.offers[0].deeplink}`} target="_blank">View Deal</a></div>
                <div><a href={`https://www.skyscanner.net/hotels/location/hotels/place/ht-${hotel.hotel_id}?checkin=${query?.depart}&checkout=${query?.return}&adults=1&rooms=1`} target="_blank">View on Skyscanner</a></div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>)}
    </>
  );
};
