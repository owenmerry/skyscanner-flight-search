import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, Outlet, useLocation } from '@remix-run/react';
import { Layout } from '~/components/ui/layout/layout';
import { HeroDefault } from '~/components/ui/hero/hero-default';
import { getPlaceFromIata } from '~/helpers/sdk/place';

interface Query {
  from: string;
  fromIata: string;
  fromText: string;
  to: string;
  toIata: string;
  toText: string;
  depart: string;
  return: string;
  tripType: string;
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';

  //exit
  if (!params.from || !params.to) return {
    apiUrl,
  };

  //get locations
  const fromPlace = getPlaceFromIata(params.from);
  const toPlace = getPlaceFromIata(params.to);

  const flightParams: Query = {
    from: params.from || '',
    fromIata: fromPlace.iata,
    fromText: fromPlace.name,
    to: params.to || '',
    toIata: toPlace.iata,
    toText: toPlace.name,
    depart: params.depart || '',
    return: params.return || '',
    tripType: 'return',
  };

  return {
    apiUrl,
    flightParams
  }

};

export default function SearchFlight() {
  const { apiUrl, flightParams }: { apiUrl: string; flightParams: Query } = useLoaderData();
  const { pathname } = useLocation();


  return (
    <div>
      <Layout selectedUrl='/search-flight'>
        <HeroDefault
          apiUrl={apiUrl}
          showText={false}
          buttonLoading={false}
          flightDefault={flightParams}
        />
        <Outlet key={pathname} />
      </Layout>
    </div>
  );
}
