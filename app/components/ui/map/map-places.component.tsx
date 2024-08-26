import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { getGooglePlaces, getMarkersFromPlaces } from "./helpers/places-rating";
import type { MapMarker } from "./map-control.component";
import { IoMdTrophy } from "react-icons/io";
import { GooglePlacesType } from "./types/places-types";

export interface MapPlacesProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  fitMarkers?: boolean;
  fitAddress?: string;
  line?: google.maps.LatLngLiteral[];
  showDirections?: boolean;
  placeType: GooglePlacesType;
  placeKeyword?: string;
  placeIcon: string;
  markers?: MapMarker[] | null;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMarkerClick?: (map: google.maps.Map, marker: MapMarker) => void;
}

export const MapPlaces = ({
  center,
  zoom,
  markers,
  line,
  fitMarkers = true,
  height = "600px",
  showDirections = false,
  placeType,
  placeKeyword,
  placeIcon,
  googleMapId,
  fitAddress,
  onMapLoaded,
  onMarkerClick,
}: MapPlacesProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [attractions, setAttractions] =
    useState<google.maps.places.PlaceResult[]>();
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.places.PlaceResult>();
  const [map, setMap] = useState<google.maps.Map>();

  const buildMap = async () => {
    if (!ref.current) return;
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    const googleMap = new Map(ref.current, {
      center,
      zoom,
      mapId: googleMapId,
      disableDefaultUI: true,
      ...(isMobile ? { gestureHandling: "greedy" } : {}),
    });
    setMap(googleMap);

    if (markers) {
      for (const marker of markers) {
        addMarker(googleMap, marker, onMarkerClick);
      }

      //fit map screen
      if (fitAddress) {
        fitMapToCityBounds(fitAddress, googleMap);
      } else if (fitMarkers) {
        fitMapToBounds(googleMap, markers);
      }

      //add line drawing
      if (line) {
        addLine(googleMap, line);
      }

      //add directions
      if (showDirections) {
        addDirections(googleMap, markers);
      }

      await addPlaces({
        map: googleMap,
        location: center,
        onClick: onMarkerClick,
        keyword: placeKeyword,
        type: placeType,
        icon: placeIcon,
      });
    }

    onMapLoaded && onMapLoaded(googleMap);
  };

  const fitMapToCityBounds = useCallback(
    (cityName: string, mapRef: google.maps.Map) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const bounds = results && results[0].geometry.bounds;
          if (bounds && mapRef) {
            mapRef.fitBounds(bounds);
          }
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    },
    []
  );

  const fitMapToBounds = (map: google.maps.Map, markers: MapMarker[]) => {
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach((marker) => {
      bounds.extend(
        new google.maps.LatLng(marker.location.lat, marker.location.lng)
      );
    });
    map.fitBounds(bounds);
  };

  const addLine = (map: google.maps.Map, line: MapPlacesProps["line"]) => {
    const flightPath = new google.maps.Polyline({
      path: line,
      geodesic: false,
      strokeColor: "#53638e",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);
  };

  const addMarker = async (
    map: google.maps.Map,
    marker: MapMarker,
    onMarkerClick: MapPlacesProps["onMarkerClick"]
  ) => {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    const container = document.createElement("div");
    container.innerHTML = marker.label;

    const googleMarker = new AdvancedMarkerElement({
      position: marker.location,
      title: "Weather marker",
      content: container,
      map,
    });

    if (onMarkerClick) {
      googleMarker.addListener("click", () => {
        onMarkerClick(map, marker);
      });
    }
  };

  const addPlaces = async ({
    map,
    location,
    keyword,
    type,
    icon,
    onClick,
  }: {
    map: google.maps.Map;
    location: google.maps.LatLngLiteral;
    onClick: MapPlacesProps["onMarkerClick"];
    keyword?: string;
    icon: string;
    type: GooglePlacesType;
  }) => {
    const places = await getGooglePlaces({
      map,
      location,
      type,
      keyword,
    });
    const markers = getMarkersFromPlaces({ places, icon: placeIcon });
    for (const marker of markers) {
      addMarker(map, marker, onClick);
    }
    setAttractions(places);
  };

  const addDirections = (map: google.maps.Map, markers: MapMarker[]) => {
    if (!markers || markers.length < 2) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const waypoints = markers.slice(1, markers.length - 1).map((marker) => {
      console.log("set waypoints", marker);

      return {
        location: new google.maps.LatLng(
          marker.location.lat,
          marker.location.lng
        ),
        stopover: true,
      };
    });

    directionsService.route(
      {
        origin: new google.maps.LatLng(
          markers[0].location.lat,
          markers[0].location.lng
        ),
        destination: new google.maps.LatLng(
          markers[markers.length - 1].location.lat,
          markers[markers.length - 1].location.lng
        ),
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    buildMap();
  }, [markers, placeKeyword, placeType]);

  return (
    <div>
      <div className="sm:flex gap-2">
        <div
          className={`flex gap-2 sm:block pb-2 sm:pb-0 overflow-y-scroll sm:w-1/3 sm:overflow-x-scroll scrollbar-hide sm:h-[700px]`}
        >
          {attractions?.map((attraction, key) => {
            return (
              <div
                key={key}
                className={`mb-0 sm:mb-2 min-w-72 sm:min-w-0 text-left border border-slate-700 rounded-lg ${
                  selectedMarker?.name === attraction.name ? `bg-slate-800` : ``
                }`}
                onMouseEnter={() => {
                  if (!map || !attraction.geometry?.location) return;
                  map.panTo({
                    lat: attraction.geometry.location.lat(),
                    lng: attraction.geometry.location.lng(),
                  });
                  map.setZoom(16);
                  setSelectedMarker(attraction);
                }}
                onClick={() => {
                  if (!map || !attraction.geometry?.location) return;
                  map.panTo({
                    lat: attraction.geometry.location.lat(),
                    lng: attraction.geometry.location.lng(),
                  });
                  map.setZoom(16);
                  setSelectedMarker(attraction);
                }}
              >
                <div className="flex">
                  {attraction.photos ? (
                    <div
                      className="w-2/5 bg-cover rounded-lg"
                      style={{
                        backgroundImage: `url(${attraction.photos[0].getUrl()})`,
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                  <div className="w-3/5 p-4">
                    <div className="bg-pink-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded whitespace-nowrap inline-block">
                      <IoMdTrophy className="inline-block" /> #{key + 1} Lynn's
                      Ranking
                    </div>
                    <div className="text-lg font-bold truncate sm:whitespace-normal">
                      {attraction.name}
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <div>Rating {attraction.rating}</div>
                      <div>{attraction.user_ratings_total} Reviews</div>
                    </div>
                    <div>
                      <a
                        className="text-slate-300 underline hover:no-underline text-sm"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.google.com/maps/place/?q=place_id:${attraction.place_id}`}
                      >
                        <svg
                          className="w-3 h-3 text-gray-800 dark:text-white inline mr-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        See on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="sm:w-2/3">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full z-20 p-2">
              <div className="flex justify-end gap-2">
                <div
                  className="text-white inline-block rounded-xl px-3 py-2 text-sm bg-blue-600 font-bold cursor-pointer"
                  onClick={() => {
                    if (fitAddress && map) {
                      fitMapToCityBounds(fitAddress, map);
                    }
                  }}
                >
                View All
                </div>
              </div>
            </div>
            <div ref={ref} id="map" className="h-[400px] sm:h-[700px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
