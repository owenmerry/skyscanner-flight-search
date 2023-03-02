import { useState, useRef, useEffect, useCallback } from "react";
import type { FlightQuery, FlightUrl } from "~/types/search";
import { skyscanner } from "~/helpers/sdk/flight";
import type { SearchSDK } from "~/helpers/sdk/flight";

import { Link } from "@remix-run/react";

import { Loading } from "~/components/loading";
import { Prices } from "~/components/prices";

interface FlightResultsProps {
  query?: FlightQuery;
  apiUrl?: string;
  url?: FlightUrl;
}

export const FlightResults = ({
  query,
  apiUrl = "",
  url,
}: FlightResultsProps): JSX.Element => {
  const [search, setSearch] = useState<SearchSDK | false>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sort, setSort] = useState<"best" | "cheapest" | "fastest">("best");
  const [results, setResults] = useState(10);
  const [retry, setRetry] = useState(0);
  const maxRetry = 10;
  const sessionTokenSaved = useRef<string>("");

  const pollFlights = useCallback(
    async (token: string) => {
      try {
        const res = await fetch(`${apiUrl}/poll/${token}`);
        const json = await res.json();

        if (!json && json.statusCode === 500 && json.statusCode !== 200) {
          setSearching(false);
          if (retry < maxRetry) {
            setRetry(retry + 1);
            pollFlights(token);
          } else {
            setError(
              `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 1 (status:${retry})`
            );
          }
        } else {
          setSearch(skyscanner(json).search());

          // run again until is complete
          if (
            json.status === "RESULT_STATUS_INCOMPLETE" &&
            sessionTokenSaved.current === token
          ) {
            pollFlights(token);
          }
        }
      } catch (ex) {
        if (retry < maxRetry) {
          setRetry((st) => st + 1);
          pollFlights(token);
        } else {
          setError(
            `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 2 (status:${retry})`
          );
          setSearching(false);
        }
      }
    },
    [apiUrl]
  );

  const handleSearch = useCallback(
    async (query: FlightQuery) => {
      setSearch(false);
      setSearching(true);
      setError("");
      setResults(10);

      try {
        const res = await fetch(
          `${apiUrl}/create?from=${query.from}&to=${query.to}&depart=${
            query.depart
          }${query?.return ? `&return=${query.return}` : ""}`
        );
        const json = await res.json();

        if (!json && json.statusCode === 500 && json.statusCode !== 200) {
          setSearching(false);
          setError(
            `Sorry, something happened and we couldnt do this search, maybe try a differnt search code: 3 (status:${retry})`
          );
        } else {
          setSearch(skyscanner(json).search());
          sessionTokenSaved.current = json.sessionToken;
          setSearching(false);

          pollFlights(json.sessionToken);
        }
      } catch (ex) {
        setSearching(false);
        setError(
          `Sorry, something happened and we couldnt do this search.code: 4 (status:${retry})`
        );
      }
    },
    [apiUrl, pollFlights]
  );

  const handleSort = (sortType: "best" | "cheapest" | "fastest") => {
    setSort(sortType);
  };

  const handleShowResults = (amount: number) => {
    setResults(amount);
  };

  useEffect(() => {
    query && handleSearch(query);
  }, [query, handleSearch]);

  return (
    <div className="flight-results">
      {searching && (
        <div className="loading">
          Searching for <b>Flights and the best prices</b>
          <Loading />
        </div>
      )}
      {error !== "" && <div className="error">{error}</div>}
      {search && (
        <div>
          <h2>
            Results {search.stats.total} - Lowest Price: {search.stats.minPrice}
          </h2>
          <div className="sort-buttons">
            <button
              className={sort === "best" ? "selected" : ""}
              onClick={() => handleSort("best")}
            >
              Best
            </button>
            <button
              className={sort === "cheapest" ? "selected" : ""}
              onClick={() => handleSort("cheapest")}
            >
              Cheapest
            </button>
            <button
              className={sort === "fastest" ? "selected" : ""}
              onClick={() => handleSort("fastest")}
            >
              Fastest
            </button>
          </div>
          {search.status !== "RESULT_STATUS_COMPLETE" && (
            <div className="loading">
              <>
                We are still searching for{" "}
                <b>More flights and the best prices</b>
                <Loading />
              </>
            </div>
          )}
          {search[sort].slice(0, results).map((itinerary) => {
            return (
              <div className="flight" key={itinerary.itineraryId}>
                <div className="hidden">
                  <div>id: {itinerary.itineraryId}</div>
                </div>
                <div className="flight-layout">
                  <div className="panel-legs">
                    {itinerary.legs.map((leg) => (
                      <div key={leg.id} className="panel-leg">
                        <div className="times">
                          <div className="time">{leg.departureTime}</div>
                          {leg.fromIata}
                        </div>
                        <div className="duration">
                          <div>
                            <div>
                              {leg.duration} minutes (
                              {leg.direct
                                ? "Direct"
                                : `${leg.stops} Stop${
                                    leg.stops > 1 ? "s" : ""
                                  }`}
                              )
                            </div>
                            <div className="flight-carrier">
                              {leg.carriers.map((carrier, key) => (
                                <>
                                  {carrier.imageUrl && carrier.imageUrl !== '' && (
                                    <img
                                      src={carrier.imageUrl}
                                      alt={`${carrier.name} logo`}
                                      height="13px"
                                    />
                                  )}
                                  <>{`${key > 0 ? ", " : ""}${carrier.name}`}</>
                                </>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="times">
                          <div className="time">{leg.arrivalTime}</div>
                          {leg.toIata}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="agent-images">
                    {itinerary.prices.map((price, key) => (
                      <span key={`${price.price}-${key}`}>
                        {price.deepLinks.map((deepLink) => (
                          <span key={deepLink.link}>
                            {deepLink.agentImageUrl !== "" && (
                              <img
                                height="30px"
                                src={deepLink.agentImageUrl}
                                alt={`${deepLink.agentName} logo`}
                                className="agent-image"
                              />
                            )}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                  <Prices url={url} flight={itinerary} query={query} />
                  <Link
                    to={`/booking/${url?.from}/${url?.to}/${url?.depart}${
                      url?.return ? `/${url?.return}` : ""
                    }/${itinerary.itineraryId}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
          <div className="paging-buttons">
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
