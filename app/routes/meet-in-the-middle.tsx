import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
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

export default function SearchFlight() {
  const {
    apiUrl,
  }: {
    apiUrl: string;
  } = useLoaderData();
  const [personLocation, setPersonLocation] = useState<PersonLocation[]>([]);

  const search = personLocation[0]?.quotes || [];
  const search2 = personLocation[1]?.quotes || [];
  const month = 5;

  function findCommonElements(arr1: string[], arr2: string[]): string[] {
    const set1 = new Set(arr1);
    return arr2.filter((item) => set1.has(item));
  }

  const common = findCommonElements(
    search.map((item) => item.city?.name || ""),
    search2.map((item) => item.city?.name || "")
  );

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
      if (!person.place) continue;
      const prices = await getFlightPrices(person.place);
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

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12">
          <div className="text-5xl font-bold mb-8">Meet in the middle</div>
          <div className="text-2xl font-bold mb-6">
            Select Locations ({personLocation.length})
          </div>
          <div className="flex flex-row">
            {personLocation.map((person, index) => {
              return (
                <div key={index} className="mr-4">
                  <Location
                    apiUrl={apiUrl}
                    onSelect={(value, iata, place) =>
                      handleAddPersonLocation(place, index)
                    }
                  />
                </div>
              );
            })}
          </div>
          {personLocation.length < 5 ? (
            <div onClick={addLocation} className="cursor-pointer">
              Add Location
            </div>
          ) : (
            ""
          )}
          <div onClick={runPrices} className="cursor-pointer">
            Run Prices
          </div>
          {/* <div className="text-2xl font-bold">From {from.name}</div>
          {search?.map((quote) => {
            return (
              <div key={quote.id}>
                {quote.country.name}, {quote.city?.name}, {quote.tripDays},{" "}
                {quote.price.display}
              </div>
            );
          })}
          <div className="text-2xl font-bold mt-6">From {from2.name}</div>
          {search2?.map((quote) => {
            return (
              <div key={quote.id}>
                {quote.country.name}, {quote.city?.name}, {quote.tripDays},{" "}
                {quote.price.display}
              </div>
            );
          })} */}

          <div className="text-2xl font-bold pb-6">
            Locations {common.length}
          </div>
          {search?.map((quote) => {
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
                <a
                  className="text-blue-600 hover:no-underline underline m-2"
                  target="_blank"
                  rel="noreferrer"
                  href={`/search/${quote.query.from.iata}/${quote.query.to.iata}/2025-0${month}-15/2025-0${month}-25`}
                >
                  From {personLocation[0].place?.name}
                </a>
                <a
                  className="text-blue-600 hover:no-underline underline"
                  target="_blank"
                  rel="noreferrer"
                  href={`/search/${quote2.query.from.iata}/${quote2.query.to.iata}/2025-0${month}-15/2025-0${month}-25`}
                >
                  From {personLocation[1].place?.name}
                </a>
              </div>
            );
          })}
        </div>
      </Layout>
    </div>
  );
}
