import { useState } from 'react';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';

import { FlightSearchControls } from '~/components/flight-search-controls';
import type { FlightQuery } from '~/types/search';
import { FlightResults } from '~/components/flight-results';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
  ];
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;
  const url = new URL(request.url);

  return json({
    apiUrl,
    params,
    query: Object.fromEntries(url.searchParams.entries()),
  });
};

export default function Search() {
  const { apiUrl, params, query } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>({
    from: params.from,
    to: params.to,
    depart: params.depart,
    return: params.depart,
    tripType: 'single',
  });

  const handleSearch = async (query : FlightQuery) => {
   setSearch(query);
  };

  return (
    <div>
      <div className='banner'>
        <Link className='link-light' to="/">Back</Link>
      </div>
      <div className='wrapper'>
        <FlightSearchControls onSubmit={handleSearch} apiUrl={apiUrl} defaultQuery={search} />
        <FlightResults query={search} apiUrl={apiUrl} />
      </div>
    </div>
  );
}
