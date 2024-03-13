import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

interface MapProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  isFitZoomToMarkers?: boolean;
  line?: google.maps.LatLngLiteral[];
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
  isFitZoomToMarkers = true,
  height = "600px",
  googleMapId,
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

    const locationSvg = {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    if (markers) {
      const markersAdvanced = markers.map((marker) => {
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
        if (isFitZoomToMarkers) {
          var bounds = new google.maps.LatLngBounds();
          markers.forEach((marker) => {
            bounds.extend(marker.location);
          });
          if (markers.length > 1) {
            googleMap.fitBounds(bounds);
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
      });
    }
  };

  useEffect(() => {
    buildMarkersAndMap();
  }, []);

  return <div ref={ref} id="map" style={{ height }} />;
};
