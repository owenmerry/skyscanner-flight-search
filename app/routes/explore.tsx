import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import geoData from "~/data/geo.json";
import geoDataImages from "~/data/geo-images.json";
import { Layout } from "~/components/ui/layout/layout";
import { getPlaceFromIata, type Place } from "~/helpers/sdk/place";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersWorld } from "~/helpers/map";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import {
  IndicitiveQuote,
  SkyscannerAPIIndicativeResponse,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { getPrice } from "~/helpers/sdk/price";

const ExploreEverywhere = ({
  search,
}: {
  search?: SkyscannerAPIIndicativeResponse;
}) => {
  const sortByPrice = (quoteGroups: IndicitiveQuote[]) => {
    const sorted = quoteGroups.sort(function (a, b) {
      const quoteA: any = search?.content.results.quotes[a.quoteIds[0]];
      const quoteB: any = search?.content.results.quotes[b.quoteIds[0]];

      return quoteA.minPrice.amount - quoteB.minPrice.amount;
    });

    return sorted;
  };

  return (
    <>
      {search ? (
        <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div>
            <h2 className="text-3xl mb-6">Explore Eveywhere</h2>
          </div>
          {sortByPrice(search.content.groupingOptions.byRoute.quotesGroups).map(
            (quoteKey) => {
              const quote = search.content.results.quotes[quoteKey.quoteIds[0]];
              const destinationPlace = getPlaceFromEntityId(
                quote.inboundLeg.originPlaceId
              );
              const getLink = () => {
                return `/explore/`;
              };
              if (!destinationPlace)
                return <>{`not found:${quote.inboundLeg.originPlaceId}`}</>;

              return (
                <a
                  className="bg-slate-50 font-semibold mr-2 px-2.5 py-0.5 rounded dark:hover:bg-gray-700 dark:bg-gray-800 text-slate-400"
                  href={getLink()}
                >
                  {destinationPlace.name} for{" "}
                  {getPrice(quote.minPrice.amount, quote.minPrice.unit)}
                </a>
              );
            }
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
const AllCountries = ({
  countries,
  showAll,
  onShowToggle,
}: {
  countries: Place[];
  showAll: boolean;
  onShowToggle: () => void;
}) => {
  return (
    <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="text-3xl mb-6">Countries</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-5 grid-cols-2">
        {countries
          .slice(0, showAll ? 999 : 30)
          .map((country: Place, key: number) => {
            return (
              <div className="">
                <Link
                  className="hover:underline"
                  to={`/explore/${country.slug}`}
                >
                  <div
                    style={{
                      backgroundImage: `url(${country.images[0]}&w=250)`,
                    }}
                    className={`h-[120px] bg-cover`}
                  ></div>
                  <div>{country.name}</div>
                </Link>
              </div>
            );
          })}
      </div>
      <div className="text-center mt-4">
        <div
          className="inline-block justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer"
          onClick={onShowToggle}
        >
          {showAll ? "Show Less Countries" : "Show All Countries"}
        </div>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = async ({}) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const placesSDK = skyscanner().geo();

  return json({
    countries: placesSDK.countries,
    apiUrl,
    googleApiKey,
  });
};

export default function SEOAnytime() {
  const { countries, googleApiKey, apiUrl } = useLoaderData();
  const [countryShow, setCountryShow] = useState(false);
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();

  useEffect(() => {
    runIndicative();
  }, []);

  const runIndicative = async () => {
    const from = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: "anywhere",
        depart: "2023-08-01",
        return: "2023-08-20",
        tripType: "return",
      },
      month: Number("2023-08-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
    console.log("/indicative", indicativeSearch);
  };

  return (
    <Layout selectedUrl="/explore">
      {/* Countries */}
      <AllCountries
        countries={countries}
        showAll={countryShow}
        onShowToggle={() => setCountryShow(!countryShow)}
      />

      <ExploreEverywhere search={searchIndicative} />

      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <Wrapper apiKey={googleApiKey}>
          <Map
            center={{ lat: 0, lng: 0 }}
            zoom={2}
            markers={getMarkersWorld(countries)}
          />
        </Wrapper>
      </div>
    </Layout>
  );
}
