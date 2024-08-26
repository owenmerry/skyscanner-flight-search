import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { getAttractionMarkersFromPlaces, getGooglePlaces } from "./helpers/places-rating";
import type { MapMarker } from "./map-control.component";

export interface MapPlacesProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  fitMarkers?: boolean;
  fitAddress?: string;
  line?: google.maps.LatLngLiteral[];
  showDirections?: boolean;
  showPlaces?: boolean;
  placesList?: MapMarker[];
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
  showPlaces = false,
  googleMapId,
  fitAddress,
  placesList,
  onMapLoaded,
  onMarkerClick,
}: MapPlacesProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [attractions, setAttractions] = useState<
  google.maps.places.PlaceResult[]
>();
  const [selectedMarker, setSelectedMarker] = useState<
    google.maps.places.PlaceResult
  >();
  const [map, setMap] = useState<
  google.maps.Map
>();

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

      if (showPlaces) {
        await addPlaces(googleMap, center, onMarkerClick);
      }
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

  const addPlaces = async (
    map: google.maps.Map,
    location: google.maps.LatLngLiteral,
    onMarkerClick: MapPlacesProps["onMarkerClick"]
  ) => {
    const places =
      placesList ||
      (await getGooglePlaces({
        map,
        location,
      }));
      const markers = getAttractionMarkersFromPlaces({places});
    for (const marker of markers) {
      addMarker(map, marker, onMarkerClick);
    }
    setAttractions(places);
    addDirections(map, markers);
  };

  const addDirections = (map: google.maps.Map, markers: MapMarker[]) => {
    console.log("run directions");
    if (!markers || markers.length < 2) return;

    console.log("run directions service");
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

    console.log("set origin", markers[0]);
    console.log("set destination", markers[markers.length - 1]);
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
          console.log("run directions rendrer", result);

          directionsRenderer.setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    buildMap();
  }, [markers]);

  return (
    <div>
        <div className="py-2 flex justify-end">
            <div
              className="text-white inline-block rounded-xl px-3 py-2 text-sm bg-blue-600 font-bold cursor-pointer"
              onClick={() => {
                if(fitAddress && map){
                  fitMapToCityBounds(fitAddress, map);
                }
              }}
            >
              Center Map
            </div>
          </div>
      <div className="sm:flex gap-2">
        <div className={`flex gap-2 sm:block pb-2 sm:pb-0 overflow-y-scroll sm:w-1/3 sm:overflow-x-scroll scrollbar-hide sm:h-[800px]`}>
          {attractions?.map((attraction, key) => {
            return <div key={key} className={`mb-0 sm:mb-2 min-w-72 sm:min-w-0 text-left border border-slate-700 p-4 rounded-lg ${selectedMarker?.name === attraction.name ? `bg-slate-800` : ``}`} onMouseEnter={() => {
              if(!map || !attraction.geometry?.location) return;
              map.panTo({
                lat: attraction.geometry.location.lat(),
                lng: attraction.geometry.location.lng(),
              });
              map.setZoom(16);
              setSelectedMarker(attraction);
            }} onClick={() => {
              if(!map || !attraction.geometry?.location) return;
              map.panTo({
                lat: attraction.geometry.location.lat(),
                lng: attraction.geometry.location.lng(),
              });
              map.setZoom(16);
              setSelectedMarker(attraction);
            }}>
              <div className="text-lg font-bold">
              {attraction.name}
                </div>
                <div>Lynn's Ranking: {key + 1}</div>
                <div>Rating {attraction.rating}</div>
                <div>{attraction.user_ratings_total} Reviews</div>
            </div>
          })}
        </div>
        <div className="sm:w-2/3">
      <div ref={ref} id="map" className="h-[500px] sm:h-[800px]" />
        </div>
      </div>
    </div>
  );
};
