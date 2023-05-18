import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import geoDataImages from "~/data/geo-images.json";
import type { Place } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';
import { runSaveImages } from '~/helpers/sdk/images';
import type { CountryImagesJSON } from '~/helpers/sdk/images';

export const loader: LoaderFunction = async ({ }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';

  return json({
    countries: geoDataImages,
    places: geoData.places,
    apiUrl,
  });
};

const imagesFunc = async (apiUrl: string) => {
  const imagesJSON = await runSaveImages(apiUrl);
  console.log(imagesJSON);
}

export default function SEOAnytime() {
  const { places, apiUrl, countries } = useLoaderData();
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));
  //imagesFunc(apiUrl);

  return (
    <Layout selectedUrl='/seo'>

      {/* Countries */}
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>Countries</h2>
        </div>
        <div className='grid gap-2 sm:grid-cols-5 grid-cols-2'>
          {countries.map((country: CountryImagesJSON, key: number) => {

            return (
              <div className=''>
                <Link className='hover:underline' to={`/seo/${country.entityId}`}>
                  <div style={{ backgroundImage: `url(${country.images[0]})` }} className={`h-[120px] bg-cover`}></div>
                  <div>{country.name}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Countries */}
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>All Countries</h2>
        </div>
        <div className='grid sm:grid-cols-5 grid-cols-2'>
          {placeList.sort((a, b) => a.name.localeCompare(b.name)).map((place, key) => {
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
