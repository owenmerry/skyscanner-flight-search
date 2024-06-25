import { useState, useEffect, useCallback } from "react";
import type { FlightQuery, FlightUrl, QueryPlace } from "~/types/search";
import { format } from "date-fns";
import { Button } from "flowbite-react";

interface SkyscannerAPIHotelSearchResponse {
  meta: {
    final_status: string;
  };
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
      rating: { value: string };
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
  query?: QueryPlace;
  apiUrl?: string;
}

export const HotelList = ({
  query,
  apiUrl = "",
}: HotelListProps): JSX.Element => {
  const [search, setSearch] = useState<SkyscannerAPIHotelSearchResponse>();
  const hasResults = search && search?.results?.hotels?.length > 0;
  const numbeOfResults = search && search?.results?.hotels?.length;
  const checkIn = query && format(new Date(query?.depart), "dd MMM");
  const checkOut =
    query && query?.return && format(new Date(query?.return), "dd MMM");
  const getDistanceDisplay = (distance: number) => {
    const km = distance / 1000;
    return `${km.toFixed(1)} km`;
  };

  const handleSearch = useCallback(
    async (query: QueryPlace) => {
      try {
        const res = await fetch(
          `${apiUrl}/hotel/search?from=${query.from.entityId}&to=${query.to.entityId}&depart=${query.depart}&return=${query.return}&entityId=${query.to.entityId}`
        );
        const json: SkyscannerAPIHotelSearchResponse = await res.json();

        if (!json) {
          console.log("nothing found");
        } else {
          setSearch(json);
          if (json.meta.final_status !== "COMPLETED") {
            handleSearch(query);
          }
        }
      } catch (ex) {
        console.log("error found");
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    query && handleSearch(query);
  }, [query, handleSearch]);

  return (
    <>
      {!hasResults ? (
        ""
      ) : (
        <div className="mx-4 max-w-screen-xl xl:p-9 xl:mx-auto">
          <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
            Hotels in {query?.to.name}
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:gap-2 md:grid-cols-4">
            {search?.results.hotels
              .sort((a, b) => a.offers[0].price - b.offers[0].price)
              .slice(0, 4)
              .map((hotel) => (
                <div
                  className="rounded-lg border-2 border-slate-100 dark:border-gray-800 pt-2 overflow-hidden"
                  key={hotel.hotel_id}
                >
                  <div
                    className="h-[200px] bg-cover"
                    style={{
                      backgroundImage: `url(${hotel.images[0]?.dynamic})`,
                    }}
                  ></div>
                  <div className="p-4">
                    <h2 className="mb-4 text-xl font-bold leading-none">
                      {hotel.name}
                    </h2>
                    <div className="hotel-rating">
                      <div>
                        <b>{hotel.review_summary.score.toFixed(1)}</b>
                      </div>
                      <div className="">
                        <div className="inline-block bg-white rounded-md">
                          <img
                            style={{ height: "1rem" }}
                            src={hotel.review_summary.score_image_url.replace(
                              ".png",
                              ".svg"
                            )}
                          />
                        </div>
                      </div>
                      <div className="hotel-reviews">
                        {hotel.reviews_count.toLocaleString()} reviews
                      </div>
                    </div>
                    <div className="hotel-distance">
                      {getDistanceDisplay(hotel.distance)} from city centre
                    </div>
                  </div>

                  <div className="p-4 border-t-2 border-slate-100 dark:border-gray-800">
                    <div className="hotel-stay">
                      <div>
                        <b>
                          {checkIn} - {checkOut}
                        </b>
                      </div>
                      <div className="text-xs">1 adult, 1 room</div>
                    </div>
                    <div className="">
                      <div>
                        <b>£{hotel.offers[0].price.toLocaleString()}</b>
                        <span className="ml-2 text-xs">Total Stay</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t-2 border-slate-100 dark:border-gray-800">
                    <div className="mb-2">
                      <a
                        href={`http://${hotel.offers[0].deeplink}`}
                        target="_blank"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        View Deal
                      </a>
                    </div>
                    <div>
                      <a
                        href={`https://www.skyscanner.net/hotels/location/hotels/place/ht-${hotel.hotel_id}?checkin=${query?.depart}&checkout=${query?.return}&adults=1&rooms=1`}
                        target="_blank"
                        className="text-slate-400 text-xs hover:underline"
                      >
                        See on Skyscanner
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
