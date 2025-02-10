import { useState } from "react";
import type { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { QueryPlace } from "~/types/search";
import { Loading } from "../loading";

interface ButtonLiveProps {
  query?: QueryPlace;
  apiUrl?: string;
}

export const ButtonLive = ({ query, apiUrl }: ButtonLiveProps) => {
  const [status, setStatus] = useState<
    "loading" | "havePrice" | "getPrice" | "error"
  >("getPrice");
  const [search, setSearch] = useState<SearchSDK>();
  if (!query || !apiUrl) return "";

  const getFlightPrices = async () => {
    setStatus("loading");
    const flightSearch = await skyscanner().flight().createAndPoll({
      query,
      apiUrl,
    });
    if (!flightSearch) {
      setStatus("error");
    } else {
      setStatus("havePrice");
      setSearch(flightSearch);
    }
  };

  return (
    <div>
      {status === "getPrice" ? (
        <div onClick={() => getFlightPrices()}>Get Price</div>
      ) : (
        ""
      )}
      {status === "loading" ? (
        <div className="text-center">
          <div className="inline-block">
            <Loading height="5" />
          </div>
        </div>
      ) : (
        ""
      )}
      {status === "havePrice" && search ? (
        <div onClick={() => getFlightPrices()}>{search.stats.minPrice}</div>
      ) : (
        ""
      )}
      {status === "error" ? (
        <div onClick={() => getFlightPrices()}>Price not found</div>
      ) : (
        ""
      )}
    </div>
  );
};
