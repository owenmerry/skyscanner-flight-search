import { useState } from "react";
import { Form } from "@remix-run/react";
import type { Query } from "~/types/search";
import { Loading } from "~/components/ui/loading/loading.component";
import type { Place } from "~/helpers/sdk/place";
import { LocationPlaces } from "../../location-places";
import type { PlaceGoogle } from "~/components/section/map/map-planner";

interface DirectionsSearchFormProps {
  apiUrl?: string;
  flightDefault?: Query;
  from?: Place;
  hasBackground?: boolean;
}
export const DirectionsSearchForm: React.FC<DirectionsSearchFormProps> = ({
  apiUrl = "",
  hasBackground = true,
}) => {
  const [query, setQuery] = useState<{
    from?: PlaceGoogle;
    to?: PlaceGoogle;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLocationChange = (value: PlaceGoogle, key: "from" | "to") => {
    console.log('handleChange', value);
    setQuery({
      ...query,
      [`${key}`]: value,
    });
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
        name="googlefrom"
        value={query?.from?.id}
        />
      <input
        type="hidden"
        name="googleto"
        value={query?.to?.id}
      />
      <input type="hidden" name="search" value={"directions"} />
      <div className="relative">
        <LocationPlaces
          name="googleFrom"
          placeholder="From"
          defaultValue={query?.from?.name}
          apiUrl={apiUrl}
          onSelect={(googlePlace) =>
            handleLocationChange(googlePlace.placeGoogle, "from")
          }
        />
      </div>
      <div className="relative font-bold whitespace-nowrap">To</div>
      <div className="relative">
      <LocationPlaces
          name="googleTo"
          placeholder="To"
          defaultValue={query?.to?.name}
          apiUrl={apiUrl}
          onSelect={(googlePlace) =>
            handleLocationChange(googlePlace.placeGoogle, "to")
          }
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
