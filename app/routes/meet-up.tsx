import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Layout } from "~/components/ui/layout/layout";
import { Location } from "~/components/ui/location";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

interface PersonLocation {
  place?: Place;
  budget?: number;
  quotes?: IndicativeQuotesSDK[];
}

export const loader = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  return {
    apiUrl,
  };
};

export default function Meetup() {
  const {
    apiUrl,
  }: {
    apiUrl: string;
  } = useLoaderData();
  const [personLocation, setPersonLocation] = useState<PersonLocation[]>([
    {},
    {},
  ]);

  const search2 = personLocation[1]?.quotes || [];
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

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12">
          <div className="text-5xl font-bold mb-8">Meet in the middle</div>
          <div className="text-2xl font-bold mb-6">
            Select Locations ({personLocation.length})
          </div>
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

          <div className="text-2xl font-bold pb-6">
            Locations {common.length}
          </div>
          {personLocation[0].quotes?.map((quote) => {
            if (!common.includes(quote.city?.name || "")) return "";
            const quote2 = search2.find(
              (item) => item.city?.name === quote.city?.name
            );
            if (!quote2) return "";
            return (
              <div key={quote.id}>
                {quote.country.name}, {quote.city?.name}, {quote.tripDays},{" "}
                {quote.price.display}+ {quote2.price.display} ={" "}
                {quote.price.raw && quote2.price.raw
                  ? quote.price.raw + quote2.price.raw
                  : ""}
                (per person{" "}
                {quote.price.raw && quote2.price.raw
                  ? (quote.price.raw + quote2.price.raw) / 2
                  : ""}
                )
                {personLocation
                  .filter((person) => person.quotes !== undefined)
                  .map((person, index) => {
                    const quotePerson = person.quotes?.find(
                      (item) => item.city?.name === quote.city?.name
                    );
                    if (!quotePerson) return "";

                    return (
                      <div key={`${person.place?.entityId}`}>
                        <a
                          className="text-blue-600 hover:no-underline underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`/search/${quotePerson.query.from.iata}/${quotePerson.query.to.iata}/2025-0${month}-15/2025-0${month}-25`}
                        >
                          From {person.place?.name}
                        </a>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </Layout>
    </div>
  );
}
