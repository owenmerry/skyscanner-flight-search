import { useCallback, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

export interface MapMarker {
  location: google.maps.LatLngLiteral;
  label: string;
  icon?: string;
  link?: string;
}

interface MapControlsProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  fitMarkers?: boolean;
  fitAddress?: string;
  line?: google.maps.LatLngLiteral[];
  showDirections?: boolean;
  showPlaces?: boolean;
  markers?: MapMarker[] | null;
  onMapLoaded?: (map: google.maps.Map) => void;
  onMarkerClick?: (map: google.maps.Map, marker: MapMarker) => void;
}

export const MapControls = ({
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
  onMapLoaded,
  onMarkerClick,
}: MapControlsProps) => {
  const ref = useRef<HTMLDivElement>(null);

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

  const addLine = (map: google.maps.Map, line: MapControlsProps["line"]) => {
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
    onMarkerClick: MapControlsProps["onMarkerClick"]
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
    onMarkerClick: MapControlsProps["onMarkerClick"]
  ) => {
    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    // Create a Places service instance
    var service = new PlacesService(map);

    // Perform a nearby search for tourist attractions
    service.nearbySearch(
      {
        location: location,
        radius: 5000, // 5 kilometers
        type: "tourist_attraction",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (const place of results) {
            if (!place.geometry?.location) return;
            addMarker(
              map,
              {
                label: `
              <div class="relative bg-pink-700 p-2 rounded-lg ">
              <div class=" text-white text-sm">
                <svg class="w-4 h-4 text-gray-800 dark:text-white inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8M4 9.5v-.955a1 1 0 0 1 .458-.84l7-4.52a1 1 0 0 1 1.084 0l7 4.52a1 1 0 0 1 .458.84V9.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5Z"/>
                </svg>
                <div class='font-bold'>${place.name}</div>
                <div class='font-semibold text-xs'>Rating: ${place.rating}</div>
              </div>
              <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-pink-700 "></div>
              </div>
              `,
                location: {
                  lat: place.geometry?.location.lat(),
                  lng: place.geometry?.location.lng(),
                },
              },
              onMarkerClick
            );
          }
        }
      }
    );
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
      <div ref={ref} id="map" style={{ height }} />
    </div>
  );
};
