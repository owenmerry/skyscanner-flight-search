import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { Map } from "~/components/ui/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersWorld } from "~/helpers/map";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useState } from "react";
import { ExploreEverywhere } from "~/components/section/explore/explore-everywhere";
import { AllCountries } from "~/components/section/page/explore";
import { AllActivities } from "~/components/section/activities/activities";
import { HeroExplore } from "~/components/section/hero/hero-explore";
import { getRandomNumber } from "~/helpers/utils";
import { Place } from "~/helpers/sdk/place";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";

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
  const { countries, googleApiKey, apiUrl } = useLoaderData<{
    countries: Place[];
    googleApiKey: string;
    apiUrl: string;
  }>();
  const [countryShow, setCountryShow] = useState(false);

  const randomCountry =
    countries[getRandomNumber(countries.length)] || countries[0];

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={`Explore Everywhere`}
        imagePlace={randomCountry}
        backgroundImage={
          randomCountry.images[getRandomNumber(randomCountry.images.length)]
        }
        apiUrl={apiUrl}
      />
      <Breadcrumbs
        items={[
          {
            name: "Explore",
          },
        ]}
      />
      <AllCountries
        countries={countries}
        showAll={countryShow}
        onShowToggle={() => setCountryShow(!countryShow)}
      />
      <AllActivities />
      <ExploreEverywhere apiUrl={apiUrl} />
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
          Explore By Map
        </h2>
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
