import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { getPlaceChildren, type Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

interface MarketingPlacesProps {
  place?: Place;
  from: Place;
  url: string;
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
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Popular places {place ? `in ${place.name}` : `to Explore`}
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        We are strategists, designers and developers. Innovators and problem
        solvers. Small enough to be simple and quick, but big enough to deliver
        the scope you want at the pace you need.
      </p>
      <div className="flex overflow-y-scroll scrollbar-hide m-6 sm:grid sm:grid-cols-3 gap-4">
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
              <div key={childPlace.place.entityId} className="min-w-72">
                <a
                  href={`${url}${childPlace.place.slug}`}
                  className="grid grid-cols-2 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <img
                    className="object-cover w-full rounded-t-lg h-32 md:rounded-none md:rounded-s-lg"
                    src={
                      childPlace.place.images[0]
                        ? `${childPlace.place.images[0]}&h=250`
                        : "/images/places/map-dark.png"
                    }
                    alt=""
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                      {childPlace.place.name}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {/* {getPlaceType(childPlace.place)}{" "} */}
                      {childPlace.price?.display
                        ? `${childPlace.price?.display}`
                        : ""}
                    </p>
                  </div>
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
};
