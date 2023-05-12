import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import type { Place } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';

export const loader: LoaderFunction = async ({ }) => {

  return json({
    places: geoData.places,
  });
};

export default function SEOAnytime() {
  const { places } = useLoaderData();
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));

  return (
    <Layout selectedUrl='/seo'>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>Countries</h2>
        </div>
        <div className='grid grid-cols-5'>
          {placeList.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {
            if (place.type !== 'PLACE_TYPE_COUNTRY') return;

            return (
              <div className=''>
                <Link className='hover:underline' to={`/seo/${place.entityId}`}>{place.name}</Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
