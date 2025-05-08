import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { LoaderFunction } from "storybook/internal/types";
import type { PlaceGoogle } from "~/components/section/map/map-planner";
import { WhatToDoMap } from "~/components/section/what-to-do/what-to-do-map";
import type { WhatToDoPlace } from "~/components/section/what-to-do/what-to-do-map";
import { Layout } from "~/components/ui/layout/layout";
import { Location } from "~/components/ui/location";
import { LocationPlaces } from "~/components/ui/location-places";
import { generateCanonicalUrl } from "~/helpers/canonical-url";
import { getCommonMeta } from "~/helpers/meta";
import { Place } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    {
      title: `What to do | Flights.owenmerry.com`,
    },
    {
      name: "description",
      content: `Collection of places to visit in the city`,
    },
    { tagName: "link", rel: "canonical", href: data.canonicalUrl },
    ...getCommonMeta(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const canonicalUrl = generateCanonicalUrl({
    origin: url.origin,
    path: url.pathname,
    queryParams,
  });

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    canonicalUrl,
  };
};

export default function WhatToDo() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
  } = useLoaderData();
  const [mapLocation, setMapLocation] = useState<Place | undefined>(undefined);
  const [places, setPlaces] = useState<WhatToDoPlace[]>([]);

  const handlePlaceSelect = ({ placeGoogle }: { placeGoogle: PlaceGoogle }) => {
    setPlaces((prevPlaces) => {
      const existingPlace = prevPlaces.find(
        (place) => place.place.id === placeGoogle.id
      );
      if (existingPlace) {
        return prevPlaces;
      }
      const newPlace = {
        place: placeGoogle,
        fullPrice: 0,
      };
      return [...prevPlaces, newPlace];
    });
  };

  const handleMapLocationSelect = ( value: string, iataCode: string, place: Place ) => {
    setMapLocation(place);
  };
  const saveTrip = async () => {
    const trip = await skyscanner().tripDetails({apiUrl, id: ''}).createTrip({
      apiUrl,
      cityEntityId: "1234567",
      trip: {
        inside: '',
      },
    });
    console.log(trip);
  };
  const getTrip = async () => {
    const trip = await skyscanner().tripDetails({apiUrl, id: ''}).getTrip({
      apiUrl,
      id: "2",
    });
    console.log(trip);
  };

  return (
    <div>
      <Layout apiUrl={apiUrl} selectedUrl="/search">
        <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Trip Location</h2>
            <div className="mb-4">
              <Location apiUrl={apiUrl} onSelect={handleMapLocationSelect} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">What to do</h2>
            <div className="mb-4">
              <LocationPlaces apiUrl={apiUrl} onSelect={handlePlaceSelect} place={mapLocation}  />
            </div>
          </div>
          <WhatToDoMap
            googleApiKey={googleApiKey}
            googleMapId={googleMapId}
            places={places}
            mapLocation={mapLocation}
          />
        </div>
        <div onClick={saveTrip}>Save</div>
        <div onClick={getTrip}>Get</div>
      </Layout>
    </div>
  );
}
