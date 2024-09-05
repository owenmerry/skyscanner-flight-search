import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import {
  MapControls,
  MapMarker,
} from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import { getAllParents } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";
import { FaMapMarkerAlt } from "react-icons/fa";

interface MapPlannerProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  search: IndicativeQuotesSDK[];
  level?: "city" | "country" | "continent" | "everywhere";
}
export const MapPlanner = ({
  search,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: MapPlannerProps) => {
  const [map, setMap] = useState<google.maps.Map>();
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
  const [markers] = useState<Markers[]>(getMarkers(search));

  const centerMap = () => {
    if (!map) return;

    map.panTo({
      lat: to ? to.coordinates.latitude : from.coordinates.latitude,
      lng: to ? to.coordinates.longitude : from.coordinates.longitude,
    });
  };
  const moveToMarker = (map: google.maps.Map, marker: MapMarker) => {
    console.log("run marker");
    if (!map) return;
    console.log("move marker");

    map.panTo({
      lat: marker.location.lat,
      lng: marker.location.lng,
    });
    console.log("zoom to marker");
    map.setZoom(16);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    const quote = search.filter(quote => {
      const isSameLat = quote.query.to.coordinates.latitude === marker.location.lat;
      const isSameLng = quote.query.to.coordinates.longitude === marker.location.lng;

      return isSameLat && isSameLng;
    })
    if(quote.length === 0) return; 

    setSelected(quote[0]);
  };

  useEffect(() => {
    if (map) return;
    map;
  }, [markers]);

  return (
    <div className="relative h-full">
      {selected ? (
      <div className="absolute top-4 left-4 w-60 h-full z-20">
        <div className="text-slate-900 rounded-xl text-sm bg-white font-bold overflow-hidden">
          <div className="h-64 bg-cover" style={{backgroundImage: `url(${selected.country.images[0]})`}}></div>
          <div className="p-4">
          <h2 className="text-xl font-bold">{selected.city?.name}, {selected.country.name}</h2>
          <p>{selected.price.display}</p>
          <a
          href={`/search/${selected.query.from.iata}/${selected.query.to.iata}/${selected.query.depart}/${selected.query.return}`}
            className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
          >
            <span>See Deal {selected.price.display}</span>
          </a>
          <div
            className="justify-center mb-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
            onClick={centerMap}
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
          ) : ''}
          </div>
        </div>
      </div>
      ) : ''}
      <div className="absolute top-0 left-0 bottom-0 w-full h-full z-10">
        <Wrapper apiKey={googleApiKey}>
          <MapControls
            googleMapId={googleMapId}
            center={{
              lat: to ? to.coordinates.latitude : from.coordinates.latitude,
              lng: to ? to.coordinates.longitude : from.coordinates.longitude,
            }}
            height="100vh"
            markers={markers}
            zoom={level === "everywhere" ? 5 : 0}
            fitAddress={
              to
                ? `${to?.name}${parents[0] ? `, ${parents[0].name}` : ""}`
                : `${getAllParents(from.parentId)[0]}`
            }
            onMarkerClick={(map, marker) => handleMarkerClick(marker)}
            onMapLoaded={(map) => setMap(map)}
          />
        </Wrapper>
      </div>
    </div>
  );
};
