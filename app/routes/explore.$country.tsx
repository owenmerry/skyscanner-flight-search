import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Place } from "~/helpers/sdk/place";
import {
  getPlaceFromSlug,
  getGeoList,
  getGeo,
  getPlaceFromIata,
} from "~/helpers/sdk/place";
import { Layout } from "~/components/ui/layout/layout";
import { Map } from "~/components/map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { getMarkersCountry } from "~/helpers/map";
import { SEO } from "~/components/SEO";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { HeroExplore } from "~/components/ui/hero/hero-explore";
import { ImagesDefault } from "~/components/ui/images/images-default";
import { getDefualtFlightQuery } from "~/helpers/sdk/flight";
import { ExploreEverywhere } from "~/components/ui/page/explore";
import { SkyscannerAPIIndicativeResponse } from "~/helpers/sdk/indicative/indicative-response";
import { useEffect, useState, useRef } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import Calendar from "~/components/ui/calender/calender";
import { getSearchWithCreateAndPoll } from "~/helpers/sdk/query";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const country = getPlaceFromSlug(params.country || "", "PLACE_TYPE_COUNTRY");
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
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
    cities,
    airports,
  });
};

export default function SEOAnytime() {
  const {
    apiUrl,
    googleApiKey,
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
  } = useLoaderData();
  const from = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");
  const query = {
    from: from ? from.entityId : "",
    to: country.entityId,
    month: String(new Date().getMonth() + 1),
    endMonth: new Date().getMonth() + 1,
    groupType: "month",
  };
  const defaultSearch = getDefualtFlightQuery();
  const [searchIndicative, setSearchIndicative] =
    useState<SkyscannerAPIIndicativeResponse>();
  const [prices, setPrices] = useState<{ price: string; date: string }[]>([]);
  const [airport, setAirport] = useState<Place>(airports[0]);
  const previousInputValue = useRef<{ price: string; date: string }[]>([]);

  useEffect(() => {
    runIndicative();
  }, []);

  useEffect(() => {
    previousInputValue.current = prices;
  }, [prices]);

  const runIndicative = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from ? from.entityId : "",
        to: country.entityId,
        depart: "2023-09-01",
        return: "2023-09-20",
        tripType: "return",
      },
      month: Number("2023-09-01".split("-")[1]),
    });

    if ("error" in indicativeSearch.search) return;

    setSearchIndicative(indicativeSearch.search);
  };
  if (!from) return;

  const handlePriceAdd = async (dateSelected: string) => {
    const updatedPricesLoading = [
      ...prices.filter((price) => price.price !== dateSelected),
      {
        price: "loading...",
        date: dateSelected,
      },
    ];
    setPrices(updatedPricesLoading);

    const priceChecked = await getSearchWithCreateAndPoll(
      {
        from: from ? from.entityId : "",
        to: airport.entityId,
        depart: dateSelected,
      },
      {
        apiUrl,
      }
    );
    if (!priceChecked) return;
    const updatedPrices = [
      ...previousInputValue.current.filter(
        (price) => price.date !== dateSelected
      ),
      {
        price: priceChecked,
        date: dateSelected,
      },
    ];
    setPrices(updatedPrices);
  };
  const handleAirportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrices([]);
    setAirport(airports[Number(e.target.value)]);
  };

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={`Explore ${country.name}`}
        backgroundImage={country.images[0]}
      />

      <ImagesDefault images={country.images} />

      <ExploreEverywhere
        title={`${from.name} to ${country.name}`}
        from={from}
        search={searchIndicative}
        apiUrl={apiUrl}
      />

      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="text-3xl mb-6">Airports in {country.name}</h2>
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

      <div className="relative z-10 py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <div>
          <h2 className="text-3xl mb-6">Map</h2>
        </div>
        <Wrapper apiKey={googleApiKey}>
          <Map
            center={{
              lat: country.coordinates.latitude,
              lng: country.coordinates.longitude,
            }}
            zoom={5}
            markers={getMarkersCountry([...airports], from, defaultSearch)}
          />
        </Wrapper>

        <div className="py-10">
          <select className="text-black" onChange={handleAirportChange}>
            {airports.map((airport, key) => {
              return <option value={key}>{airport.name}</option>;
            })}
          </select>
          <Calendar
            onDateSelected={(dateSelected) => handlePriceAdd(dateSelected)}
            prices={prices}
          />
        </div>
      </div>
    </Layout>
  );
}
