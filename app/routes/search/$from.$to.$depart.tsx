import { useState } from 'react';
import { searchAutoSuggest } from '~/helpers/sdk/autosuggest';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';

import type { FlightQuery } from '~/types/search';
import { FlightResults } from '~/components/flight-results';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
  ];
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const url = new URL(request.url);
  let fromEnityId = '27544008';
  let toEnityId = '95673529';

  if(params.from){
    const fromPlaces = await searchAutoSuggest(params.from, apiUrl);
    fromEnityId = fromPlaces[0].entityId;
  }
  if(params.to){
    const toPlaces = await searchAutoSuggest(params.to, apiUrl);
    toEnityId = toPlaces[0].entityId;
  }

  return json({
    apiUrl,
    params,
    query: Object.fromEntries(url.searchParams.entries()),
    fromEnityId,
    toEnityId,
    url: {
      to: params.to,
      from: params.from,
      depart: params.depart,
    }
  });
};

export default function Search() {
  const { apiUrl, params, fromEnityId, toEnityId, url } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>({
    from: fromEnityId,
    to: toEnityId,
    depart: params.depart,
    tripType: 'single',
  });

  return (
    <div>
        <FlightResults url={url} query={search} apiUrl={apiUrl} />
    </div>
  );
}
