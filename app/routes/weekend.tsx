import { useState } from 'react';
import type { LoaderFunction,LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import styles from '~/styles/search.css';

import { FlightWeekendSearchControls } from '~/components/flight-weekend-search-controls';
import { FlightResults } from '~/components/flight-results';
import type { FlightQuery } from '~/types/search';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;

  return json({
    apiUrl
  });
};

export default function Weekend() {
  const { apiUrl } = useLoaderData();
  const [search,setSearch] = useState<FlightQuery>();

  const handleSearch = async (query : FlightQuery) => {
    setSearch(query);
  };

  const handleQueryChange = (query: FlightQuery) => {
    handleSearch(query);
  };

  return (
    <div>
      <Link to="/">Back</Link>
      <h1>Weekend Flight Search</h1>

      <FlightWeekendSearchControls
        onChange={handleQueryChange}
        apiUrl={apiUrl}
      />

      <FlightResults query={search} apiUrl={apiUrl} />
    </div>
  );
}
