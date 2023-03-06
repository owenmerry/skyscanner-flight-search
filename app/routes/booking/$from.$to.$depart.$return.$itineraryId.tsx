import { useState } from 'react';
import { searchAutoSuggest } from '~/helpers/sdk/autosuggest';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useOutlet } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';
import hotelStyles from '~/styles/hotel.css';


import type { FlightQuery, FlightUrl } from '~/types/search';
import { FlightDetails } from '~/components/flight-details';
import { HotelList } from '~/components/hotels-list';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: flightStyles },
    { rel: 'stylesheet', href: hotelStyles },
  ];
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';
  const url = new URL(request.url);
  let fromEnityId = '95565050';
  let toEnityId = '95673529';

  if (params.from) {
    const fromPlaces = await searchAutoSuggest(params.from, apiUrl);
    fromEnityId = fromPlaces[0].entityId;
  }
  if (params.to) {
    const toPlaces = await searchAutoSuggest(params.to, apiUrl);
    toEnityId = toPlaces[0].entityId;
  }

  return json({
    apiUrl,
    params,
    context,
    query: Object.fromEntries(url.searchParams.entries()),
    fromEnityId,
    toEnityId,
    url: {
      from: params.from,
      to: params.to,
      depart: params.depart,
      return: params.return,
      itineraryId: params.itineraryId,
    }
  });
};

export default function Search() {
  const { apiUrl, params, context, fromEnityId, toEnityId, url } = useLoaderData();
  const [search, setSearch] = useState<FlightQuery>({
    from: fromEnityId,
    to: toEnityId,
    depart: params.depart,
    return: params.return || params.depart,
    tripType: params.return ? 'return' : 'single',
  });

  return (
    <div>
      <FlightDetails url={url} query={search} apiUrl={apiUrl} itineraryId={url.itineraryId} />
      <HotelList url={url} query={search} apiUrl={apiUrl} />
    </div>
  );
}
