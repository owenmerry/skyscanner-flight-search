import { useEffect, useRef } from "react";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: {
    location: google.maps.LatLngLiteral;
    label: string;
  }[] | null;
}

export const Map = ({
  center,
  zoom,
  markers,
}: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const googleMap = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });

    if (markers) {
      markers.map((marker) => {
        const googleMarker = new google.maps.Marker({
          position: marker.location,
          map: googleMap,
          title: "Hello World!",
          clickable: true,
        });

        const infowindow = new google.maps.InfoWindow({
          content: marker.label,
        });

        googleMarker.addListener("click", () => {
          infowindow.open({
            anchor: googleMarker,
            map: googleMap,
          });
        });
      })
    }

  });

  return <div ref={ref} id="map" style={{ height: '600px' }} />;
}