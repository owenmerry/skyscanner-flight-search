import { Wrapper } from "@googlemaps/react-wrapper";
import { useState } from "react";
import { MapMarker } from "~/components/ui/map/map-control.component";
import { MapPlaces } from "~/components/ui/map/map-places.component";
import { GooglePlacesType } from "~/components/ui/map/types/places-types";
import type { Markers } from "~/helpers/map";
import { getAllParents } from "~/helpers/sdk/data";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface PlaceFilter {
  keyword: string;
  type: GooglePlacesType;
  label: string;
  icon: string;
  hideIconOnLabel?: boolean;
}
const filterList: PlaceFilter[] = [
  {
    keyword: "Things to do",
    type: "tourist_attraction",
    icon: `<svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20.15 14.42c.23-.77.35-1.58.35-2.42s-.12-1.65-.35-2.42c.78-.6 1.02-1.7.51-2.58s-1.58-1.23-2.49-.85a8.53 8.53 0 0 0-4.18-2.42C13.85 2.75 13.01 2 12 2s-1.85.75-1.98 1.73a8.561 8.561 0 0 0-4.19 2.42c-.91-.38-1.98-.03-2.49.85s-.27 1.98.51 2.58c-.23.77-.35 1.58-.35 2.42s.12 1.65.35 2.42c-.78.6-1.02 1.7-.51 2.58s1.58 1.23 2.49.85c.4.42.83.79 1.3 1.12L5.78 22h1.88l.98-2.19c.44.19.9.34 1.38.46.13.98.97 1.73 1.98 1.73s1.85-.75 1.98-1.73c.46-.11.91-.26 1.34-.44L16.3 22h1.88l-1.34-3c.48-.34.93-.72 1.34-1.15.91.38 1.99.03 2.49-.85.5-.88.26-1.98-.52-2.58zm-6.59 4.33c-.37-.46-.93-.75-1.56-.75s-1.2.29-1.57.75c-.4-.09-.79-.21-1.16-.37l1.43-3.19a3.522 3.522 0 0 0 2.56.02l1.42 3.18c-.36.15-.73.27-1.12.36zm-3.08-6.73c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm8.23 1.99c-.61.07-1.18.41-1.52.99-.32.56-.34 1.2-.12 1.75-.28.29-.58.55-.9.79l-1.5-3.35c.49-.59.78-1.34.78-2.16 0-1.89-1.55-3.41-3.46-3.41s-3.46 1.53-3.46 3.41c0 .8.28 1.54.75 2.13l-1.52 3.39c-.31-.23-.6-.48-.87-.76.26-.56.24-1.22-.09-1.79-.34-.59-.93-.94-1.56-.99-.22-.68-.33-1.4-.33-2.15 0-.64.09-1.26.25-1.85.66-.03 1.3-.38 1.65-1 .37-.63.35-1.38.01-1.98.92-.98 2.11-1.69 3.45-2.03.34.59.99 1 1.73 1s1.39-.4 1.73-1c1.34.34 2.53 1.07 3.44 2.05-.32.59-.33 1.33.03 1.95.35.6.96.95 1.6 1 .16.59.25 1.21.25 1.86 0 .75-.12 1.47-.34 2.15z"></path></svg>`,
    label: "Things to do",
  },
  {
    keyword: "trendy cafe",
    type: "cafe",
    icon: `<svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z"></path></svg>`,
    label: "☕️ Flat White",
    hideIconOnLabel: true,
  },
  {
    keyword: "Art Gallery",
    type: "art_gallery",
    icon: `<svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.993 1.385a1.87 1.87 0 0 1 2.623 2.622l-4.03 5.27a12.749 12.749 0 0 1-4.237 3.562 4.508 4.508 0 0 0-3.188-3.188 12.75 12.75 0 0 1 3.562-4.236l5.27-4.03ZM6 11a3 3 0 0 0-3 3 .5.5 0 0 1-.72.45.75.75 0 0 0-1.035.931A4.001 4.001 0 0 0 9 14.004V14a3.01 3.01 0 0 0-1.66-2.685A2.99 2.99 0 0 0 6 11Z"></path></svg>`,
    label: "Art Gallery",
  },
  {
    keyword: "Brunch",
    type: "cafe",
    icon: `<svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z"></path></svg>`,
    label: "Brunch/Lunch",
  },
  {
    keyword: "Dinner",
    type: "restaurant",
    icon: `<svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M39.906 27.188c-9.118 13.907-11.366 30.99-7.843 50.718 4.2 23.526 16.91 50.038 35.28 75 36.742 49.925 96.05 93.082 148.813 99.625l3.688.47 2.375 2.844L416.374 490.22c19.352 4.624 31.847 1.745 38.344-4.69 6.547-6.484 9.566-19.005 4.717-38.874L39.908 27.187zM414.97 29.5L306.47 138c-12 11.998-12.104 25.2-5.908 39.625l2.563 5.97-4.688 4.5L262 222.844l29.594 29.593 34.594-36.532 4.5-4.75 5.968 2.594c15.165 6.535 29.546 6.267 40.688-4.875l108.5-108.5L471.75 86.28l-70.563 70.532L388 143.595l70.53-70.53L443.5 58.03l-70.53 70.532-13.22-13.218 70.53-70.53-15.31-15.314zM210.936 271.563L25.53 448.469c-4.575 18.95-1.644 30.787 4.532 36.905 6.178 6.118 18.128 8.927 36.844 4.406l173.22-182.967-29.19-35.25z"></path></svg>`,
    label: "🍜 Dinner",
    hideIconOnLabel: true,
  },
];

