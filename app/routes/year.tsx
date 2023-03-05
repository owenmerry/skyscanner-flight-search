import { useState } from 'react';
import type { LoaderFunction,LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';

import { FlightYearSearchControls } from '~/components/flight-year-search-controls';
import { FlightCheckResults } from '~/components/flight-check-results';
import type { FlightCheckQuery } from '~/types/search';

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

export default function Year() {
  const { apiUrl } = useLoaderData();
  const [search,setSearch] = useState<FlightCheckQuery>();

  const handleSearch = async (query : FlightCheckQuery) => {
    setSearch(query);
  };

  const handleQueryChange = (query: FlightCheckQuery) => {
    handleSearch(query);
  };

  return (
    <div>
      <div className='banner'>
        <Link className='link-light' to="/">Back</Link>
      </div>
      <div className='wrapper'>
        <FlightYearSearchControls
          onChange={handleQueryChange}
          apiUrl={apiUrl}
        />
        <FlightCheckResults query={search} apiUrl={apiUrl} />
      </div>
    </div>
  );
}
