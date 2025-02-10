import { useLoaderData } from "@remix-run/react";
import { result } from "lodash";
import moment from "moment";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { MeetUpLocation } from "~/components/section/meet-up/meet-up-location";
import { MeetUpMap } from "~/components/section/meet-up/meet-up-map";
import { DateSelector } from "~/components/ui/date/date-selector";
import { Layout } from "~/components/ui/layout/layout";
import { Location } from "~/components/ui/location";
import { getFullPrice } from "~/helpers/meetup";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export interface PersonLocation {
  place?: Place;
  budget?: number;
  quotes?: IndicativeQuotesSDK[];
}
export interface MeetupFilters {
  limitResults: number;
}

export const loader = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
  };
};

export default function Meetup() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
  } = useLoaderData();
  const [personLocation, setPersonLocation] = useState<PersonLocation[]>([
    {},
    {},
  ]);
  const [dates, setDates] = useState<DatesQuery>({
    depart: moment().add(3, "months").format("YYYY-MM-DD"),
    return: moment().add(7, "days").add(3, "months").format("YYYY-MM-DD"),
  });
  const [filters, setFilters] = useState<MeetupFilters>({
    limitResults: 20,
  });
  const month = 5;

  function findCommonElements(...arrays: string[][]): string[] {
    if (arrays.length === 0) return [];

    // Start with the first array converted to a Set
    let commonElements = new Set(arrays[0]);

    // Intersect the common elements with each subsequent array
    for (let i = 1; i < arrays.length; i++) {
      commonElements = new Set(
        arrays[i].filter((item) => commonElements.has(item))
      );
    }

    return Array.from(commonElements);
  }

  const cityNamesArray = personLocation
    .filter((person) => person.quotes !== undefined)
    .map((person) =>
      person.quotes ? person.quotes.map((item) => item.city?.name || "") : []
    );

  const common = findCommonElements(...cityNamesArray);
  const orderDeals =
    personLocation[0].quotes?.map((quote) => ({
      quote,
      fullPrice: getFullPrice(personLocation, quote.city?.name),
    })) || [];
  const sortedDeals = orderDeals
    .sort((a, b) => a.fullPrice - b.fullPrice)
    .filter((item) => common.includes(item.quote.city?.name || ""))
    .slice(0, filters.limitResults);

  const getFlightPrices = async (
    from: Place,
    month: number = 5
  ): Promise<IndicativeQuotesSDK[]> => {
    const location = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: "anywhere",
        tripType: "return",
      },
      month,
      year: 2025,
      endMonth: month,
      endYear: 2025,
    });

    return location.quotes;
  };

  const runPrices = async () => {
    let locations: PersonLocation[] = [];
    for (let i = 0; i < personLocation.length; i++) {
      const person = personLocation[i];
      if (!person.place) {
        locations.push(person);
        continue;
      }
      const prices = await getFlightPrices(person.place);
      if (!prices) {
        locations.push(person);
        continue;
      }
      if (prices) {
        locations.push({
          place: person.place,
          quotes: prices,
        });
      }
    }

    setPersonLocation(locations);
  };

  const handleAddPersonLocation = (place: Place, index: number) => {
    const newPersonLocation = personLocation;
    newPersonLocation[index] = { place };
    setPersonLocation(newPersonLocation);
  };

  const addLocation = () => {
    setPersonLocation([...personLocation, {}]);
  };

  const removeLocation = (index: number) => {
    setPersonLocation((prevLocations) =>
      prevLocations.filter((_, i) => i !== index)
    );
  };

  const handleDatesChange = (dates: DatesQuery) => {
    setDates({
      depart: dates.depart,
      return: dates.return,
    });
  };

  const handleFiltersChange = (updateFilters: Partial<MeetupFilters>) => {
    setFilters({
      ...filters,
      ...updateFilters,
    });
  };

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12">
          <div className="text-5xl font-bold mb-8">Meet in the middle</div>
          <div className="text-2xl font-bold mb-6">Select Locations</div>
          <div className="flex flex-col md:flex-row gap-1">
            {personLocation.map((person, index) => {
              return (
                <div key={index} className="mr-4 flex items-center">
                  <Location
                    apiUrl={apiUrl}
                    onSelect={(value, iata, place) =>
                      handleAddPersonLocation(place, index)
                    }
                  />
                  {personLocation.length > 2 ? (
                    <div
                      className="text-gray-400 cursor-pointer hover:text-gray-300 p-2"
                      onClick={() => removeLocation(index)}
                    >
                      <FaRegTrashCan />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
            {personLocation.length < 4 ? (
              <div>
                <div
                  onClick={addLocation}
                  className="cursor-pointer justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
                >
                  Add Location
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mt-6 cursor-pointer">
            <div
              onClick={runPrices}
              className="justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
            >
              Search
            </div>
          </div>

          {sortedDeals.length > 0 ? (
            <>
              <div className="text-2xl font-bold my-6">Locations</div>
              <div className="mb-8">
                <MeetUpMap
                  googleApiKey={googleApiKey}
                  googleMapId={googleMapId}
                  places={sortedDeals.map((item) => ({
                    place: item.quote.to,
                    fullPrice: item.fullPrice,
                  }))}
                />
              </div>
              <div className="my-8">
                <div className="text-2xl font-bold mb-6">Select Dates</div>
                <div className="md:w-1/2">
                  <DateSelector
                    query={dates}
                    onDateChange={handleDatesChange}
                  />
                </div>
              </div>
              <div className="my-8">
                <div className="text-2xl font-bold mb-6">Filters</div>
                <div className="md:w-1/2">
                  <div>Limit Results:</div>
                  <input
                    className="text-left bg-gray-50 border border-grey-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-semibold"
                    type="number"
                    value={filters.limitResults}
                    onChange={(e) =>
                      handleFiltersChange({
                        limitResults:
                          Number(e.currentTarget.value) <= 0
                            ? 1
                            : Number(e.currentTarget.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                {sortedDeals.map((location, key) => {
                  if (!common.includes(location.quote.city?.name || ""))
                    return "";
                  return (
                    <div key={location.quote.id}>
                      <MeetUpLocation
                        quote={location.quote}
                        key={key}
                        locations={personLocation}
                        month={month}
                        apiUrl={apiUrl}
                        dates={dates}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </Layout>
    </div>
  );
}
