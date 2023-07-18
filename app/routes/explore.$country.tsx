import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import {
  getPlaceFromSlug,
  getGeoList,
  getPlaceFromIata,
} from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersCountry } from "~/helpers/map";
import { SEO } from "~/components/SEO";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { HeroExplore } from "~/components/ui/hero/hero-explore";
import { ImagesDefault } from "~/components/ui/images/images-default";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const places = getGeoList();
  const countryPlaces = places.filter(
    (place) => country && place.parentId === country.entityId
  );
  const cities = countryPlaces.filter(
    (place) => place.type === "PLACE_TYPE_CITY"
  );
  const airports = countryPlaces.filter(
    (place) => place.type === "PLACE_TYPE_AIRPORT"
  );

  return json({
    apiUrl,
    places: getGeoList(),
    params,
    country,
    googleApiKey,
    cities,
    airports,
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    googleApiKey,
    params,
    country,
    places,
    cities,
    airports,
  }: {
    apiUrl: string;
    params: {
      country: string;
    };
    country: Place;
    cities: Place[];
    places: Place[];
    airports: Place[];
    googleApiKey: string;
  } = useLoaderData();
  const from = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");
  const query = {
    from: from ? from.entityId : "",
    to: country.entityId,
    month: String(new Date().getMonth() + 1),
    endMonth: new Date().getMonth() + 1,
    groupType: "month",
  };

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={`Explore ${country.name}`}
        backgroundImage={country.images[0]}
      />

      <ImagesDefault images={country.images} />

      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="text-3xl mb-6">Cities in {country.name}</h2>
        </div>
        <div className="grid sm:grid-cols-5 grid-cols-2">
          {cities
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((place) => {
              return (
                <div className="">
                  <Link
                    className="hover:underline"
                    to={`/explore/${place.slug}`}
                  >
                    {place.name}
                  </Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="relative z-10 py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="text-3xl mb-6">Map</h2>
        </div>
        <Wrapper apiKey={googleApiKey}>
          <Map
            center={{
              lat: country.coordinates.latitude,
              lng: country.coordinates.longitude,
            }}
            zoom={5}
            markers={getMarkersCountry([...cities, ...airports])}
          />
        </Wrapper>
      </div>

      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="text-3xl mb-6">
            Flights from {from ? from.name : ""}
          </h2>
        </div>
        <SEO
          fromLocation={country}
          apiUrl={apiUrl}
          query={query}
          googleApiKey={googleApiKey}
          showItems
          showMap={false}
        />
      </div>
    </Layout>
  );
}
