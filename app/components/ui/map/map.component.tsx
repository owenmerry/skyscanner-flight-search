import { useCallback, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

interface MapProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  isFitZoomToMarkers?: boolean;
  fitLocationAddress?: string;
  line?: google.maps.LatLngLiteral[];
  lines?: google.maps.LatLngLiteral[][];
  onLoadedMap?: (map: google.maps.Map) => void;
  markers?:
    | {
        location: google.maps.LatLngLiteral;
        label: string;
        icon?: string;
        link?: string;
      }[]
    | null;
}

export const Map = ({
  center,
  zoom,
  markers,
  line,
  lines,
  isFitZoomToMarkers = true,
  height = "600px",
  googleMapId,
  fitLocationAddress,
  onLoadedMap,
}: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const buildMarkersAndMap = async () => {
    if (!ref.current) return;
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;
    const googleMap = new Map(ref.current, {
      center,
      zoom,
      mapId: googleMapId,
      ...(isMobile ? { gestureHandling: "greedy" } : {}),
    });

    if (markers) {
      for (const marker of markers) {
        const container = document.createElement("div");
        container.innerHTML = marker.label;

        const googleMarker = new AdvancedMarkerElement({
          position: marker.location,
          title: "Weather marker",
          content: container,
          map: googleMap,
          collisionBehavior:
            google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
        });

        const googleLink = marker.link;
        if (googleLink) {
          googleMarker.addListener("click", () => {
            window.location.href = googleLink;
          });
        }

        //fit zoom to markers
        if (fitLocationAddress) {
          fetchCityBounds(fitLocationAddress, googleMap);
        } else if (isFitZoomToMarkers) {
          var bounds = new google.maps.LatLngBounds();
          markers.forEach((marker) => {
            bounds.extend(marker.location);
          });
          if (markers.length > 1) {
            googleMap.fitBounds(bounds);
          }
        }
      }
      //add line drawing
      if (line) {
        const flightPath = new google.maps.Polyline({
          path: line,
          geodesic: false,
          strokeColor: "#53638e",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        flightPath.setMap(googleMap);
      }

      //add lines drawing
      if (lines) {
        lines.forEach((line) => {
          const flightPath = new google.maps.Polyline({
            path: line,
            geodesic: false,
            strokeColor: "#53638e",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          flightPath.setMap(googleMap);
        });
      }
    }

    onLoadedMap && onLoadedMap(googleMap);
  };

  const fetchCityBounds = useCallback(
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

  useEffect(() => {
    buildMarkersAndMap();
  }, []);

  return (
    <div>
      <div ref={ref} id="map" style={{ height }} />
    </div>
  );
};
