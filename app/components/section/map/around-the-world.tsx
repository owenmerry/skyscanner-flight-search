import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useRef, useState } from "react";
import { MapControls } from "~/components/ui/map/map-control.component";
import type {
  MapControlsOptions,
  MapControlsProps,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import {
  getAllParents,
  getCityEntityId,
  getCityPlaceFromEntityId,
} from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { getPlacesFromIatas, type Place } from "~/helpers/sdk/place";
import { FaMapMarkerAlt } from "react-icons/fa";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import moment from "moment";
import { Location } from "~/components/ui/location";
import { addToTrip } from "~/helpers/map-controls";
import type { QueryPlace } from "~/types/search";
import { queryToString } from "~/helpers/sdk/query";
import type { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { useSearchParams } from "@remix-run/react";
import { DateSelector } from "~/components/ui/date/date-selector";
import { PlannerStop } from "./components/stop.component";
import { MapDrawer } from "~/components/ui/drawer/drawer-map";
import { getBearingBetweenPoints } from "./helpers/bearing";
import { waitSeconds } from "~/helpers/utils";

export interface TripPrice {
  query: QueryPlace;
  price?: string;
  search?: SearchSDK;
  loading: boolean;
}

export interface Holiday {
  name?: string;
  locations: HolidayLocation[];
}
export interface HolidayLocation {
  cityId: string;
  flight?: TripPrice;
  placesGoogle: PlaceGoogle[];
}
export interface PlaceGoogle {
  id: string;
  name: string;
  types: string[];
  images: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface AroundTheWorldProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  level?: "city" | "country" | "continent" | "everywhere";
  apiUrl: string;
}
export const AroundTheWorld = ({
  apiUrl,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: AroundTheWorldProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [mapControls, setMapControls] = useState<{
    map: google.maps.Map;
    controls: MapControlsOptions;
  }>();
  const mapRefs = useRef<
    (google.maps.Polyline | google.maps.marker.AdvancedMarkerElement)[]
  >([]);
  const [searchRefs, setSearchRefs] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const queryTrip = getPlacesFromIatas(["LON"]);
  const queryStartDate =
    searchParams.get("startDate") !== ""
      ? searchParams.get("startDate")
      : undefined;
  const queryDays =
    searchParams.get("days") !== ""
      ? Number(searchParams.get("days"))
      : undefined;
  const defaultHoliday: Holiday = {
    name: "My Holiday",
    locations: queryTrip.map((item) => ({
      cityId: item.entityId,
      placesGoogle: [],
    })),
  };
  const [holiday, setHoliday] = useState<Holiday>(defaultHoliday);
  const [stops, setStops] = useState<Place[]>(queryTrip);
  const [gameMode, setGameMode] = useState<"start" | "playing" | "end">(
    "start"
  );
  const [prices, setPrices] = useState<number[]>([]);
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
  const [selected, setSelected] = useState<IndicativeQuotesSDK>();
  const [days] = useState<number>(queryDays || 3);
  const [startDate, setStartDate] = useState<string>(
    queryStartDate || "2024-12-01"
  );
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const parents = to ? getAllParents(to.parentId) : [];
  const priceTotal = prices.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );
  const locationCity = getCityPlaceFromEntityId(
    stops[stops.length - 1].entityId
  );
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

  const addSearchMarkers = async ({
    stopBefore,
    mapControls,
  }: {
    stopBefore?: Place;
    mapControls?: {
      map: google.maps.Map;
      controls: MapControlsOptions;
    };
  } = {}) => {
    if (!mapControls) return;
    console.log("stop before", stopBefore);
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: stopBefore?.entityId || "",
        to: "anywhere",
        tripType: "single",
      },
      groupType: "month",
      month: Number(moment().format("MM")),
      year: Number(moment().format("YYYY")),
      endMonth: Number(moment().add(3, "months").format("MM")),
      endYear: Number(moment().add(3, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    setSearch(indicativeSearch.quotes);
    let markers = getMarkers(indicativeSearch.quotes);
    if (stopBefore) {
      markers = markers.filter((item) => {
        return (
          getBearingBetweenPoints(
            {
              lat: stopBefore.coordinates.latitude,
              lng: stopBefore.coordinates.longitude,
            },
            { lat: item.location.lat, lng: item.location.lng }
          ) < 180
        );
      });
    }
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

    // handleLocationChange(quote[0].query.to);
    // setSelected(undefined);
    //handleLocationChange(quote[0]);

    setSelected(quote[0]);
  };

  const handleMapLoaded: MapControlsProps["onMapLoaded"] = async (
    map,
    options
  ) => {
    if (!options) return;
    const mapControls = { map, controls: options };
    setMapControls(mapControls);
    setLocationsOnStart({ mapControls, startDate });
  };
  const clearSearch = () => {
    if (!mapControls) return;
    searchRefs.forEach((searchRef) => {
      searchRef.map = null;
    });
    setSearchRefs([]);
  };

  const setLocationsOnStart = async ({
    mapControls,
    startDate,
  }: {
    mapControls: {
      map: google.maps.Map;
      controls: MapControlsOptions;
    };
    startDate: string;
  }) => {
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
    addSearchMarkers({ stopBefore: stops[stops.length - 1], mapControls });
  };
  const handleLocationChange = async (
    selected: IndicativeQuotesSDK,
    previousStop?: Place
  ) => {
    if (!mapControls) return;
    const place = selected.query.to;
    const previous = stops.length > 0 ? stops[stops.length - 1] : undefined;
    const refs = await addToTrip({
      previous,
      current: place,
      mapControls,
      handleMarkerClick: () => {},
      moveTo: false,
    });
    const updatedPrices = [...prices, selected.price.raw || 0];
    const priceTotal = updatedPrices.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );
    const gameOver = priceTotal > 1000;
    updateRefs([refs?.lineRef, refs?.markerRef]);
    setStops([...stops, place]);
    setPrices(updatedPrices);
    setHoliday({
      name: holiday.name,
      locations: [
        ...holiday.locations,
        { cityId: place.entityId, placesGoogle: [] },
      ],
    });
    clearSearch();
    if (gameOver) {
      setGameMode("end");
      return;
    }
    addSearchMarkers({ stopBefore: place, mapControls });
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
    const previous = mapRefs.current;
    mapRefs.current = [...previous, ...updateRefs];
  };

  const startGame = async () => {
    if (!mapControls) return;
    setGameMode("playing");
  };
  const restartGame = async () => {
    if (!mapControls) return;
    mapRefs.current.forEach((mapRef) => {
      if (!("setMap" in mapRef)) return;
      mapRef.setMap(null);
    });
    setStops(queryTrip);
    mapRefs.current = [];
    setPrices([]);
    clearSearch();
    setGameMode("start");
    const refs = await addToTrip({
      previous: undefined,
      current: queryTrip[0],
      mapControls,
      handleMarkerClick: () => {},
    });
    updateRefs([refs?.lineRef, refs?.markerRef]);
    addSearchMarkers({ stopBefore: queryTrip[0], mapControls });
  };

  return (
    <div className="relative">
      <div className="h-screen">
        {gameMode !== "playing" ? (
          <>
            <div className="opacity-80 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-30"></div>
            <div className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold p-10 text-center shadow-lg">
                {gameMode == "start" ? (
                  <>
                    {" "}
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none mb-2">
                      Around The World
                    </h1>
                    <p className="text-lg my-4">
                      Your mission is simple: travel the globe, visiting amazing
                      destinations while staying within a strict budget of
                      £1,000.
                    </p>
                    <button
                      className="inline-block p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                      onClick={startGame}
                    >
                      Start Game
                    </button>
                  </>
                ) : (
                  ""
                )}
                {gameMode === "end" ? (
                  <>
                    {priceTotal > 1000 ? (
                      <>
                        <h1 className="text-6xl font-extrabold tracking-tight leading-none mb-2">
                          Oh no. You ran out of money
                        </h1>
                        <p className="text-lg py-2">
                          Looks like you will be staying in{" "}
                          <span className="bold">{locationCity ? locationCity.name : ""}</span> for now.
                        </p>
                        <button
                          className="inline-block p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                          onClick={restartGame}
                        >
                          Try Again
                        </button>
                      </>
                    ) : (
                      <>
                        <h1 className="text-6xl font-extrabold tracking-tight leading-none mb-2">
                          You made it
                        </h1>
                        <button
                          className="inline-block p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                          onClick={restartGame}
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <div className="absolute top-0 left-0 h-64 z-20 overflow-y-auto p-4">
          <div className="flex gap-2">
            <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold p-4">
              <div className="text-lg bold">Total £{priceTotal}</div>
              {priceTotal !== 0 ? (
                <div className="text-slate-500 pt-2">
                  £{1000 - priceTotal} Left
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {gameMode === "playing" && stops.length === 1 ? (
                <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold p-4">
                  <div className="text-lg bold">Select a location</div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {selected ? (
          <>
            <div onClick={() => setSelected(undefined)} className="opacity-80 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-30"></div>
            <div className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold overflow-hidden w-80 h-full">
                <div className="p-4">
                  <h2 className="text-4xl font-extrabold tracking-tight leading-none mb-2">
                    {selected.city?.name}, {selected.country.name}
                  </h2>
                  <p className="text-lg py-2">{selected.price.display}</p>
                  <div
                    className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                    onClick={() => {
                      handleLocationChange(selected);
                      setSelected(undefined);
                    }}
                  >
                    <FaMapMarkerAlt className="pr-2 text-lg" />
                    <span>Add to trip</span>
                  </div>
                </div>
              </div>
            </div>
          </>
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
