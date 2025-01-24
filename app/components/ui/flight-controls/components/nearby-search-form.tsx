import { useState } from "react";
import { Form } from "@remix-run/react";
import type { Query } from "~/types/search";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { Loading } from "~/components/ui/loading/loading.component";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId, getPlaceFromIata } from "~/helpers/sdk/place";
import { LocationPlaces } from "../../location-places";
import { Location } from "../../location";
import { PlaceGoogle } from "~/components/section/map/map-planner";

interface NearbySearchFormProps {
  apiUrl?: string;
  flightDefault?: Query;
  from?: Place;
  hasBackground?: boolean;
}
export const NearbySearchForm: React.FC<NearbySearchFormProps> = ({
  apiUrl = "",
  flightDefault,
  from,
  hasBackground = true,
}) => {
  const defaultQuery: Query = flightDefault
    ? flightDefault
    : getDefualtFlightQuery({ from });
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [nearbyPlace, setNearbyPlace] = useState<PlaceGoogle>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFromLocationChange = (
    value: string,
    key: string,
    iataCode: string
  ) => {
    const place = getPlaceFromIata(iataCode);
    setQuery({
      ...query,
      [`${key}`]: value,
      [`${key}Iata`]: iataCode,
      [`${key}Text`]: place && "iata" in place ? place.name : "",
    });
  };

  const handleNearbyLocationChange = (
    value: PlaceGoogle
  ) => {
    setNearbyPlace(value);
  };

  return (
    <Form
      method="post"
      className={`grid items-center gap-y-4 w-full rounded lg:flex lg:gap-4 ${
        hasBackground ? `dark:bg-gray-800 bg-white` : ""
      }`}
    >
      <input
        type="hidden"
        name="from"
        value={JSON.stringify(getPlaceFromEntityId(query.from))}
      />
      <input
        type="hidden"
        name="to"
        value={JSON.stringify(getPlaceFromEntityId(query.from))}
      />
      <input
        type="hidden"
        name="nearby"
        value={nearbyPlace?.name}
      />
      <input type="hidden" name="search" value={"nearby"} />
      <div className="relative">
        <Location
          name="From"
          defaultValue={query.fromText}
          apiUrl={apiUrl}
          onSelect={(value, iataCode) =>
            handleFromLocationChange(value, "from", iataCode)
          }
        />
      </div>
      <div className="relative font-bold whitespace-nowrap">Nearby</div>
      <div className="relative">
        <LocationPlaces
          name="From"
          defaultValue={nearbyPlace?.name}
          apiUrl={apiUrl}
          onSelect={(googlePlace) => handleNearbyLocationChange(googlePlace.placeGoogle)}
        />
      </div>
      <button
        className="justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
        type="submit"
        onClick={() => setLoading(true)}
      >
        {loading ? (
          <>
            <span>
              <Loading light height="5" aria-label="Spinner button example" />
            </span>
            <span className="pl-3">Loading...</span>
          </>
        ) : (
          <>
            <span>
              <svg
                className="w-5 h-5 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </span>
            <span className="pl-3 font-semibold">Search</span>
          </>
        )}
      </button>
    </Form>
  );
};
