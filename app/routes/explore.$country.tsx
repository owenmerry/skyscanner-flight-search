import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import {
  getPlaceFromSlug,
  getGeoList,
  getPlaceFromIata,
} from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { Map } from "~/components/ui/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersCountry } from "~/helpers/map";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { HeroExplore } from "~/components/section/hero/hero-explore";
import { ImagesDefault } from "~/components/section/images/images-default";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { ExploreEverywhere } from "~/components/section/explore/explore-everywhere";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { CalenderSearch } from "~/components/section/calender-search/calender-search";
import { Breadcrumbs } from "~/components/section/breadcrumbs/breadcrumbs.component";
import { QueryPlace } from "~/types/search";
import { ExploreGraph } from "~/components/section/explore/explore-graph";
import { Location } from "~/components/ui/location";
import { ToggleSwitch } from "flowbite-react";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const places = getGeoList();
  const countryPlaces = places.filter(
    (place) =>
      country &&
      (place.parentId === country.entityId ||
        country.entityId === place.countryEntityId)
  );
  const cities = countryPlaces.filter(
    (place) => place.type === "PLACE_TYPE_CITY"
  );
  const airports = countryPlaces.filter(
    (place) => place.type === "PLACE_TYPE_AIRPORT"
  );

  return json({
    apiUrl,
    places: getGeoList(),
    params,
    country,
    googleApiKey,
    googleMapId,
    cities,
    airports,
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    googleApiKey,
    googleMapId,
    params,
    country,
    places,
    cities,
    airports,
  }: {
    apiUrl: string;
    params: {
      country: string;
    };
    country: Place;
    cities: Place[];
    places: Place[];
    airports: Place[];
    googleApiKey: string;
    googleMapId: string;
  } = useLoaderData();
  const [from, setFrom] = useState(
    getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR")
  );
  const [mode, setMode] = useState<"from" | "to">("to");
  const defaultSearch = getDefualtFlightQuery();
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [searchIndicativeDates, setSearchIndicativeDates] =
    useState<SkyscannerAPIIndicativeResponse>();

  useEffect(() => {
    runIndicative();
    runIndicativeDates();
  }, []);

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: country.entityId,
        tripType: "return",
      },
      month: Number("2023-12-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

    console.log(indicativeSearch.search);

    setSearchIndicative(indicativeSearch.search);
  };
  if (!from) return;

  const runIndicativeDates = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: airports[0].entityId,
        tripType: "single",
      },
      month: Number("2023-10-01".split("-")[1]),
      groupType: "date",
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicativeDates(indicativeSearch.search);
  };

  const flightQuery: QueryPlace = {
    from: from,
    to: airports[0],
    depart: "2023-10-01",
  };

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={`Explore ${country.name}`}
        backgroundImage={country.images[0]}
        apiUrl={apiUrl}
      />
      <Breadcrumbs
        items={[
          {
            name: "Explore",
            link: "/explore",
          },
          { name: country.name },
        ]}
      />

      <div className="relative z-5 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`/explore/to/${country.slug}`}
            className="rounded-lg dark:bg-slate-700 p-6 py-12 hover:dark:bg-slate-600 text-lg font-bold"
          >
            Travel To {country.name}
          </a>
          <a
            href={`/explore/from/${country.slug}`}
            className="rounded-lg dark:bg-slate-700 p-6 py-12 hover:dark:bg-slate-600 text-lg font-bold"
          >
            Travel From {country.name}
          </a>
        </div>
      </div>

      <ImagesDefault
        images={country.images}
        title={`Photos of ${country.name}`}
      />

      <ExploreGraph airports={airports} apiUrl={apiUrl} from={from} />

      {searchIndicative ? (
        <div className="relative py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
          <div>
            <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
              Locations in {country.name}
            </h2>
          </div>
          <Wrapper apiKey={googleApiKey}>
            <Map
              googleMapId={googleMapId}
              center={{
                lat: country.coordinates.latitude,
                lng: country.coordinates.longitude,
              }}
              zoom={5}
              markers={getMarkersCountry(
                [...airports],
                searchIndicative,
                from,
                defaultSearch
              )}
            />
          </Wrapper>
        </div>
      ) : (
        ""
      )}

      <div className="relative z-5 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
            Airports in {country.name}
          </h2>
        </div>
        <div className="grid sm:grid-cols-5 grid-cols-2">
          {airports
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((place) => {
              return (
                <div className="">
                  <Link
                    className="hover:underline"
                    to={`/search/${from ? from.iata : ""}/${place.iata}/${
                      defaultSearch.depart
                    }/${defaultSearch.return}`}
                  >
                    {place.name}
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
