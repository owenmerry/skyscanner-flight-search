import { useState, useRef, useEffect, useCallback } from 'react';
import type { FlightQuery } from '~/types/search';
import { skyscanner } from '~/helpers/sdk/flight';
import type { SearchSDK } from '~/helpers/sdk/flight';

import { Loading } from '~/components/loading';
import { Prices } from '~/components/prices';

interface FlightResultsProps {
  query?: FlightQuery;
  apiUrl?: string;
}

export const FlightResults = ({
  query,
  apiUrl = '',
}: FlightResultsProps): JSX.Element => {
  const [search, setSearch] = useState<SearchSDK | false>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sort, setSort] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [results, setResults] = useState(10);
  const sessionTokenSaved = useRef<string>('');

  const pollFlights = useCallback(async (token: string) => {
    const res = await fetch(`${apiUrl}/poll/${token}`);
    const json = await res.json();

    setSearch(skyscanner(json).search());

    // run again until is complete
    if (json.status === 'RESULT_STATUS_INCOMPLETE' && sessionTokenSaved.current === token) {
      pollFlights(token);
    }
  },[apiUrl]);

  const handleSearch = useCallback(async (query : FlightQuery) => {
    setSearch(false);
    setSearching(true);
    setError('');
    setResults(10);

    try {
      const res = await fetch(
        `${apiUrl}/create?from=${query.from}&to=${
          query.to
        }&depart=${query.depart}&return=${query.return}`,
      );
      const json = await res.json();

      if (!json && json.statusCode === 500) {
        setSearching(false);
        setError(
          'Sorry something happened and we couldnt do this search, maybe try a differnt search',
        );
      } else {

        setSearch(skyscanner(json).search());
        sessionTokenSaved.current = json.sessionToken;
        setSearching(false);

        pollFlights(json.sessionToken);
      }
    } catch (ex) {
      setSearching(false);
      setError('Sorry something happened and we couldnt do this search.');
    }
  },[apiUrl, pollFlights]);

  const handleSort = (sortType: 'best' | 'cheapest' | 'fastest') => {
    setSort(sortType);
  };

  const handleShowResults = (amount: number) => {
    setResults(amount);
  };

useEffect(() => {
  query && handleSearch(query);
},[query, handleSearch]);

  return (
    <div className="flight-results">
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

          <h3>Suggested Flights</h3>

          {search[sort].slice(0, results).map((itinerary) => {
            return (
              <div className="flight" key={itinerary.itineraryId}>
                <div className="flight-layout">
                    <div className='panel-date'>
                      <div>{itinerary.legs[0].departure} - {itinerary.legs[1].arrival}</div>
                    </div>
                    <div className='panel-legs'>
                      {itinerary.legs.map((leg) => (
                        <div key={leg.id} className='panel-leg'>
                          <div className='times'>
                            {leg.departureTime}<br />
                            {leg.fromIata}
                          </div>
                          <div>
                            <div className='gauge-background'>
                              <div className='gauge-status'>
                                {leg.duration} minutes ({leg.direct ? 'Direct' : `${leg.stops} Stop${leg.stops > 1 ? 's' : ''}`})
                              </div>
                            </div>
                          </div>
                          <div className='times'>
                            {leg.arrivalTime}<br />
                            {leg.toIata}
                          </div>
                        </div>
                      ))} 
                    </div>

                    <Prices flight={itinerary} />
                    
                    {/* <div>
                     {itinerary.legs.map((leg) => (
                      <div key={leg.id}>
                        <div>
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
                  </div> */}

                  
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
};
