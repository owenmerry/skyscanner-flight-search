import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import type { Place } from "~/helpers/sdk/place";
import { Layout } from '~/components/ui/layout/layout';
import { getImages } from '~/helpers/sdk/query';

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const places: any = geoData.places;
  const selectedCountry = params.country || '';
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));
  const selectedPlace: Place = places[selectedCountry];
  const images = await getImages({ apiUrl: apiUrl, query: selectedPlace.name });
  //const images = ['https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?ixid=M3w0MjE3MjJ8MHwxfHNlYXJjaHwxfHxHcmVlY2V8ZW58MHwwfHx8MTY4NDI1NDgyOXww&ixlib=rb-4.0.3&w=1200'];

  return json({
    apiUrl,
    places: geoData.places,
    params,
    placeList,
    selectedPlace,
    images
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    params,
    placeList,
    selectedPlace, images }: {
      apiUrl: string;
      params: {
        country: string;
      },
      placeList: Place[],
      selectedPlace: Place,
      images: string[],
    } = useLoaderData();

  return (
    <Layout selectedUrl='/seo'>
      <div>
        <img className='w-full' src={images[0]} />
      </div>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className='text-3xl mb-6'>Cities in {selectedPlace.name}</h2>
        </div>
        <div className='grid sm:grid-cols-5 grid-cols-2'>
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
