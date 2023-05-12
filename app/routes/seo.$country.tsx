import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import type { Place } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';

export const loader: LoaderFunction = async ({ params }) => {

  return json({
    places: geoData.places,
    params,
  });
};

export default function SEOAnytime() {
  const { places, params } = useLoaderData();
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));
  const selectedPlace: Place = places[params.country];

  return (
    <Layout selectedUrl='/seo'>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">

        <div>
          <h2 className='text-3xl mb-6'>Cities in {selectedPlace.name}</h2>
        </div>
        <div className='grid grid-cols-5'>
          {placeList.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {
            if (!(place.type === 'PLACE_TYPE_CITY' && place.parentId === params.country)) return;

            return (
              <div className=''>
                <Link className='hover:underline' to={`/explore/${place.entityId}/anywhere/${new Date().getMonth() + 1}`}>{place.name}</Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
