import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { MarkerWithLabel } from "@googlemaps/markerwithlabel";
import { MarkerManager } from "@googlemaps/markermanager";
import { waitSeconds } from "~/helpers/utils";

interface MapProps {
  googleMapId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  height?: string;
  markers?:
    | {
        location: google.maps.LatLngLiteral;
        label: string;
        icon?: string;
      }[]
    | null;
}

export const Map = ({
  center,
  zoom,
  markers,
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
      //setup marker manager
      // const googleMarkerManager = new MarkerManager(googleMap, {
      //   borderPadding: 20,
      // });

      const markersAdvanced = markers.map((marker) => {
        const container = document.createElement("div");
        container.innerHTML = marker.label;

        new AdvancedMarkerElement({
          position: marker.location,
          title: "Weather marker",
          content: container,
          map: googleMap,
          collisionBehavior:
            google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
        });

        //fit zoom to markers
        var bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(marker.location);
        });
        if (markers.length > 1) {
          googleMap.fitBounds(bounds);
        }

        // if (!google.maps?.marker?.AdvancedMarkerElement) {
        //   console.log("Normal markers used");
        //   new google.maps.Marker({
        //     position: marker.location,
        //     title: "Weather marker",
        //     map: googleMap,
        //   });
        // } else {
        //   console.log("Advanced markers used");
        //   new google.maps.marker.AdvancedMarkerElement({
        //     position: marker.location,
        //     title: "Weather marker",
        //     content: container,
        //     map: googleMap,
        //   });
        // }
      });
    }
  };

  useEffect(() => {
    buildMarkersAndMap();

    // const getMarkers = () => {
    //

    //   const batch = markers.map((marker) => {
    //     return new google.maps.marker.AdvancedMarkerElement({
    //       position: marker.location,
    //       title: "Weather marker",
    //       content: container,
    //       map: googleMap,
    //     });
    //   });

    //   return batch;
    // };

    // google.maps.event.addListener(googleMarkerManager, "loaded", function () {
    //   //setup markers
    //   googleMarkerManager.addMarkers(getMarkers(), 3, 10);
    //   // const container = document.createElement("div");
    //   // container.innerHTML = "Hello";
    //   // container.className = "dark:text-black";

    //   // markers.map((marker) => {
    //   //   const markerAdvanced = new google.maps.marker.AdvancedMarkerElement({
    //   //     position: marker.location,
    //   //     content: container,
    //   //     map: googleMap,
    //   //     // collisionBehavior:
    //   //     //   google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
    //   //   });
    //   // });

    //   googleMarkerManager.refresh();
    // });
  }, []);

  //   function Marker({ map, position, children, onClick }) {
  //     const rootRef = useRef();
  //     const markerRef = useRef();

  //     useEffect(() => {
  //       if (!rootRef.current) {
  //         const container = document.createElement("div");
  //         rootRef.current = createRoot(container);

  //         markerRef.current = new google.maps.marker.AdvancedMarkerView({
  //           position,
  //           content: container,
  //         });
  //       }

  //       return () => (markerRef.current.map = null);
  //     }, []);

  //     useEffect(() => {
  //       rootRef.current.render(children);
  //       markerRef.current.position = position;
  //       markerRef.current.map = map;
  //       const listener = markerRef.current.addListener("click", onClick);
  //       return () => listener.remove();
  //     }, [map, position, children, onClick]);
  //   }

  return <div ref={ref} id="map" style={{ height }} />;
};

// const MapFeatures = ({ map } : {}) => {

// }

// function Weather({ map }) {
//   const [data, setData] = useState(weatherData);
//   const [highlight, setHighlight] = useState();
//   const [editing, setEditing] = useState();

//   return (
//     <>
//       {editing && (
//         <Editing
//           weather={data[editing]}
//           update={(newWeather) => {
//             setData((existing) => {
//               return { ...existing, [editing]: { ...newWeather } };
//             });
//           }}
//           close={() => setEditing(null)}
//         />
//       )}
//       {Object.entries(data).map(([key, weather]) => (
//         <Marker
//           key={key}
//           map={map}
//           position={weather.position}
//           onClick={() => setEditing(key)}
//         >
//           <div
//             className={`marker ${weather.climate.toLowerCase()} ${
//               highlight === key || editing === key ? "highlight" : ""
//             }`}
//             onMouseEnter={() => setHighlight(key)}
//             onMouseLeave={() => setHighlight(null)}
//           >
//             <h2>{weather.climate}</h2>
//             <div>{weather.temp}c</div>
//             {highlight === key || editing === key ? (
//               <div className="five-day">
//                 <p>Next 5</p>
//                 <p>{weather.fiveDay.join(", ")}</p>
//               </div>
//             ) : null}
//           </div>
//         </Marker>
//       ))}
//     </>
//   );
// }

// function MyMap() {
//   const [map, setMap] = useState();
//   const ref = useRef();

//   useEffect(() => {
//     setMap(new window.google.maps.Map(ref.current, mapOptions));
//   }, []);

//   return (
//     <>
//       <div ref={ref} id="map" />
//       {map && <Weather map={map} />}
//     </>
//   );
// }
