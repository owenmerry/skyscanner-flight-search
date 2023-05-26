import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import { Layout } from '~/components/ui/layout/layout';
import { getImages } from '~/helpers/sdk/query';

import { SEO } from '~/components/SEO';

interface Place {
  entityId: string;
  parentId: string;
  name: string;
  type: string;
  iata: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const places: any = geoData.places;
  const selectedCityOrAirport = params.from || '';
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));
  const selectedPlace: Place = places[selectedCityOrAirport];
  const images = await getImages({ apiUrl: apiUrl, query: selectedPlace.name });

  return json({
    params,
    apiUrl,
    googleApiKey,
    places: geoData.places,
    images,
  });
};

export default function SEOAnytime() {
  const { apiUrl, googleApiKey, params, places, images } = useLoaderData();
  const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey])).filter((place) => place.parentId === params.from);
  const selectedPlace: Place = places[params.from];
  const showAirports = placeList.length > 1;

  const query = {
    from: params.from,
    to: params.to,
    month: params.month,
    endMonth: 6,
    groupType: 'month',
  };

  return (
    <Layout selectedUrl='/explore'>
      <div>
        <div style={{ backgroundImage: `url(${images[0]})` }} className={`h-[300px] md:h-[500px] bg-cover bg-center`}></div>
      </div>
      <SEO fromLocation={selectedPlace} apiUrl={apiUrl} query={query} googleApiKey={googleApiKey} showItems />
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      </div>
      {showAirports ? (
        <div className='wrapper panel'>
          <div>
            <h2>Airports in {selectedPlace.name}</h2>
          </div>
          <div className='list'>
            {placeList.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {

              return (
                <div className='item'>
                  <Link to={`/explore/${place.entityId}/anywhere/${new Date().getMonth() + 1}`}>{place.name} ({place.iata})</Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : ''}
    </Layout>
  );
}
