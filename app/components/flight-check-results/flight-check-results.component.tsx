import { useState, useEffect, useCallback } from "react";
import type { FlightCheckQuery, FlightUrl } from "~/types/search";
import { getFlightLiveCreate, getFlightLivePoll } from "~/helpers/sdk/query";
import { SearchSDK } from "~/helpers/sdk/flightSDK";
import { debounce } from "lodash";

interface FlightCheckResultsProps {
  query?: FlightCheckQuery;
  apiUrl?: string;
  url?: FlightUrl;
}

export const FlightCheckResults = ({
  query,
  apiUrl = "",
  url,
}: FlightCheckResultsProps): JSX.Element => {
  const [searches, setSearches] = useState<(SearchSDK | { error: string })[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setError(null);
    setSearches(null);
  }

  const handleSearches = useCallback(async (apiUrl: string, query: FlightCheckQuery) => {
    handleClear();

    const dates: { depart: string, return: string }[] = [
      { depart: '2023-03-08', return: '2023-03-17' },
      { depart: '2023-04-08', return: '2023-04-17' },
      { depart: '2023-05-08', return: '2023-05-17' },
      { depart: '2023-06-08', return: '2023-06-17' },
      { depart: '2023-07-08', return: '2023-07-17' },
      { depart: '2023-08-08', return: '2023-08-17' },
      { depart: '2023-09-08', return: '2023-09-17' },
      { depart: '2023-10-08', return: '2023-10-17' },
      { depart: '2023-11-08', return: '2023-11-17' },
      { depart: '2023-12-08', return: '2023-12-17' },
    ];
    let searches: SearchSDK[] = [];

    if (!query || !query.to || !query.from) return;



    const results: (SearchSDK | { error: string })[] = await Promise.all(dates.map(async (date): Promise<SearchSDK | { error: string }> => {

      const res = await getFlightLiveCreate({
        apiUrl, query: {
          to: query.to,
          from: query.from,
          depart: date.depart,
          return: date.return,
          tripType: 'return',
        }
      });

      return res;
    }));
    console.log('create search', results);

    // results.map((result) => {
    //   if ('error' in result) {
    //     setError(result.error)
    //     return;
    //   }
    // })
    setSearches(results);

  }, [apiUrl]
  )

  const clickedPoll = debounce(() => handlePoll(apiUrl), 5000, { leading: true });

  const handlePoll = async (apiUrl: string) => {

    if (!searches) return;

    const results: (SearchSDK | { error: string })[] = await Promise.all(searches.map(async (search): Promise<SearchSDK | { error: string }> => {

      if ('error' in search) return search;

      const res = await getFlightLivePoll({
        apiUrl,
        token: search.sessionToken
      });

      if ('sessionToken' in res) res.sessionToken = search.sessionToken;

      return res;
    }));
    console.log('poll search', results);

    setSearches(results);
  }

  useEffect(() => {
    query && handleSearches(apiUrl, query);
  }, [query, handleSearches]);


  return (<>
    <div><button onClick={() => clickedPoll()}>Poll Searches</button></div>
    {error ? (<div>{error}</div>) : ''}
    {searches?.map((search, key) => {
      if ('error' in search) return;

      return (
        <div key={`price-${key}`}>{key + 3} : Price:{search.stats.minPrice} ({search.stats.total}) {search.status === 'RESULT_STATUS_COMPLETE' ? '👍' : ''}</div>
      );
    })}
  </>
  );
};
