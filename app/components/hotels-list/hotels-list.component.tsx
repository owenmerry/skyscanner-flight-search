import { useState, useEffect, useCallback } from 'react';
import type { FlightQuery, FlightUrl } from '~/types/search';
import { format } from 'date-fns';

interface SkyscannerAPIHotelSearchResponse {
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
      distance: number;
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
  const [search, setSearch] = useState<SkyscannerAPIHotelSearchResponse>();
  const hasResults = search && search?.results.hotels.length > 0;
  const numbeOfResults = search && search?.results.hotels.length;
  const checkIn = query && format(new Date(query?.depart),'dd MMM');
  const checkOut = query && query?.return && format(new Date(query?.return),'dd MMM');
  const getDistanceDisplay = (distance : number) => {
    const km = distance / 1000;
     return `${km.toFixed(1)} km`;
  }

  const handleSearch = useCallback(async (query: FlightQuery) => {
    try {
      const res = await fetch(
        `${apiUrl}/hotel/search?from=${query.from}&to=${query.to}&depart=${query.depart}&return=${query.return}&entityId=${query.to}`);
      const json : SkyscannerAPIHotelSearchResponse = await res.json();

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
                  <div className='hotel-reviews'>{hotel.reviews_count.toLocaleString()} reviews</div>
                </div>
                <div className='hotel-distance'>
                  {getDistanceDisplay(hotel.distance)} from city centre
                </div>
              </div>
              <div className='hotel-details hotel-details-price'>
                <div className='hotel-stay'>
                  <div><b>{checkIn} - {checkOut}</b></div>
                  <div className='hotel-price-room'>1 adult, 1 room</div>
                </div>
                <div className='hotel-price'>
                  <div>
                    <b>£{hotel.offers[0].price.toLocaleString()}</b>
                  </div>
                  <div className='hotel-price-per'>Total Stay</div>
                </div>
              </div>
              <div className='hotel-details hotel-details-buttons'>
                <div className='hotel-buttons-button'><a className='button' href={`http://${hotel.offers[0].deeplink}`} target="_blank">View Deal</a></div>
                <div className='hotel-buttons-to-skyscanner'><a href={`https://www.skyscanner.net/hotels/location/hotels/place/ht-${hotel.hotel_id}?checkin=${query?.depart}&checkout=${query?.return}&adults=1&rooms=1`} target="_blank">View on Skyscanner</a></div>
              </div>
            </div>
          ))}
        </div>
      </div>)}
    </>
  );
};