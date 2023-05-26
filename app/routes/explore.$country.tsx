import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import type { Place, PlaceExtra } from "~/helpers/sdk/place";
import { getPlaceFromSlug, getGeoList } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';
import { getImages } from '~/helpers/sdk/query';

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const country = getPlaceFromSlug(params.country || '');

  return json({
    apiUrl,
    places: getGeoList(),
    params,
    country,
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    params,
    country,
    places,
  }: {
    apiUrl: string;
    params: {
      country: string;
    },
    country: PlaceExtra,
    places: PlaceExtra[],
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
          {places.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {
            if (!(place.type === 'PLACE_TYPE_CITY' && place.parentId === country.entityId)) return;

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
