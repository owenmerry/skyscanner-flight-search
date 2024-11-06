import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { getPlaceChildren, type Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

interface MarketingPlacesProps {
  place?: Place;
  from: Place;
  url?: string;
  search: IndicativeQuotesSDK[];
}
export const MarketingPlaces = ({
  place,
  url,
  search,
}: MarketingPlacesProps) => {
  const childrenPlaces = place
    ? getPlaceChildren(place)
    : skyscanner().geo().continent;
  const childrenPlacesPrices = childrenPlaces.map((item) => {
    const getPlacePrice = (child: Place) => {
      const firseQuote = search?.filter((item) =>
        item.parentsString.includes(child.entityId)
      );
      if (!firseQuote || !firseQuote[0]) return;

      return firseQuote[0].price;
    };

    return {
      place: item,
      price: getPlacePrice(item),
    };
  });

  return (
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center lg:py-16">
      <div className="flex justify-center mb-4">
        <svg
          className="w-6 h-6 text-gray-800 dark:text-blue-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
          />
        </svg>
      </div>
      <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Popular places {place ? `in ${place.name}` : `to Explore`}
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        Checkout all the places in {place ? place.name : ""} that you can
        discover flights and things to do.
      </p>
      <div className="relative my-8">
        <div className="bg-gradient-to-l from-slate-900 to-transparent absolute bottom-0 right-0 w-[20px] h-[100%] z-20 sm:hidden"></div>
        <div className="flex overflow-y-scroll scrollbar-hide sm:grid sm:grid-cols-3 gap-4">
          {childrenPlacesPrices
            .sort((a, b) => {
              // Handle cases where the price is undefined
              if (!a.price) return 1; // Move undefined prices to the end
              if (!b.price) return -1;

              // Convert the amount strings to numbers
              const priceA = parseFloat(a.price.amount);
              const priceB = parseFloat(b.price.amount);

              // Sort in ascending order
              return priceA - priceB;
            })
            .map((childPlace) => {
              return (
                <div
                  key={childPlace.place.entityId}
                  className="min-w-72 sm:min-w-0 bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800  hover:dark:border-gray-500"
                >
                  <a
                    href={url ? `${url}${childPlace.place.slug}` : ""}
                    className="flex items-center "
                  >
                    {childPlace.place.images[0] ? (
                      <div
                        className="flex-1 rounded-t-lg h-32 md:rounded-none md:rounded-s-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${childPlace.place.images[0]}&w=250)`,
                        }}
                      ></div>
                    ) : (
                      ""
                    )}
                    <div className="flex-1 flex flex-col justify-between p-4 leading-normal">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                        {childPlace.place.name}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {/* {getPlaceType(childPlace.place)}{" "} */}
                        {childPlace.price?.display ? (
                          <>
                            {childPlace.price?.display}
                            <svg
                              className="w-4 h-4 text-gray-500 rotate-90 ml-1 inline-block"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"
                              />
                            </svg>
                          </>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          <div className="w-[20px] sm:hidden"></div>
        </div>
      </div>
    </div>
  );
};
