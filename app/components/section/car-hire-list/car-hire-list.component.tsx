import { useEffect, useState } from "react";
import {
  CarHireIndicativeQuery,
  CarHireSDK,
  ResultSDK,
} from "~/helpers/sdk/car-hire-indicative/car-hire-indicative-sdk";
import { SkyscannerAPICarHireIndicativeResponse } from "~/helpers/sdk/car-hire-indicative/care-hire-indicative-response";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export interface CarHireListProps {
  query: CarHireIndicativeQuery;
  apiUrl: string;
}

export const CarHireList = ({
  query,
  apiUrl,
}: CarHireListProps): JSX.Element => {
  useEffect(() => {
    getCarHireData();
  }, []);
  const [search, setSearch] = useState<CarHireSDK>();
  const hasResults = !!(search && search.results.length > 0);

  const getCarHireData = async () => {
    const carHireRes = await skyscanner().carHire({
      query,
      apiUrl,
    });
    console.log("car hire data", carHireRes);
    if ("error" in carHireRes.search) return;
    console.log("added results to search");

    setSearch(carHireRes.search);
  };

  return (
    <>
      {!hasResults ? (
        <>No Car Hire Details</>
      ) : (
        <>
          <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
            <div>
              <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
                Car Hire
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
              {search.results
                .sort((a, b) =>
                  !!(a.stats.cheapest && b.stats.cheapest)
                    ? Number(a.stats.cheapest.replace("£", "")) -
                      Number(b.stats.cheapest.replace("£", ""))
                    : 0
                )
                .map((quote) => {
                  return <CarCard key={quote.quoteId} carQuote={quote} />;
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

const CarCard = ({ carQuote }: { carQuote: ResultSDK }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a target="_blank" href={carQuote.deeplinkUrl}>
        <img
          className="p-8 rounded-t-lg"
          src={carQuote.imageUrl}
          alt="product image"
        />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
            {carQuote.vehicleType}
          </h5>
        </a>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {carQuote.prices
              .filter(
                (item) => item.aggregateType === "AGGREGATE_TYPE_CHEAPEST"
              )
              .map((price) => (
                <div key={price.price.amountDisplay}>
                  {price.price.amountDisplay}
                </div>
              ))}
          </span>
        </div>
        <div className="pt-5">
          <a
            target="_blank"
            href={carQuote.deeplinkUrl}
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            See Deal
          </a>
        </div>
      </div>
    </div>
  );
};
