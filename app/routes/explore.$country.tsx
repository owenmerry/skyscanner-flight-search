import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import type { Place, PlaceExtra } from "~/helpers/sdk/place";
import { getPlaceFromSlug, getGeoList } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';
import { getImages } from '~/helpers/sdk/query';
import { Map } from '~/components/map';
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkers } from "~/helpers/map";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const country = getPlaceFromSlug(params.country || '');
  const googleApiKey = process.env.GOOGLE_API_KEY || '';
  const places = getGeoList();
  const cities = places.filter((place) => (country && place.parentId === country.entityId));

  return json({
    apiUrl,
    places: getGeoList(),
    params,
    country,
    googleApiKey,
    cities,
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    params,
    country,
    places,
    googleApiKey,
    cities,
  }: {
    apiUrl: string;
    params: {
      country: string;
    },
    country: PlaceExtra,
    cities: PlaceExtra[],
    places: PlaceExtra[],
    googleApiKey: string,
  } = useLoaderData();

  return (
    <Layout selectedUrl='/explore'>
      <div>
        <div style={{ backgroundImage: `url(${country.images[0]}&w=1500)` }} className={`h-[300px] md:h-[500px] bg-cover bg-center`}></div>
      </div>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>Cities in {country.name}</h2>
        </div>
        <div className='grid sm:grid-cols-5 grid-cols-2'>
          {cities.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {
            return (
              <div className=''>
                <Link className='hover:underline' to={`/explore/${place.entityId}/anywhere/${new Date().getMonth() + 1}`}>{place.name}</Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <Wrapper apiKey={googleApiKey}>
          <Map center={{ lat: country.coordinates.latitude, lng: country.coordinates.longitude }} zoom={5} markers={getMarkers(cities)} />
        </Wrapper>
      </div>
    </Layout>
  );
}
