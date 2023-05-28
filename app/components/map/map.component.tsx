import { useEffect, useRef } from "react";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: {
    location: google.maps.LatLngLiteral;
    label: string;
    icon?: string;
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

    const locationSvg = {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    // new window.google.maps.Marker({
    //   position: center,
    //   map: googleMap,
    //   title: "Location From",
    //   clickable: false,
    //   icon: locationSvg,
    // });

    if (markers) {
      markers.map((marker) => {
        const googleMarker = new google.maps.Marker({
          position: marker.location,
          map: googleMap,
          clickable: true,
          ...marker.icon ? {
            label: {
              text: marker.icon,
              fontFamily: "Material Icons",
              color: "#ffffff",
              fontSize: "18px",
            }
          } : {},
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