import { useEffect, useState } from "react";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import {
  KiwiSearchResponse,
  fetchFlightsKiwi,
} from "~/helpers/services/travel-competitors";
import { QueryPlace } from "~/types/search";

export const CompetitorCheck = ({
  query,
  skyscannerSearch,
  apiUrl,
}: {
  query?: QueryPlace;
  skyscannerSearch?: SearchSDK;
  apiUrl: string;
}) => {
  const [kiwiSearch, setKiwiSearch] = useState<KiwiSearchResponse>();

  useEffect(() => {
    runKiwiSearch();
  }, []);

  const runKiwiSearch = async () => {
    if (!query) return;
    const kiwiFlights = await fetchFlightsKiwi(query, apiUrl);
    if ("error" in kiwiFlights) return;
    setKiwiSearch(kiwiFlights);
  };

  return (
    <div className="relative z-20">
      {query && skyscannerSearch && skyscannerSearch.cheapest[0] ? (
        <div className="">
          {kiwiSearch && kiwiSearch.data[0] ? (
            <div className="mb-2 p-4 text-white bg-emerald-700 rounded-md text-lg relative hover:bg-emerald-600 scale-100 hover:scale-105">
              {kiwiSearch.data[0]?.fare.adults <
              Number(skyscannerSearch.cheapest[0].price.replace("£", "")) ? (
                <div className="text-center absolute -top-2 right-2">
                  <div className="py-1 px-3 -mt-4 md:inline-block text-sm text-emerald-800 bg-emerald-100 rounded dark:bg-emerald-200 dark:text-emerald-800">
                    Cheapest
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="text-sm">Kiwi</div>
              <div className="font-bold">
                £{kiwiSearch.data[0]?.fare.adults.toFixed(2)}
              </div>
              <div>
                <a
                  className="text-xs hover:underline -mt-2"
                  target="_blank"
                  rel="noreferrer"
                  href={kiwiSearch.data[0]?.deep_link}
                >
                  (See Price)
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
          {skyscannerSearch ? (
            <div className="mb-2 p-4 text-white bg-primary-700 rounded-md text-lg relative hover:bg-primary-600 scale-100 hover:scale-105">
              {kiwiSearch &&
              skyscannerSearch.cheapest[0] &&
              kiwiSearch.data[0]?.fare.adults >
                Number(skyscannerSearch.cheapest[0]?.price.replace("£", "")) ? (
                <div className="text-center absolute -top-2 right-2">
                  <div className="py-1 px-3 -mt-4 inline-block text-sm text-primary-800 bg-primary-100 rounded dark:bg-primary-200 dark:text-primary-800">
                    Cheapest
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="text-sm">Skyscanner</div>
              <div className="font-bold">
                {skyscannerSearch.cheapest[0]?.price}
              </div>
              <div>
                <a
                  className="text-xs hover:underline -mt-2"
                  target="_blank"
                  href={skyscannerSearch.cheapest[0]?.deepLink}
                >
                  (See Price)
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
