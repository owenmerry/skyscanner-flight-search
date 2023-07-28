import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getPlaceFromIata, type Place } from "~/helpers/sdk/place";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersWorld } from "~/helpers/map";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { AllCountries, ExploreEverywhere } from "~/components/ui/page/explore";

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
  const from = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");

  useEffect(() => {
    runIndicative();
  }, []);

  const runIndicative = async () => {
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
  };
  if (!from) return;

  return (
    <Layout selectedUrl="/explore">
      <AllCountries
        countries={countries}
        showAll={countryShow}
        onShowToggle={() => setCountryShow(!countryShow)}
      />
      <ExploreEverywhere
        title={`${from.name} to Everywhere`}
        from={from}
        search={searchIndicative}
        apiUrl={apiUrl}
      />
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
