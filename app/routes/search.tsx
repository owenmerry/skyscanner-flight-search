import { useState, useRef } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { skyscanner } from '~/helpers/sdk/flight';
import type { SearchSDK } from '~/helpers/sdk/flight';
import styles from '~/styles/search.css';

import { Loading } from '~/components/loading';
import { FlightSearchControls } from '~/components/flight-controls';
import type { Query } from '~/components/flight-controls';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL;

  return json({
    apiUrl
  });
};

export default function Search() {
  const { apiUrl } = useLoaderData();
  const sessionTokenSaved = useRef<string>('');
  const [search, setSearch] = useState<SearchSDK | false>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sort, setSort] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [results, setResults] = useState(10);

  const pollFlights = async (token: string) => {
    console.log('poll search - start');
    const res = await fetch(`${apiUrl}/poll/${token}`);
    const json = await res.json();
    console.log('poll search', json);

    setSearch(skyscanner(json).search());
    console.log('poll search - finished');

    // run again until is complete
    if (json.status === 'RESULT_STATUS_INCOMPLETE') {
      pollFlights(token);
    }
  };

  const handleSort = (sortType: 'best' | 'cheapest' | 'fastest') => {
    setSort(sortType);
  };

  const handleShowResults = (amount: number) => {
    setResults(amount);
  };

  const handleSearch = async (query : Query) => {
    setSearch(false);
    setSearching(true);
    setError('');
    setResults(10);
    try {
      const res = await fetch(
        `${apiUrl}/create?from=${query.from}&to=${
          query.to
        }&depart=${query.depart}${
          query.tripType === 'return' ? `&return=${query.return}` : ''
        }`,
      );
      const json = await res.json();

      if (!json && json.statusCode === 500) {
        setSearching(false);
        setError(
          'Sorry something happened and we couldnt do this search, maybe try a differnt search',
        );
      } else {
        console.log('create search', json);

        setSearch(skyscanner(json).search());
        sessionTokenSaved.current = json.sessionToken;
        setSearching(false);

        pollFlights(json.sessionToken);
      }
    } catch (ex) {
      setSearching(false);
      setError('Sorry something happened and we couldnt do this search.');
    }
  };

  return (
    <div>
      <h1>Welcome to My Flight Search</h1>

     <FlightSearchControls onSubmit={handleSearch} apiUrl={apiUrl} />

      {searching && (
        <div>
          Loading search <Loading />
        </div>
      )}
      {error !== '' && <div>{error}</div>}
      {search && (
        <div>
          <h2>
            Results {search.stats.total} - Lowest Price: {search.stats.minPrice}
          </h2>
          <div>
            <button onClick={() => handleSort('best')}>Best</button>
            <button onClick={() => handleSort('cheapest')}>Cheapest</button>
            <button onClick={() => handleSort('fastest')}>Fastest</button>
          </div>
          <h3>
            {search.status !== 'RESULT_STATUS_COMPLETE' && (
              <>
                Loading prices and extra flights
                <Loading />
              </>
            )}
            {search.status === 'RESULT_STATUS_COMPLETE' && <>Search finished</>}
          </h3>

          {search[sort].slice(0, results).map((itinerary) => {
            return (
              <div className="flight" key={itinerary.itineraryId}>
                <div className="flight-layout">
                  <div>
                    {itinerary.legs.map((leg) => (
                      <div key={leg.id}>
                        <div>
                          {leg.from} to {leg.to}
                        </div>
                        <div>
                          Depature:{leg.departure}, Arrival: {leg.arrival}
                        </div>
                        <div>
                          Stops: {leg.stops}, Journey time: {leg.duration} min
                        </div>
                        <div>
                          <div>
                            <ul>
                              {leg.segments.map((segment) => (
                                <li key={segment.id}>
                                  {segment.from} to {segment.to}
                                  <br />
                                  Depature:{segment.departure}, Arrival:{' '}
                                  {segment.arrival}, Journey time:{' '}
                                  {segment.duration} min
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3>{itinerary.price}</h3>
                    {itinerary.deals.map((deal, key) => (
                      <div key={`${deal.price}-${key}`}>
                        {deal.deepLinks.map((deepLink) => (
                          <div key={deepLink.link} className="flight-price">
                            <div>{deal.price}</div>
                            <img
                              width="100px"
                              src={deepLink.agentImageUrl}
                              alt={`${deepLink.agentName} logo`}
                            />
                            <a
                              target="_blank"
                              href={deepLink.link}
                              rel="noreferrer"
                            >
                              View Deal
                            </a>
                            <div>({deepLink.agentName})</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div>
            {results < search.stats.total && (
              <>
                <button onClick={() => handleShowResults(results + 10)}>
                  Show 10 more results
                </button>
                <button onClick={() => handleShowResults(results + 100)}>
                  Show 100 more results
                </button>
                <button onClick={() => handleShowResults(10000)}>
                  Show all results
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
