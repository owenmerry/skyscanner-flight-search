import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";
import {
  MapControls,
  MapControlsOptions,
  MapControlsProps,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import { getAllParents } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { getPlacesFromIatas, type Place } from "~/helpers/sdk/place";
import { FaMapMarkerAlt } from "react-icons/fa";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import moment from "moment";
import { Location } from "~/components/ui/location";
import { addToTrip, placesToMarkers } from "~/helpers/map-controls";
import { MdLocalAirport } from "react-icons/md";
import { QueryPlace } from "~/types/search";
import { queryToString } from "~/helpers/sdk/query";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { Loading } from "~/components/ui/loading";
import { useSearchParams } from "@remix-run/react";
import { waitSeconds } from "~/helpers/utils";

interface TripPrice {
  query: QueryPlace;
  price?: string;
  search?: SearchSDK;
  loading: boolean;
}

interface MapPlannerProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  level?: "city" | "country" | "continent" | "everywhere";
  apiUrl: string;
}
export const MapPlanner = ({
  apiUrl,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: MapPlannerProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [mapControls, setMapControls] = useState<{
    map: google.maps.Map;
    controls: MapControlsOptions;
  }>();
  const [mapRefs, setMapRefs] = useState<
    (google.maps.Polyline | google.maps.marker.AdvancedMarkerElement)[]
  >([]);
  const [searchRefs, setSearchRefs] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const queryTrip = getPlacesFromIatas(searchParams.get("trip") !== '' ? searchParams.get("trip")?.split(" ") : []);
  const [stops, setStops] = useState<Place[]>(queryTrip);
  const [prices, setPrices] = useState<TripPrice[]>([]);
  const pricesRef = useRef<TripPrice[]>([]);
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
  const [selected, setSelected] = useState<IndicativeQuotesSDK>();
  const parents = to ? getAllParents(to.parentId) : [];
  const getMarkers = (search: IndicativeQuotesSDK[]): Markers[] => {
    const markers: Markers[] = [];

    //locations
    const searchFiltered = search.filter((item) =>
      to ? item.parentsString.includes(to.entityId) : true
    );
    for (const flight of searchFiltered) {
      const check = markers.filter(
        (item) =>
          item.location.lat === flight.query.to.coordinates.latitude &&
          item.location.lng === flight.query.to.coordinates.longitude
      );
      if (check.length === 0) {
        markers.push({
          location: {
            lat: flight.query.to.coordinates.latitude,
            lng: flight.query.to.coordinates.longitude,
          },
          label: `
              <div class="group/marker relative bg-blue-600 p-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-2xl transition">
              <div class=" text-white text-sm text-center">
               <svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448 336v-40L288 192V79.2c0-17.7-14.8-31.2-32-31.2s-32 13.5-32 31.2V192L64 296v40l160-48v113.6l-48 31.2V464l80-16 80 16v-31.2l-48-31.2V288l160 48z"></path></svg>
                <div class='font-bold'>${flight.price.display}</div>
              </div>
              <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-blue-600 group-hover/marker:bg-blue-700 transition"></div>
              </div>`,
          link: `/search/${flight.query.from.iata}/${flight.query.to.iata}/${flight.query.depart}/${flight.query.return}`,
          icon: "\ue539",
        });
      }
    }

    return markers;
  };

  const addSearchMarkers = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from:
          stops.length > 0 ? stops[stops.length - 1].entityId : from.entityId,
        to: "anywhere",
        tripType: "return",
      },
      groupType: "month",
      month: Number(moment().format("MM")),
      year: Number(moment().format("YYYY")),
      endMonth: Number(moment().add(10, "months").format("MM")),
      endYear: Number(moment().add(10, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    setSearch(indicativeSearch.quotes);
    const markers = getMarkers(indicativeSearch.quotes);
    const updateMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    markers.forEach(async (marker) => {
      if (!mapControls?.controls?.addMarker) return;
      const markerRef = await mapControls.controls.addMarker(
        mapControls.map,
        marker,
        () => handleMarkerClick(marker, indicativeSearch.quotes)
      );
      updateMarkers?.push(markerRef);
    });
    console.log(updateMarkers);
    setSearchRefs(updateMarkers);
  };

  const handleMarkerClick = (
    marker: MapMarker,
    search: IndicativeQuotesSDK[]
  ) => {
    if (!search) return;
    const quote = search.filter((quote) => {
      const isSameLat =
        quote.query.to.coordinates.latitude === marker.location.lat;
      const isSameLng =
        quote.query.to.coordinates.longitude === marker.location.lng;

      return isSameLat && isSameLng;
    });
    if (quote.length === 0) return;

    setSelected(quote[0]);
  };

  const handleRefresh = () => {
    if(!mapControls) return;
    mapRefs.forEach((mapRef) => {
      if (!("setMap" in mapRef)) return;
      mapRef.setMap(null);
    });
    setMapRefs([]);
    setPrices([]);
    pricesRef.current = [];
    clearSearch();
    setLocationsOnStart({ mapControls });
  }
  const handleMapLoaded: MapControlsProps["onMapLoaded"] = (map, options) => {
    if (!options) return;
    const mapControls = { map, controls: options };
    setMapControls(mapControls);
    setLocationsOnStart({ mapControls });
  };

  const clearTrip = () => {
    if (!mapControls) return;
    mapRefs.forEach((mapRef) => {
      if (!("setMap" in mapRef)) return;
      mapRef.setMap(null);
    });
    setStops([]);
    setMapRefs([]);
    setPrices([]);
    setQueryString([]);
    pricesRef.current = [];
    clearSearch();
  };
  const clearSearch = () => {
    if (!mapControls) return;
    searchRefs.forEach((searchRef) => {
      searchRef.map = null;
    });
    setSearchRefs([]);
  };

  const setQueryString = (stops: Place[]) => {
    let newParams = new URLSearchParams(searchParams);
    newParams.set("trip", stops.map((stop) => stop.iata).join(" "));
    setSearchParams(newParams);
  };

  const setLocationsOnStart = async ({mapControls} : {
    mapControls: {
      map: google.maps.Map;
      controls: MapControlsOptions;
    };
  }) => {
    if (stops.length <= 1) return;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const previous = stops[i - 1];
      const refs = await addToTrip({
        previous,
        current: stop,
        mapControls,
        handleMarkerClick: () => {},
      });
      updateRefs([refs?.lineRef, refs?.markerRef]);
    }
    if (mapControls.controls.fitMapToBounds) {
      mapControls.controls.fitMapToBounds(
        mapControls.map,
        placesToMarkers(stops)
      );
    }

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const previous = stops[i - 1];
      if (previous) {
        //await waitSeconds(1);
        getPrice({
          query: {
            from: previous,
            to: stop,
            depart: "2024-12-01",
          },
        });
      }
    }
  };
  const handleLocationChange = async (place: Place, previousStop?: Place) => {
    if (!mapControls) return;
    const stopsBefore = stops;
    const hasStopsBefore = stopsBefore.length > 0;
    const previous = stops.length > 0 ? stops[stops.length - 1] : undefined;
    const refs = await addToTrip({
      previous,
      current: place,
      mapControls,
      handleMarkerClick: () => {},
    });
    if (mapControls.controls.fitMapToBounds) {
      mapControls.controls.fitMapToBounds(
        mapControls.map,
        placesToMarkers([...stops, place])
      );
    }
    updateRefs([refs?.lineRef, refs?.markerRef]);
    setStops([...stops, place]);
    setQueryString([...stops, place]);
    clearSearch();
    if (hasStopsBefore) {
      getPrice({
        query: {
          from: stopsBefore[stopsBefore.length - 1],
          to: place,
          depart: "2024-12-01",
        },
      });
    }
  };

  const getPrice = async ({
    query,
  }: {
    query: QueryPlace;
  }) => {
    const pricesSaved: TripPrice[] = pricesRef.current;
    setPrices([...pricesSaved, { query, loading: true }]);
    pricesRef.current = [...pricesSaved, { query, loading: true }];
    const search = await skyscanner().flight().createAndPoll({
      apiUrl,
      query,
    });
    const pricesUpdated = pricesRef.current.map((price) => {
      if (queryToString(query) === queryToString(price.query)) {
        return {
          query: price.query,
          price: search?.stats.minPrice,
          search,
          loading: false,
        };
      }
      return price;
    });
    setPrices(pricesUpdated);
    pricesRef.current = pricesUpdated;

    return pricesUpdated;
  };

  const updateRefs = (
    refs: (
      | google.maps.Polyline
      | google.maps.marker.AdvancedMarkerElement
      | undefined
    )[]
  ) => {
    const updateRefs: (
      | google.maps.Polyline
      | google.maps.marker.AdvancedMarkerElement
    )[] = [];
    refs.forEach((ref) => {
      if (ref) {
        console.log("added ref");
        updateRefs.push(ref);
      }
    });
    setMapRefs([...mapRefs, ...updateRefs]);
  };

  return (
    <div className="md:grid grid-cols-10">
      <div className="p-4 col-span-4 overflow-y-scroll">
      <div className="flex overflow-y-scroll scrollbar-hide gap-2 py-3">
          <div
            className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
            onClick={clearTrip}
          >
            <FaMapMarkerAlt className="pr-2 text-lg" />
            <span>Clear Trip</span>
          </div>
          <div
            className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
            onClick={clearSearch}
          >
            <FaMapMarkerAlt className="pr-2 text-lg" />
            <span>Clear Search</span>
          </div>
          <div
            className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
            onClick={addSearchMarkers}
          >
            <FaMapMarkerAlt className="pr-2 text-lg" />
            <span>See Everywhere</span>
          </div>
          <div
            className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
            onClick={handleRefresh}
          >
            <FaMapMarkerAlt className="pr-2 text-lg" />
            <span>Refresh</span>
          </div>
        </div>

        {stops.map((stop, key) => {
          const previous = stops[key - 1];
          const price = previous
            ? prices.filter(
                (price) =>
                  price.query.from.entityId === previous.entityId &&
                  price.query.to.entityId === stop.entityId
              )[0]
            : undefined;
          return (
            <div
              key={`${stop.entityId}_${key}`}
              className="py-6 px-4 border-b-slate-700 grid grid-cols-3 items-center gap-2"
            >
              <div>
                <MdLocalAirport className="inline-block mr-2" />
                {stop.name} ({stop.iata}){" "}
              </div>
              <div>
                {price ? (
                  <>
                    {price.loading ? (
                      <div className="inline-block">
                        <Loading height="5" />
                      </div>
                    ) : (
                      <>
                        <div className="text-slate-400">
                          {price.price}
                          <div className="text-sm">
                            {price.search?.cheapest.length} Results
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
              <div>
                {price && !price.loading ? (
                  <>
                    <a
                      className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                      href={`/search/${price.query.from.iata}/${price.query.to.iata}/${price.query.depart}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      See Search
                    </a>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}

        <Location
          name={stops.length === 0 ? "Fly from" : "Fly to"}
          clearOnSelect={true}
          apiUrl={apiUrl}
          onSelect={(value, iataCode, place) => handleLocationChange(place)}
        />

        {stops.length > 1 ? (
          <div className="text-2xl font-bold py-2">
            Total: £
            {prices.reduce(
              (sum, current) =>
                sum +
                (current.search?.stats.minPriceRaw
                  ? Number(current.search?.stats.minPriceRaw)
                  : 0),
              0
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="relative col-span-6">
        {selected ? (
          <div className="absolute bottom-0 left-0 h-64 z-20 overflow-y-auto p-4 w-full">
            <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold overflow-hidden w-full h-full">
              {/* <div
                className="h-64 bg-cover"
                style={{
                  backgroundImage: `url(${selected.country.images[0]})`,
                }}
              ></div> */}
              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {selected.city?.name}, {selected.country.name}
                </h2>
                <p>{selected.price.display}</p>
                <a
                  href={`/search/${selected.query.from.iata}/${selected.query.to.iata}/${selected.query.depart}/${selected.query.return}`}
                  className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                >
                  <span>See Deal {selected.price.display}</span>
                </a>
                <div
                  className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                  onClick={() => {
                    handleLocationChange(selected.query.to);
                    setSelected(undefined);
                  }}
                >
                  <FaMapMarkerAlt className="pr-2 text-lg" />
                  <span>Add to trip</span>
                </div>
                <a
                  href={`/country/${selected.country.slug}`}
                  className="justify-center  mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                >
                  <FaMapMarkerAlt className="pr-2 text-lg" />
                  Explore {selected.country.name}
                </a>
                {selected.city ? (
                  <a
                    href={`/city/${selected.country.slug}/${selected.city.slug}`}
                    className="justify-center  mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                  >
                    <FaMapMarkerAlt className="pr-2 text-lg" />
                    Explore {selected.city.name}
                  </a>
                ) : (
                  ""
                )}
                <div className="absolute top-0 right-0 p-2">
                  <div
                    onClick={() => setSelected(undefined)}
                    className=" justify-center  mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                  >
                    Close
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <Wrapper apiKey={googleApiKey}>
          <MapControls
            googleMapId={googleMapId}
            center={{
              lat: to ? to.coordinates.latitude : from.coordinates.latitude,
              lng: to ? to.coordinates.longitude : from.coordinates.longitude,
            }}
            height="100vh"
            zoom={level === "everywhere" ? 5 : 0}
            fitAddress={
              to
                ? `${to?.name}${parents[0] ? `, ${parents[0].name}` : ""}`
                : `${getAllParents(from.parentId)[0]}`
            }
            onMapLoaded={(map, options) => handleMapLoaded(map, options)}
          />
        </Wrapper>
      </div>
    </div>
  );
};