interface MarketingMapPlacesProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  search: IndicativeQuotesSDK[];
  level?: "city" | "country" | "continent" | "everywhere";
}
export const MarketingMapPlaces = ({
  search,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: MarketingMapPlacesProps) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [filter, setFilter] = useState<PlaceFilter>(filterList[0]);
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
              <div class="relative bg-blue-700 p-2 rounded-lg ">
              <div class=" text-white text-sm">
                <svg class="w-4 h-4 text-gray-800 dark:text-white inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z" clip-rule="evenodd"/>
                </svg>
                <div class='font-bold'>${flight.price.display}</div>
              </div>
              <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-blue-700 "></div>
              </div>`,
          link: `/search/${flight.query.from.iata}/${flight.query.to.iata}/${flight.query.depart}/${flight.query.return}`,
          icon: "\ue539",
        });
      }
    }

    //from
    markers.push({
      location: {
        lat: from.coordinates.latitude,
        lng: from.coordinates.longitude,
      },
      label: `<div class='rounded-full w-5 h-5 bg-pink-600 border-white border-2 shadow animate-bounce'></div>`,
    });

    return markers;
  };
  const [markers] = useState<Markers[]>(getMarkers(search));

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

  const handleLabelClick = (filter: PlaceFilter) => {
    setFilter(filter);
  };

  return (
    <div className="">
      <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center lg:py-16">
        <div className="flex justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-blue-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v6M9.5 9A2.5 2.5 0 0 1 12 6.5"
            />
          </svg>
        </div>
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Explore {level !== "everywhere" ? to?.name : "Everywhere"} by Map
        </h2>
        <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
          We are strategists, designers and developers. Innovators and problem
          solvers. Small enough to be simple and quick, but big enough to
          deliver the scope you want at the pace you need {search.length}.
        </p>
        <div className="flex overflow-y-scroll scrollbar-hide gap-2 py-3 pt-6">
          <>
            {filterList.map((filterItem, key) => (
              <div
                key={`filters-${key}`}
                onClick={() => handleLabelClick(filterItem)}
                className={`${
                  filter.keyword === filterItem.keyword &&
                  filter.type === filterItem.type
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                {filterItem.hideIconOnLabel === undefined || filterItem.hideIconOnLabel === false ? (
                  <div
                    className="inline mr-2"
                    dangerouslySetInnerHTML={{ __html: filterItem.icon }}
                  ></div>
                ) : (
                  ""
                )}
                {filterItem.label}
              </div>
            ))}
          </>
        </div>
        <div className="py-2">
          <Wrapper apiKey={googleApiKey}>
            <MapPlaces
              googleMapId={googleMapId}
              center={{
                lat: to ? to.coordinates.latitude : from.coordinates.latitude,
                lng: to ? to.coordinates.longitude : from.coordinates.longitude,
              }}
              markers={markers}
              zoom={level === "everywhere" ? 5 : 0}
              fitAddress={
                to
                  ? `${to?.name}${parents[0] ? `, ${parents[0].name}` : ""}`
                  : `${getAllParents(from.parentId)[0]}`
              }
              onMarkerClick={(map, marker) => moveToMarker(map, marker)}
              onMapLoaded={(map) => setMap(map)}
              placeKeyword={filter.keyword}
              placeType={filter.type}
              placeIcon={filter.icon}
            />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};
