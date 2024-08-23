import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

// Define types for the props and location objects
export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: "restaurants" | "attractions" | "hotels" | "airports"; // Add categories here
}

interface MapControlProps {
  googleMapsApiKey: string;
  locations: Location[];
  cityName?: string; // New prop for the city name
  mapContainerStyle?: React.CSSProperties;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  renderMarkerContent?: (location: Location) => JSX.Element;
  showDirections?: boolean; // New prop to enable or disable directions
  fitToCity?: boolean; // New prop to control automatic zoom to city bounds
  onItemClick?: (location: Location) => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

export const MapControl: React.FC<MapControlProps> = ({
  googleMapsApiKey,
  locations,
  cityName,
  mapContainerStyle = { height: "400px", width: "800px" },
  defaultCenter = { lat: 37.7749, lng: -122.4194 },
  defaultZoom = 12,
  renderMarkerContent = (location) => <div>{location.name}</div>,
  showDirections = false, // Default to false
  fitToCity = false, // Default to false
  onItemClick = () => {},
  onMapLoad = () => {},
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"], // Required for Geocoding API
  });
  const [visibleCategories, setVisibleCategories] = useState({
    restaurants: true,
    attractions: true,
    hotels: true,
    airports: true,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<Location[]>(locations);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Fetch directions if showDirections is true
      if (showDirections) {
        fetchDirections();
      }

      // Automatically fit the map to city bounds if fitToCity is true
      if (fitToCity && cityName) {
        fetchCityBounds(cityName);
      } else if (fitToCity) {
        fitMapToBounds(map);
      }

      onMapLoad(map);
    },
    [locations, showDirections, fitToCity, cityName, onMapLoad]
  );

  const handleItemClick = (location: Location) => {
    console.log("clicked location", location.name);
    //setSelectedLocation(location);
    //onItemClick(location);

    if (mapRef.current) {
      console.log("pan to location", location.name);
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      mapRef.current.setZoom(14);
    }
  };

  const handleCategoryToggle = (category: keyof typeof visibleCategories) => {
    const newVisibleCategories = {
      ...visibleCategories,
      [category]: !visibleCategories[category],
    };
    setVisibleCategories(newVisibleCategories);

    // Refit map to bounds if fitToCity is enabled
    // if (fitToCity && mapRef.current) {
    //   if (cityName) {
    //     fetchCityBounds(cityName);
    //   } else {
    //     fitMapToBounds(mapRef.current);
    //   }
    // }
  };

  const fetchDirections = useCallback(() => {
    if (locations.length < 2) return;

    const directionsService = new google.maps.DirectionsService();

    const waypoints = locations.slice(1, locations.length - 1).map((loc) => ({
      location: new google.maps.LatLng(loc.lat, loc.lng),
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(locations[0].lat, locations[0].lng),
        destination: new google.maps.LatLng(
          locations[locations.length - 1].lat,
          locations[locations.length - 1].lng
        ),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [locations]);

  const fitMapToBounds = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
      });
      map.fitBounds(bounds);
    },
    [locations]
  );

  const fetchCityBounds = useCallback((cityName: string, mapRef) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const bounds = results && results[0].geometry.bounds;
        if (bounds && mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      } else {
        console.error(
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <div style={{ width: "200px", padding: "10px" }}>
        <div className="flex gap-2">
          {Object.keys(visibleCategories).map((category) => (
            <label
              className="rounded-xl border border-slate-500 p-2 whitespace-nowrap"
              key={category}
            >
              <span className="pr-2"><input
                type="checkbox"
                className="hidden"
                checked={
                  visibleCategories[category as keyof typeof visibleCategories]
                }
                onChange={() => {
                  handleCategoryToggle(
                    category as keyof typeof visibleCategories
                  );
                  fetchCityBounds('San Francisco');
                }
                }
              /></span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <ul className="w-2/5">
          {markerRef.current
            .map((location) => (
              <li
                key={location.id}
                className="py-5 border-t border-slate-500"
                onMouseEnter={() => {
                  mapRef.current?.panTo({
                    lat: location.lat,
                    lng: location.lng,
                  });
                  mapRef.current?.setZoom(14);
                  onItemClick(location);
                }}
              >
                {location.name}
              </li>
            ))}
        </ul>

        <div className="relative flex-grow">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={defaultZoom}
            center={defaultCenter}
            onLoad={handleMapLoad}
            onZoomChanged={() => {
              console.log('zoom chnged');
              markerRef.current = [...markerRef.current, {
                id: stateLocations.length + 1,
                name: `Added ${stateLocations.length + 1}`,
                lat: Number(`37.7649`),
                lng: -122.3994,
                category: "airports",
              }]
            }}
          >
            {markerRef.current
              .map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  onClick={() => handleItemClick(location)}
                />
              ))}

            {showDirections && directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.6,
                    strokeWeight: 4,
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};
