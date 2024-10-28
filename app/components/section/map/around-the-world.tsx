import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useState } from "react";
import { MapControls } from "~/components/ui/map/map-control.component";
import type {
  MapControlsOptions,
  MapControlsProps,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import { getAllParents, getCityPlaceFromEntityId } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import {
  getPlaceFromEntityId,
  getPlacesFromIatas,
  type Place,
} from "~/helpers/sdk/place";
import { FaMapMarkerAlt, FaRegLightbulb, FaTrophy } from "react-icons/fa";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import moment, { Moment } from "moment";
import { addToTrip } from "~/helpers/map-controls";
import type { QueryPlace } from "~/types/search";
import type { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { useSearchParams } from "@remix-run/react";
import { getBearingBetweenPoints } from "./helpers/bearing";
import { BiWorld } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import AchievementNotification from "~/components/ui/game/AchievementNotification";

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
  let [searchParams] = useSearchParams();
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
  const [gameReason, setGameReason] = useState<"No flights">();
  const [leaderboardMode, setLeaderboardMode] = useState("left");
  const [leaderboard, setLeaderBoard] = useState<
    {
      name: string;
      award: string;
      amount: number;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [leaderboardClose, setLeaderBoardClose] = useState<
    {
      name: string;
      award: string;
      amount: number;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [showLeaderboard, setShowLeaderBoard] = useState<boolean>(false);
  const [gameName, setGameName] = useState<string>("");
  const [prices, setPrices] = useState<number[]>([]);
  const [selected, setSelected] = useState<IndicativeQuotesSDK>();
  const [flights, setFlights] = useState<IndicativeQuotesSDK[]>([]);
  const [viewingMarkers, setViewingMarkers] = useState<Markers[]>([]);
  const [startDate] = useState<string>(queryStartDate || "2024-12-01");
  const parents = to ? getAllParents(to.parentId) : [];
  const priceTotal = prices.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationAwardMessage, setNotificationAwardMessage] = useState("");

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };
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
    month,
  }: {
    month?: Moment;
    stopBefore?: Place;
    mapControls?: {
      map: google.maps.Map;
      controls: MapControlsOptions;
    };
  } = {}) => {
    if (!mapControls) return;
    console.log("stop before", stopBefore);
    const searchDate = month ? month : moment();
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: stopBefore?.entityId || "",
        to: "anywhere",
        tripType: "single",
      },
      groupType: "month",
      month: Number(searchDate.format("MM")),
      year: Number(searchDate.format("YYYY")),
      endMonth: Number(searchDate.add(3, "months").format("MM")),
      endYear: Number(searchDate.add(3, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    var date1 = moment("2023-10-18"); // Example date 1
    var date2 = moment("2024-01-01"); // Example date 2

    if (date2.isAfter(date1)) {
      console.log("Date 2 is after Date 1");
    } else {
      console.log("Date 2 is not after Date 1");
    }

    const quotesFilteredByDate = indicativeSearch.quotes.filter((item) =>
      searchDate.isAfter(moment(item.query.depart))
    );
    if (quotesFilteredByDate.length === 0) {
      setGameMode("end");
      setGameReason("No flights");
    }

    let markers = getMarkers(quotesFilteredByDate);
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
    setViewingMarkers(markers);
    if (markers.length === 0) setGameMode("end");
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
    const placeCity = getCityPlaceFromEntityId(place.entityId);
    const gameOver =
      priceTotal > 1000 || (placeCity && placeCity.iata === "LON");
    updateRefs([refs?.lineRef, refs?.markerRef]);
    setStops([...stops, place]);
    setPrices(updatedPrices);
    setFlights([...flights, selected]);
    setHoliday({
      name: holiday.name,
      locations: [
        ...holiday.locations,
        { cityId: place.entityId, placesGoogle: [] },
      ],
    });
    clearSearch();
    if ([...stops, place].length === 6 && !gameOver) {
      setNotificationAwardMessage("5 stopovers");
      triggerNotification();
    }
    if ([...stops, place].length === 11 && !gameOver) {
      setNotificationAwardMessage("10 stopovers");
      triggerNotification();
    }
    if (gameOver) {
      setGameMode("end");

      if (priceTotal < 1000) {
        const data = {
          name: gameName,
          stops: [...stops.map((item) => item.entityId), place.entityId].join(
            ","
          ),
        };

        await fetch(`${apiUrl}/game/won`, {
          method: "POST", // Method type
          headers: {
            "Content-Type": "application/json", // Tells the server you're sending JSON
          },
          body: JSON.stringify(data), // Convert the data to JSON string
        });
      }

      return;
    }
    addSearchMarkers({
      stopBefore: place,
      mapControls,
      month: moment(selected.query.depart),
    });
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
    setFlights([]);
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
    mapControls.map.panTo({
      lat: queryTrip[0].coordinates.latitude,
      lng: queryTrip[0].coordinates.longitude,
    });
    mapControls.map.setZoom(5);
  };
  const toggleLeaderBoard = async () => {
    if (!showLeaderboard) {
      const leaderboardRes = await fetch(`${apiUrl}/game/top/price-left`);
      const leaderboardJson = await leaderboardRes.json();
      const leaderboardCloseRes = await fetch(`${apiUrl}/game/top/price-close`);
      const leaderboardCloseJson = await leaderboardCloseRes.json();
      setLeaderBoard(leaderboardJson);
      setLeaderBoardClose(leaderboardCloseJson);
    }
    setShowLeaderBoard(!showLeaderboard);
  };

  return (
    <div className="relative">
      <div className="min-h-screen over">
        {gameMode !== "playing" || showLeaderboard ? (
          <>
            <div className="opacity-80 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-30"></div>
            <div className="absolute z-30 p-8 md:m-0 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[800px]">
              <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold p-10 text-center shadow-lg overflow-y-scroll max-h-screen">
                {showLeaderboard ? (
                  <>
                    <>
                      {" "}
                      <FaTrophy className="inline-block text-2xl text-blue-600" />
                      <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-none mb-2">
                        Leaderboard
                      </h1>
                      <div className="flex gap-2 justify-center">
                        <button
                          className={`inline-block p-2 ${
                            leaderboardMode === "left"
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-white hover:bg-blue-400 hover:text-white text-gray-700"
                          }  rounded-xl cursor-pointer text-xl `}
                          onClick={() => setLeaderboardMode("left")}
                        >
                          Top Budget Left
                        </button>
                        <button
                          className={`inline-block p-2 ${
                            leaderboardMode === "close"
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-white hover:bg-blue-400 hover:text-white text-gray-700"
                          }  rounded-xl cursor-pointer text-xl `}
                          onClick={() => setLeaderboardMode("close")}
                        >
                          Closest to £1000
                        </button>
                      </div>
                      <ul className="my-2">
                        {(leaderboardMode === "left"
                          ? leaderboard
                          : leaderboardClose
                        ).map((item) => {
                          return (
                            <li
                              key={item.created_at}
                              className="border-b-2 border-gray-300 py-2"
                            >
                              {item.name} - £{item.amount} Left
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        className="inline-block p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                        onClick={toggleLeaderBoard}
                      >
                        Hide
                      </button>
                    </>
                  </>
                ) : (
                  <>
                    {gameMode == "start" ? (
                      <>
                        {" "}
                        <BiWorld className="inline-block text-4xl text-blue-600" />
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none mb-2">
                          Around The World
                        </h1>
                        <p className="text-lg my-4">
                          Your mission is simple: travel the globe, visiting
                          amazing destinations while staying within a strict
                          budget of £1,000.
                        </p>
                        <div className="my-2">
                          <input
                            className="p-4 text-center border-gray-300 border-2"
                            placeholder="Add your Name.."
                            name="full name"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                          />
                        </div>
                        <button
                          className="inline-block disabled:bg-gray-400 p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                          onClick={startGame}
                          disabled={gameName === ""}
                        >
                          Start Game{" "}
                          {gameName === "" ? <>(Add your name)</> : ""}
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                    {gameMode === "end" ? (
                      <>
                        {priceTotal > 1000 || viewingMarkers.length === 0 ? (
                          <>
                            <h1 className="text-6xl font-extrabold tracking-tight leading-none mb-2">
                              {priceTotal > 1000
                                ? `Oh no. You ran out of money`
                                : viewingMarkers.length === 0
                                ? "Oh no. You ran into a deadend and we have no flights"
                                : ""}
                            </h1>
                            <p className="text-lg py-2">
                              Looks like you will be staying in{" "}
                              <span className="bold">
                                {locationCity ? locationCity.name : ""}
                              </span>{" "}
                              for now.
                            </p>
                            <div className="py-2 text-left text-lg">
                              <h2 className="text-2xl mt-4">Your Locations</h2>
                              <ul className="mt-2">
                                {stops.map((item, key) => {
                                  const country = getPlaceFromEntityId(
                                    item.countryEntityId
                                  );
                                  if (key === 0) return "";
                                  return (
                                    <li
                                      key={item.entityId}
                                      className="border-b-2 border-gray-300 py-2"
                                    >
                                      {item.name}
                                      {country ? `, ${country.name}` : ""} £
                                      {prices[key - 1]} -{" "}
                                      <a
                                        className="text-blue-600 underline hover:no-underline"
                                        target="_blank"
                                        href={`/search/${
                                          flights[key - 1].query.from.iata
                                        }/${flights[key - 1].query.to.iata}/${
                                          flights[key - 1].query.depart
                                        }`}
                                        rel="noreferrer"
                                      >
                                        See Flight (in new window)
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <button
                              className="inline-block m-2 p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                              onClick={restartGame}
                            >
                              Try Again
                            </button>
                            <button
                              className="inline-block m-2 p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                              onClick={toggleLeaderBoard}
                            >
                              See Leaderboard
                            </button>
                          </>
                        ) : (
                          <>
                            <h1 className="text-6xl font-extrabold tracking-tight leading-none mb-2">
                              You made it with £{1000 - priceTotal} still left
                            </h1>
                            <p className="text-lg py-2">
                              Great job at gettting around the world.
                            </p>
                            <div className="py-2 text-left text-lg">
                              <h2 className="text-2xl mt-4">Your Locations</h2>
                              <ul className="mt-2">
                                {stops.map((item, key) => {
                                  const country = getPlaceFromEntityId(
                                    item.countryEntityId
                                  );
                                  if (key === 0) return "";
                                  return (
                                    <li
                                      key={item.entityId}
                                      className="border-b-2 border-gray-300 py-2"
                                    >
                                      {item.name}
                                      {country ? `, ${country.name}` : ""} £
                                      {prices[key - 1]} -{" "}
                                      <a
                                        className="text-blue-600 underline hover:no-underline"
                                        target="_blank"
                                        href={`/search/${
                                          flights[key - 1].query.from.iata
                                        }/${flights[key - 1].query.to.iata}/${
                                          flights[key - 1].query.depart
                                        }`}
                                        rel="noreferrer"
                                      >
                                        See Flight (in new window)
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="py-4">
                              {stops.length - 2 < 5 ? (
                                <p className="text-lg">
                                  <span className="text-blue-600">
                                    <FaRegLightbulb className="inline-block pr-2" />{" "}
                                    Tip:
                                  </span>{" "}
                                  You did it with {stops.length - 2} stops, now
                                  try to do it with 5 or more stops.
                                </p>
                              ) : (
                                <p>
                                  <span className="text-blue-600">
                                    <LuPartyPopper className="inline-block pr-2" />{" "}
                                    Wow:
                                  </span>{" "}
                                  You did it in {stops.length - 2} stops, now
                                  try to go around the world twice for £1000. I
                                  am not even sure its possible{" "}
                                </p>
                              )}
                            </div>
                            <button
                              className="inline-block p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                              onClick={restartGame}
                            >
                              Try Again
                            </button>
                            <button
                              className="inline-block ml-2 p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl cursor-pointer text-2xl text-white"
                              onClick={toggleLeaderBoard}
                            >
                              See Leaderboard
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </>
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
              <div className="text-2xl bold">Total £{priceTotal}</div>
              {priceTotal !== 0 ? (
                <div className="text-slate-500 pt-2 text-lg">
                  £{1000 - priceTotal} Left
                </div>
              ) : (
                ""
              )}
            </div>
            {/* <div>
              {gameMode === "playing" && stops.length === 1 ? (
                <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold p-4">
                  <div className="text-2xl bold">
                    Select a location to continue
                  </div>
                </div>
              ) : (
                ""
              )}
            </div> */}
          </div>
        </div>
        <div className="absolute top-0 right-0 h-64 z-20 overflow-y-auto p-4">
          <div className="flex gap-2">
            <div
              onClick={toggleLeaderBoard}
              className="cursor-pointer relative text-white rounded-xl text-sm bg-blue-600 font-bold p-4"
            >
              <div className="text-2xl bold">
                <FaTrophy className="inline-block md:mr-2" />
                <span className="hidden md:inline-block"> Leaderboard</span>
              </div>
            </div>
          </div>
        </div>
        {selected ? (
          <>
            <div
              onClick={() => setSelected(undefined)}
              className="opacity-80 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-30"
            ></div>
            <div className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative text-slate-900 rounded-xl text-sm bg-white font-bold overflow-hidden w-80 h-full">
                <div className="p-4">
                  <MdLocationPin className="inline-block text-4xl text-blue-600" />
                  <h2 className="text-4xl font-extrabold tracking-tight leading-none mb-2">
                    {selected.city?.name}, {selected.country.name}
                  </h2>
                  <p className="text-lg py-2">{selected.price.display}</p>
                  <div className="pb-4">
                    <a
                      className="text-blue-600 underline hover:no-underline"
                      target="_blank"
                      href={`/search/${selected.query.from.iata}/${selected.query.to.iata}/${selected.query.depart}`}
                      rel="noreferrer"
                    >
                      See Flight (in new window)
                    </a>
                  </div>
                  <div
                    className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
                    onClick={() => {
                      handleLocationChange(selected);
                      setSelected(undefined);
                    }}
                  >
                    <FaMapMarkerAlt className="pr-2 text-lg" />
                    <span>Add to Location</span>
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
        {showNotification && (
          <AchievementNotification message={notificationAwardMessage} />
        )}
      </div>
    </div>
  );
};
