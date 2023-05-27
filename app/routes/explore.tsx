import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import geoDataImages from "~/data/geo-images.json";
import { Layout } from '~/components/ui/layout/layout';
import type { PlaceExtra } from '~/helpers/sdk/place';
import { Map } from '~/components/map';
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkers } from "~/helpers/map";

export const loader: LoaderFunction = async ({ }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const googleApiKey = process.env.GOOGLE_API_KEY || '';

  return json({
    countries: geoDataImages,
    places: geoData.places,
    apiUrl,
    googleApiKey,
  });
};

export default function SEOAnytime() {
  const { countries, googleApiKey } = useLoaderData();

  return (
    <Layout selectedUrl='/explore'>

      {/* Countries */}
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>Countries</h2>
        </div>
        <div className='grid gap-2 sm:grid-cols-5 grid-cols-2'>
          {countries.map((country: PlaceExtra, key: number) => {

            return (
              <div className=''>
                <Link className='hover:underline' to={`/explore/${country.slug}`}>
                  <div style={{ backgroundImage: `url(${country.images[0]}&w=250)` }} className={`h-[120px] bg-cover`}></div>
                  <div>{country.name}</div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <Wrapper apiKey={googleApiKey}>
          <Map center={{ lat: 0, lng: 0 }} zoom={2} markers={getMarkers(countries)} />
        </Wrapper>
      </div>

    </Layout>
  );
}
