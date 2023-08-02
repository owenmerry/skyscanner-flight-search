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
import { ExploreEverywhere } from "~/components/ui/explore/explore-everywhere";
import { AllCountries } from "~/components/ui/page/explore";
import { AllActivities } from "~/components/ui/activities/activities";
import { HeroExplore } from "~/components/ui/hero/hero-explore";

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

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={`Explore`}
        backgroundImage={
          "https://images.unsplash.com/photo-1601004435314-7300f4315c91?ixid=M3w0MjE3MjJ8MHwxfHNlYXJjaHwxfHxLb25hfGVufDB8MHx8fDE2OTEwMDIwMDV8MA&ixlib=rb-4.0.3&w=1200&w=1500"
        }
      />
      <AllCountries
        countries={countries}
        showAll={countryShow}
        onShowToggle={() => setCountryShow(!countryShow)}
      />
      <AllActivities />
      <ExploreEverywhere apiUrl={apiUrl} />
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
