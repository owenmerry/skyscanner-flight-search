import { Wrapper } from "@googlemaps/react-wrapper";
import { useState } from "react";
import {
  MapControls,
  MapControlsOptions,
  MapControlsProps,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import { getAllParents } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";
import { FaMapMarkerAlt } from "react-icons/fa";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import moment from "moment";
import { Location } from "~/components/ui/location";

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
  const [map, setMap] = useState<google.maps.Map>();
  const [stops, setStops] = useState<Place[]>([]);
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
  const [mapControls, setMapControls] = useState<{
    map: google.maps.Map;
    controls?: MapControlsOptions;
  }>();
  const [mapMarkers, setMapMarkers] =
    useState<google.maps.marker.AdvancedMarkerElement[]>();
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
        from: from.entityId,
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
    const updateMarkers = mapMarkers;
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
    setMapMarkers(updateMarkers);
  };

  const handleMarkerClick = (
    marker: MapMarker,
    search?: IndicativeQuotesSDK[]
  ) => {
    console.log("start..");
    if (!search) return;
    console.log("has search..");
    const quote = search.filter((quote) => {
      const isSameLat =
        quote.query.to.coordinates.latitude === marker.location.lat;
      const isSameLng =
        quote.query.to.coordinates.longitude === marker.location.lng;

      return isSameLat && isSameLng;
    });
    console.log("looped qotes..", search.length);
    console.log("found qotes..", quote.length);
    if (quote.length === 0) return;

    console.log("set selcted to..", quote[0]);
    setSelected(quote[0]);
  };

  const handleMapLoaded: MapControlsProps["onMapLoaded"] = (map, options) => {
    setMap(map);
    setMapControls({ map, controls: options });
    if (!options?.markers) return;
    setMapMarkers(options.markers);
  };

  const handleAddToTrip = ({
    previous,
    current,
  }: {
    current: Place;
    previous?: Place;
  }) => {
    console.log("add to trip..");
    if (
      !mapControls ||
      !mapControls?.controls?.addLine ||
      !mapControls?.controls?.addMarker
    )
      return;

    console.log("run add to trip..");
    if (previous) {
      console.log("add line..");
      mapControls.controls.addLine(
        mapControls.map,
        [
          {
            lat: previous.coordinates.latitude,
            lng: previous.coordinates.longitude,
          },
          {
            lat: current.coordinates.latitude,
            lng: current.coordinates.longitude,
          },
        ],
        true
      );
    }

    console.log("add marker..");
    const toMarker = {
      location: {
        lat: current.coordinates.latitude,
        lng: current.coordinates.longitude,
      },
      label: `
          <div class="group/marker relative bg-blue-600 p-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-2xl transition">
          <div class=" text-white text-sm text-center">
           <svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448 336v-40L288 192V79.2c0-17.7-14.8-31.2-32-31.2s-32 13.5-32 31.2V192L64 296v40l160-48v113.6l-48 31.2V464l80-16 80 16v-31.2l-48-31.2V288l160 48z"></path></svg>
            <div class='font-bold'>${current.name}</div>
          </div>
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-blue-600 group-hover/marker:bg-blue-700 transition"></div>
          </div>`,
      link: `/`,
      icon: "\ue539",
    };
    mapControls.controls.addMarker(mapControls.map, toMarker, () =>
      handleMarkerClick(toMarker)
    );

    mapControls.map.panTo({
      lat: current.coordinates.latitude,
      lng: current.coordinates.longitude,
    });
  };

  const moveTo = (marker: Place) => {
    if (!map || !mapControls) return;
    mapControls.map.panTo({
      lat: marker.coordinates.latitude,
      lng: marker.coordinates.longitude,
    });
  };

  const removeMarkers = () => {
    if (!map || !mapMarkers) return;
    mapMarkers.forEach((marker) => (marker.map = null));
  };

  const handleLocationChange = (place: Place) => {
    const previous = stops.length > 0 ? stops[stops.length - 1] : undefined;
    handleAddToTrip({
      current: place,
      previous,
    });
    setStops([...stops, place]);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="bg-slate-950 text-white">
        {/* <div
          className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
          onClick={addSearchMarkers}
        >
          <FaMapMarkerAlt className="pr-2 text-lg" />
          <span>Show Flights</span>
        </div> */}

        {stops.map((stop, key) => (
          <div
            key={`${stop.entityId}_${key}`}
            className="py-6 px-4 border-b-slate-700 "
            onMouseEnter={() => moveTo(stop)}
          >
            {stop.name} ({stop.iata})
          </div>
        ))}

        <Location
          name="From"
          defaultValue={from.name}
          apiUrl={apiUrl}
          onSelect={(value, iataCode, place) => handleLocationChange(place)}
        />
      </div>
      <div className="relative">
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
                <div className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap">
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
            onMarkerClick={(map, marker) => handleMarkerClick(marker)}
            onMapLoaded={handleMapLoaded}
          />
        </Wrapper>
      </div>
    </div>
  );
};
