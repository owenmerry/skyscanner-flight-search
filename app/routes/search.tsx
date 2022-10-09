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

export const loader: LoaderFunction = async ({ request, context }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;

  return json({
    apiUrl
  });
};

export default function Search() {
  const { apiUrl } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>();

  const handleSearch = async (query : FlightQuery) => {
   setSearch(query);
  };

  return (
    <div>
      <Link to="/">Back</Link>
      <h1>Welcome to My Flight Search</h1>

     <FlightSearchControls onSubmit={handleSearch} apiUrl={apiUrl} />

     <FlightResults query={search} apiUrl={apiUrl} />
    </div>
  );
}
