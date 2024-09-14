import type { MapControlsOptions } from "~/components/ui/map/map-control.component";
import type { Place } from "./sdk/place";
import type { Markers } from "./map";

export interface MapControls {
  map: google.maps.Map;
  controls?: MapControlsOptions;
}

export const addToTrip = async ({
  mapControls,
  previous,
  current,
  handleMarkerClick,
}: {
  mapControls?: MapControls;
  current: Place;
  previous?: Place;
  handleMarkerClick: (map: google.maps.Map, marker: Markers) => void;
}) => {
  if (
    !mapControls ||
    !mapControls?.controls?.addLine ||
    !mapControls?.controls?.addMarker
  )
    return;

  let lineRef;
  if (previous) {
    lineRef = addLine({ from: previous, to: current, mapControls });
  }

  const markerRef = await addMarker({
    location: current,
    onMarkerClick: handleMarkerClick,
    mapControls,
  });

  moveTo({ location: current, mapControls });

  return {
    markerRef,
    lineRef,
  };
};

export const addLine = ({
  from,
  to,
  mapControls,
}: {
  from: Place;
  to: Place;
  mapControls?: MapControls;
}) => {
  if (!mapControls || !mapControls?.controls?.addLine) return;

  const lineRef = mapControls.controls.addLine(
    mapControls.map,
    [
      {
        lat: from.coordinates.latitude,
        lng: from.coordinates.longitude,
      },
      {
        lat: to.coordinates.latitude,
        lng: to.coordinates.longitude,
      },
    ],
    true
  );

  return lineRef;
};

export const moveTo = ({
  location,
  mapControls,
}: {
  location: Place;
  mapControls?: MapControls;
}) => {
  if (!mapControls) return;
  mapControls.map.panTo({
    lat: location.coordinates.latitude,
    lng: location.coordinates.longitude,
  });
};

export const addMarker = async ({
  location,
  onMarkerClick,
  mapControls,
}: {
  location: Place;
  onMarkerClick: (map: google.maps.Map, marker: Markers) => void;
  mapControls?: MapControls;
}) => {
  if (!mapControls || !mapControls?.controls?.addMarker) return;

  const marker = placeToMarker(location);

  const markerRef = await mapControls.controls.addMarker(
    mapControls.map,
    marker,
    onMarkerClick
  );

  return markerRef;
};

export const placesToMarkers = (places: Place[]): Markers[] => {
  let markers: Markers[] = [];
  places.forEach((place) => {
    markers.push(placeToMarker(place));
  });

  return markers;
};
export const placeToMarker = (place: Place): Markers => {
  const marker = {
    location: {
      lat: place.coordinates.latitude,
      lng: place.coordinates.longitude,
    },
    label: `
              <div class="group/marker relative bg-blue-600 p-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-2xl transition">
              <div class=" text-white text-sm text-center">
               <svg class='inline' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448 336v-40L288 192V79.2c0-17.7-14.8-31.2-32-31.2s-32 13.5-32 31.2V192L64 296v40l160-48v113.6l-48 31.2V464l80-16 80 16v-31.2l-48-31.2V288l160 48z"></path></svg>
                <div class='font-bold'>${place.name}</div>
              </div>
              <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-blue-600 group-hover/marker:bg-blue-700 transition"></div>
              </div>`,
    link: `/`,
    icon: "",
  };

  return marker;
};
