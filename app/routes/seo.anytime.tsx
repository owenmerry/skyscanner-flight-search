import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';

import { SEO } from '~/components/SEO';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
  ];
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  return json({
    apiUrl,
    googleApiKey
  });
};

export default function SEOAnytime() {
  const { apiUrl, googleApiKey } = useLoaderData();

  return (
    <div>
      <div className='banner'>
        <Link className='link-light' to="/">Back</Link>
      </div>
      <div className='wrapper'>
        <SEO apiUrl={apiUrl} googleApiKey={googleApiKey} />
      </div>
    </div>
  );
}
