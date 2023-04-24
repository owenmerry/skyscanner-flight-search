import { useEffect, useState } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { FiltersDefault } from '~/components/ui/filters/filters-default';
import { FlightResultsDefault } from '~/components/ui/flight-results/flight-results-default';
import { getFlightLiveCreate, getFlightLivePoll } from "~/helpers/sdk/query";
import { useLoaderData } from '@remix-run/react';
import { SearchSDK } from '~/helpers/sdk/flightSDK';
import { getEntityIdFromIata } from '~/helpers/sdk/place';
import { FlightQuery } from '~/types/search';
import { Spinner } from 'flowbite-react';


export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || '';

  //exit
  if (!params.from || !params.to) return;

  //get locations
  const from = getEntityIdFromIata(params.from);
  const to = getEntityIdFromIata(params.to);
  // const from = '95565050' || '';
  // const to = '95673529' || '';

  console.log(from, to);

  //get search
  const flightSearch = await getFlightLiveCreate({
    apiUrl,
    query: {
      from,
      to,
      depart: params.depart || '',
      return: params.return,
      tripType: 'return',
    }
  });

  return {
    apiUrl,
    params,
    flightSearch,
  }

};

export default function Search() {
  const { flightSearch, apiUrl } = useLoaderData<{ apiUrl: string, flightSearch: SearchSDK, params: FlightQuery }>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(flightSearch);
  const [error, setError] = useState('error' in flightSearch ? flightSearch.error : '');
  const sessionToken = search.sessionToken;

  useEffect(() => {
    runPoll();
  }, []);

  const runPoll = async () => {
    const res = await getFlightLivePoll({
      apiUrl,
      token: sessionToken
    });

    if ('error' in res) return;

    if (
      res.status === "RESULT_STATUS_INCOMPLETE"
    ) {
      setSearch(res);
      runPoll();
    } else {
      setSearch(res);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className=''>
        <div className='flex justify-between mx-4 max-w-screen-xl bg-white dark:bg-gray-800 xl:p-9 xl:mx-auto'>
          <div className='xl:w-[400px] md:block hidden max-w-none'>
            <FiltersDefault />
          </div>
          <div className='w-full md:ml-2'>
            {error !== '' ? <> {error}
            </> : <>
              {loading ? <div className='text-center p-5 mb-4 text-slate-400 bg-slate-50 rounded-xl'><Spinner className='mr-2' /> Loading More Prices & Flights...</div> : ''}
              <FlightResultsDefault flights={search} />
            </>}
          </div>
        </div>
      </div>
    </div >
  );
}
