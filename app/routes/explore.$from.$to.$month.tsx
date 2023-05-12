import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import geoData from "~/data/geo.json";
import { Layout } from '~/components/ui/layout/layout';

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
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  return json({
    params,
    apiUrl,
    googleApiKey,
    places: geoData.places,
  });
};

export default function SEOAnytime() {
  const { apiUrl, googleApiKey, params, places } = useLoaderData();
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
    <Layout selectedUrl='/seo'>
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
