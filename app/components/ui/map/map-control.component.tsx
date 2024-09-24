import { useCallback, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { waitSeconds } from "~/helpers/utils";

export interface MapMarker {
  location: google.maps.LatLngLiteral;
  label: string;
  icon?: string;
  link?: string;
}

export interface MapControlsProps {
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
  onMarkerClick?: (map: google.maps.Map, marker: MapMarker) => void;
  onMapLoaded?: (map: google.maps.Map, options?: MapControlsOptions) => void;
}
export interface MapControlsOptions {
  markers?: google.maps.marker.AdvancedMarkerElement[];
  addMarker?: (
    map: google.maps.Map,
    marker: MapMarker,
    onMarkerClick: MapControlsProps["onMarkerClick"]
  ) => Promise<google.maps.marker.AdvancedMarkerElement>;
  addLine?: (
    map: google.maps.Map,
    line: google.maps.LatLngLiteral[],
    curved?: boolean
  ) => google.maps.Polyline;
  fitMapToBounds?: (map: google.maps.Map, markers: MapMarker[]) => void;
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
  placesList,
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
    const markersRef: google.maps.marker.AdvancedMarkerElement[] = [];

    if (markers) {
      for (const marker of markers) {
        const markerRef = await addMarker(googleMap, marker, onMarkerClick);
        markersRef.push(markerRef);
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
    }

    onMapLoaded &&
      onMapLoaded(googleMap, {
        markers: markersRef,
        addMarker,
        addLine,
        fitMapToBounds,
      });
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

  const addLine = (
    map: google.maps.Map,
    line: google.maps.LatLngLiteral[],
    curved: boolean = false
  ) => {
    const flightPath = new google.maps.Polyline({
      path: line,
      geodesic: true,
      strokeColor: "#53638e",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);

    return flightPath;
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
        //e.stopPropagation();
        onMarkerClick(map, marker);
      });
    }

    return googleMarker;
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

  const centerMap = (map: google.maps.Map, location: google.maps.LatLng) => {
    if (!map) return;

    map.panTo(location);
  };

  const moveToMarker = (map: google.maps.Map, location: google.maps.LatLng) => {
    if (!map) return;

    map.panTo(location);
    map.setZoom(16);
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
