import { useEffect, useState } from "react";
import type {
  CarHireIndicativeQuery,
  CarHireSDK,
  ResultSDK,
} from "~/helpers/sdk/car-hire-indicative/car-hire-indicative-sdk";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export interface CarHireDealProps {
  query: CarHireIndicativeQuery;
  apiUrl: string;
}

export const CarHireDeal = ({
  query,
  apiUrl,
}: CarHireDealProps): JSX.Element => {
  useEffect(() => {
    getCarHireData();
  }, []);
  const [search, setSearch] = useState<CarHireSDK>();
  const [searchType, setSearchType] = useState<"month" | "day">(
    query.groupType || "month"
  );
  const hasResults = !!(search && search.results.length > 0);

  const getCarHireData = async () => {
    const carHireRes = await skyscanner().carHire({
      query: {
        ...query,
        groupType: searchType,
      },
      apiUrl,
    });
    if ("error" in carHireRes.search) return;

    setSearch(carHireRes.search);
  };

  const handleChangeType = async (type: "month" | "day") => {
    if (type === searchType) return;
    setSearchType(() => type);
    const carHireRes = await skyscanner().carHire({
      query: {
        ...query,
        groupType: type,
      },
      apiUrl,
    });
    if ("error" in carHireRes.search) return;

    setSearch(carHireRes.search);
  };

  return (
    <>
      {!hasResults ? (
        <></>
      ) : (
        <>
          <div className="py-2">
            <div>
              <h2 className="text-left mb-6 text-lg font-bold tracking-tight leading-none text-gray-800 dark:text-white">
                or rent a car
              </h2>
            </div>

            <div className="flex overflow-y-scroll scrollbar-hide gap-2 grid-cols-2">
              {search.results
                .sort((a, b) =>
                  a.stats.cheapest && b.stats.cheapest
                    ? Number(a.stats.cheapest.replace("£", "")) -
                      Number(b.stats.cheapest.replace("£", ""))
                    : 0
                )
                .splice(0, 1)
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
    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a target="_blank" href={carQuote.deeplinkUrl}>
        <img
          className="p-8 rounded-t-lg"
          src={carQuote.imageUrl}
          width={200}
          alt="car hire product"
        />
      </a>
      <div className="p-4">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
            {carQuote.vehicleTypeDisplay}
          </h5>
        </a>
        <div className="">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
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
          <span className="font-bold">a day</span>
        </div>
        <div className="pt-5">
          <a
            rel="noreferrer"
            target="_blank"
            href={carQuote.deeplinkUrl}
            className="text-nowrap text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            See Deal
          </a>
        </div>
      </div>
    </div>
  );
};
