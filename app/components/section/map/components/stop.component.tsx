import { FaAngleDown, FaAngleUp, FaPlaneDeparture } from "react-icons/fa";
import { MdLocalAirport } from "react-icons/md";
import { Loading } from "~/components/ui/loading";
import { SearchDrawer } from "~/components/ui/drawer/drawer-search";
import { FlightResultsDefault } from "../../flight-results/flight-results-default";
import { getDateYYYYMMDDToDisplay } from "~/helpers/date";
import type { Place } from "~/helpers/sdk/place";
import type { TripPrice } from "../map-planner";
import type { FlightSDK } from "~/helpers/sdk/flight/flight-functions";
import { useState } from "react";
import { LocationPlaces } from "~/components/ui/location-places";

interface PlannerStopProps {
  stop: Place;
  first: boolean;
  last: boolean;
  days: number;
  apiUrl: string;
  googleApiKey: string;
  googleMapId: string;
  selected?: FlightSDK;
  price?: TripPrice;
}

export const PlannerStop = ({
  stop,
  first,
  last,
  days,
  apiUrl,
  googleApiKey,
  googleMapId,
  selected,
  price,
}: PlannerStopProps) => {
  const [showCity, setShowCity] = useState(false);
  return (
    <div className="border-b-slate-700 border-b-2 py-6">
      <div className="px-4 grid grid-cols-3 items-center gap-4">
        <div className="flex gap-2 items-center">
          <MdLocalAirport />
          <div>
            <div>
              {stop.name} ({stop.iata}){" "}
            </div>
            <div className="text-slate-400 text-sm">
              {price?.query.depart ? (
                <>
                  {getDateYYYYMMDDToDisplay(price?.query.depart, "ddd, D MMM")}{" "}
                  {first || last ? "" : <>({days} days)</>}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div>
          {price ? (
            <>
              {price.loading ? (
                <div className="inline-block text-slate-400 text-sm">
                  <Loading height="5" />
                </div>
              ) : (
                <>
                  <div className="text-slate-400">
                    {selected ? (
                      <>
                        {price.price}
                        <div className="text-sm">
                          <FaPlaneDeparture className="inline-block mr-1" />
                          {selected.isDirectFlights
                            ? "Direct"
                            : `${selected.legs[0].stops} Stops`}{" "}
                          {selected.legs[0].departureTime}
                        </div>
                      </>
                    ) : (
                      <>{price.price ? price.price : "No flights found"}</>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="flex">
          {price && !price.loading ? (
            <>
              <SearchDrawer keepMounted={false}>
                <div className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap">
                  See Search
                </div>
                <div className="p-9 max-w-screen-md xl:p-9 xl:mx-auto">
                  <FlightResultsDefault
                    flights={price.search}
                    filters={{}}
                    query={price.query}
                    apiUrl={apiUrl}
                    googleApiKey={googleApiKey}
                    googleMapId={googleMapId}
                    loading={false}
                    headerSticky={false}
                  />
                </div>
              </SearchDrawer>
            </>
          ) : (
            ""
          )}
          {!last && !first ? (
            <div
              className="justify-center cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center whitespace-nowrap"
              onClick={() => setShowCity(!showCity)}
            >
              {showCity ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {showCity ? (
        <div className="py-4">
          <div className="pb-2 text-sm text-slate-500">[coming soon, still working on it 👷‍♂️]</div>
          <div className="pb-2">Explore {stop.name}</div>
          <LocationPlaces />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};