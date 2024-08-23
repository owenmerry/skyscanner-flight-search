import type { Location } from "~/components/ui/map/map-control.component";
import { MapControl } from "~/components/ui/map/map-control.component";
import type { Markers } from "~/helpers/map";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MarketingMapControlProps {
  googleMapId: string;
  googleApiKey: string;
  to?: Place;
  from: Place;
  search: IndicativeQuotesSDK[];
  level?: "city" | "country" | "continent" | "everywhere";
}
export const MarketingMapControl = ({
  search,
  level,
  to,
  from,
  googleMapId,
  googleApiKey,
}: MarketingMapControlProps) => {
  const getMarkers = (search: IndicativeQuotesSDK[]): Markers[] => {
    const markers: Markers[] = [];

    //locations
    const searchFiltered = search.filter((item) =>
      to ? item.parentsString.includes(to.entityId) : true
    );
    for (const flight of searchFiltered) {
      const check = markers.filter(
        (item) =>
          item.location.lat === flight.query.to.coordinates.latitude &&
          item.location.lng === flight.query.to.coordinates.longitude
      );
      if (check.length === 0) {
        markers.push({
          location: {
            lat: flight.query.to.coordinates.latitude,
            lng: flight.query.to.coordinates.longitude,
          },
          label: `
      <div class="relative bg-primary-700 p-2 rounded-lg ">
      
      <div class="text-white text-sm">
        <a>
        <div>${flight.query.to.name}</div>
        <div className='font-bold'>${flight.price.display}</div>
        </a>
      </div>
        
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-primary-700 "></div>
      </div>`,
          link: `/search/${flight.query.from.iata}/${flight.query.to.iata}/${flight.query.depart}/${flight.query.return}`,
          icon: "\ue539",
        });
      }
    }

    //from
    markers.push({
      location: {
        lat: from.coordinates.latitude,
        lng: from.coordinates.longitude,
      },
      label: `<div class='rounded-full w-5 h-5 bg-pink-600 border-white border-2 shadow animate-bounce'></div>`,
    });

    return markers;
  };
  //const [markers] = useState<Markers[]>(getMarkers(search));
  const locations: Location[] = [
    {
      id: 1,
      name: "Restaurant A",
      lat: 37.7749,
      lng: -122.4194,
      category: "restaurants",
    },
    {
      id: 2,
      name: "Attraction B",
      lat: 37.7849,
      lng: -122.4094,
      category: "attractions",
    },
    {
      id: 3,
      name: "Hotel C",
      lat: 37.7649,
      lng: -122.4294,
      category: "hotels",
    },
    {
      id: 4,
      name: "Airport D",
      lat: 37.8049,
      lng: -122.3994,
      category: "airports",
    },
  ];

  return (
    <div className="">
      <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
        <div className="flex justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-blue-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v6M9.5 9A2.5 2.5 0 0 1 12 6.5"
            />
          </svg>
        </div>
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Explore {level !== "everywhere" ? to?.name : "Everywhere"} by Map
        </h2>
        <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
          We are strategists, designers and developers. Innovators and problem
          solvers. Small enough to be simple and quick, but big enough to
          deliver the scope you want at the pace you need {search.length}.
        </p>
        {/* <div className="flex py-3">
          <div onClick={addLondon} className="py-3 px-3 rounded-lg cursor-pointer bg-slate-600 text-white font-bold text-sm">Add London (markers: {markers.length})</div>
        </div> */}
        <div className="py-8">
          <MapControl
            googleMapsApiKey={googleApiKey} // Replace with your actual API key
            locations={locations}
            cityName="San Francisco" // The city to fit the map to
            fitToCity={false} // Automatically fit the map to the city bounds
            showDirections={false} // Show driving directions between locations
            onItemClick={(location) => {
              console.log("Location clicked:", location.name);
            }}
            mapContainerStyle={{ height: "600px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
