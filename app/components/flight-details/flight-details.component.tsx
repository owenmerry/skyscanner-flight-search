import { useState, useRef, useEffect, useCallback } from 'react';
import type { FlightQuery, FlightUrl } from '~/types/search';
import { skyscanner } from '~/helpers/sdk/flightSDK';
import type { SearchSDK } from '~/helpers/sdk/flightSDK';
import { format } from 'date-fns';

import { Link } from '@remix-run/react';

import { Loading } from '~/components/loading';
import { Prices } from '~/components/prices';

interface FlightDetailsProps {
  query?: FlightQuery;
  apiUrl?: string;
  url?: FlightUrl;
  itineraryId?: string;
}

export const FlightDetails = ({
  query,
  apiUrl = '',
  url,
  itineraryId,
}: FlightDetailsProps): JSX.Element => {
  const [search, setSearch] = useState<SearchSDK | false>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sort, setSort] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [results, setResults] = useState(10);
  const [retry, setRetry] = useState(0);
  const maxRetry = 10;
  const sessionTokenSaved = useRef<string>('');
  const foundFlight = !!(search && search[sort].filter((item) => item.itineraryId === itineraryId).length > 0);

  const pollFlights = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${apiUrl}/poll/${token}`);
      const json = await res.json();

      if (!json && json.statusCode === 500 && json.statusCode !== 200) {
        // if(retry < maxRetry) {
        //   setRetry(retry + 1);
        //   pollFlights(token);
        // } else {
          setError(
            `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 1 (status: ${retry})`,
          );
          setSearching(false);
        // }
      } else {
        setSearch(skyscanner(json).search());

        // run again until is complete
        if (json.status === 'RESULT_STATUS_INCOMPLETE' && sessionTokenSaved.current === token) {
          pollFlights(token);
        }
      }
    } catch (ex) {
      setSearching(false);
      if(retry < maxRetry) {
        setRetry(retry + 1);
        pollFlights(token);
      } else {
        setError(
          `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 2 (status: ${retry})`,
        );
      }
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
        }&depart=${query.depart}${query?.return ? `&return=${query.return}` : ''}`,
      );
      const json = await res.json();

      if (!json && json.statusCode === 500 && json.statusCode !== 200) {
        setSearching(false);
        setError(
          `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 3 (status: ${retry})`,
        );
      } else {

        setSearch(skyscanner(json).search());
        sessionTokenSaved.current = json.sessionToken;
        setSearching(false);

        pollFlights(json.sessionToken);
      }
    } catch (ex) {
      setSearching(false);
      if(retry < maxRetry) {
        setRetry(retry + 1);
        handleSearch(query);
      } else {
        setError(`Sorry, something happened and we couldnt do this search. code: 4 (status: ${retry})`);
      }
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
      {(searching || !foundFlight) && (
        <div className='loading'>
          Loading Flight Details and Prices <Loading />
        </div>
      )}
      {error !== '' && <div className='error'>{error}</div>}
      {search && (
        <div>
          {search[sort].filter((item) => item.itineraryId === itineraryId).map((itinerary) => {
            return (
              <div className="flight" key={itinerary.itineraryId}>
                <div className='hidden'>
                  <div>id: {itinerary.itineraryId}</div>
                </div>






                <div className='flight-details'>
                  <div className='flight-title'>
                    {url?.from} to {url?.to}
                  </div>
                  {itinerary.legs.map((leg, key) => {
                    
                    return (<div key={leg.id}>
                      {key === 0 && (
                        <h3>Outbound</h3>
                      )}
                      {key === 1 && (
                        <h3>Return</h3>
                      )}
                      <div className='panel-leg'>
                        <div className='times'>
                          <div className='time'>{leg.departureTime}</div>
                          {leg.fromIata}
                        </div>
                        <div className='duration'>
                          <div>
                            {leg.duration} minutes ({leg.direct ? 'Direct' : `${leg.stops} Stop${leg.stops > 1 ? 's' : ''}`})
                          </div>
                        </div>
                        <div className='times'>
                          <div className='time'>{leg.arrivalTime}</div>
                          {leg.toIata}
                        </div>
                      </div>


                      <div key={leg.id}>
                        <div>
                          Stops: {leg.stops}, Journey time: {leg.duration} min
                        </div>
                        <div>
                          <div>
                            <div>
                              {leg.segments.map((segment) => (
                                <div className='segment' key={segment.id}>
                                  <div>{segment.from} to {segment.to}</div>
                                  <div>Depature:{segment.departure}</div>
                                  <div>Arrival: {segment.arrival}</div>
                                  <div>Journey time: {segment.duration} min</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>


                    </div>);
                  })}
                </div>





                <div className="flight-layout">



                  {/* Deals */}
                  <div>
                    <h2>Deals </h2>
                    {search.status !== 'RESULT_STATUS_COMPLETE' && (
                      <>
                        Checking prices and availability... <Loading />
                      </>
                    )}
                    <Prices url={url} flight={itinerary} query={query} open showButton={false} />
                  </div>
                    
                    
                    


                  
              </div>
              </div>
            );
          })}
        </div>
      )}
  </div>
  );
};
