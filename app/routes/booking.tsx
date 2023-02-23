import { useState } from 'react';

import { searchAutoSuggest } from '~/helpers/sdk/autosuggest';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link, Outlet, useLocation, useParams } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';
import { getDateFormated } from '~/helpers/date';

import { FlightSearchControls } from '~/components/flight-search-controls';
import type { FlightQuery } from '~/types/search';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
  ];
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  let fromText = 'London';
  let toText = 'Dublin';
  let fromEnityId = '27544008';
  let toEnityId = '95673529';
  let fromIata = 'LON';
  let toIata = 'DUB';

  if(params.from){
    const fromPlaces = await searchAutoSuggest(params.from, apiUrl);
    fromText = fromPlaces[0].name;
    fromEnityId = fromPlaces[0].entityId;
    fromIata = fromPlaces[0].iataCode;
  }
  if(params.to){
    const toPlaces = await searchAutoSuggest(params.to, apiUrl);
    toText = toPlaces[0].name;
    toEnityId = toPlaces[0].entityId;
    toIata = toPlaces[0].iataCode;
  }


  return json({
    params,
    apiUrl,
    fromText,
    toText,
    fromIata,
    toIata,
    fromEnityId,
    toEnityId,
  });
};

export default function Search() {
  const { apiUrl, params, fromText, toText, fromIata, toIata, fromEnityId,toEnityId } = useLoaderData();
  const { pathname } = useLocation()
  const isResultsPage = fromIata;
  const [search, setSearch] = useState<FlightQuery>({
    from: fromEnityId,
    to: toEnityId,
    depart: params.depart || getDateFormated(1),
    return: params.return ? params.return : getDateFormated(2),
    tripType: params.depart ? params.return ? 'return' : 'single' : 'return',
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
        <Outlet key={pathname} />
      </div>
    </div>
  );
}
