import { useEffect, useState } from "react";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface TripadvisorNearByResponse {
  data: TripadvisorNearByData[];
}
interface TripadvisorNearByData{
  address_obj: {
    street1?: string;
    street2?: string;
    city: string;
    state?: string;
    address_string: string;
    country: string;
    postalcode: string;
  };
  location_id: string;
  name: string;
}
interface TripadvisorImagesResponse {
  data: TripadvisorImagesData[];
}
interface TripadvisorImagesData {
  id: number;
    is_blessed: boolean;
    caption: string;
    published_date: string;
    images: {
      thumbnail: {
        height: number;
        width: number;
        url: string;
      };
      small: {
        height: number;
        width: number;
        url: string;
      };
      medium: {
        height: number;
        width: number;
        url: string;
      };
      large: {
        height: number;
        width: number;
        url: string;
      };
      original: {
        height: number;
        width: number;
        url: string;
      };
    };
    album: string;
    source: {
      name: string;
      localized_name: string;
    };
    user: {
      username: string;
    };
}
export interface TripadvisorDetailsResponse {
  data: TripadvisorDetailsData;
}
interface TripadvisorDetailsData {}

interface TripadvisorSDK {
  location: TripadvisorNearByData;
  images: TripadvisorImagesData[];
  details: TripadvisorDetailsData;
}

interface MarketingNearbyProps {
  search: IndicativeQuotesSDK[];
  to: Place;
}

// const mockNearBy: TripadvisorNearByResponse[] = [
//   {
//     location_id: "553603",
//     name: "London Eye",
//     address_obj: {
//       street1: "Westminster Bridge Road",
//       street2: "Riverside Building, County Hall",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "SE1 7PB",
//       address_string:
//         "Westminster Bridge Road Riverside Building, County Hall, London SE1 7PB England",
//     },
//   },
//   {
//     location_id: "187547",
//     name: "Tower of London",
//     address_obj: {
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "EC3N 4AB",
//       address_string: "London EC3N 4AB England",
//     },
//   },
//   {
//     location_id: "187536",
//     name: "London Underground",
//     address_obj: {
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "SW1H 0TL",
//       address_string: "London SW1H 0TL England",
//     },
//   },
//   {
//     location_id: "187553",
//     name: "London Zoo",
//     address_obj: {
//       street1: "Outer Circle",
//       street2: "Regents Park",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "NW1 4RY",
//       address_string: "Outer Circle Regents Park, London NW1 4RY England",
//     },
//   },
//   {
//     location_id: "189027",
//     name: "The London Dungeon",
//     address_obj: {
//       street1: "Westminster Bridge Road",
//       street2: "County Hall",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "SE1 7PB",
//       address_string:
//         "Westminster Bridge Road County Hall, London SE1 7PB England",
//     },
//   },
//   {
//     location_id: "522874",
//     name: "Liberty London",
//     address_obj: {
//       street1: "Regent St",
//       street2: "Main entrance: Great Marlborough Street",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "W1B 5AH",
//       address_string:
//         "Regent St Main entrance: Great Marlborough Street, London W1B 5AH England",
//     },
//   },
//   {
//     location_id: "12035544",
//     name: "Westfield London",
//     address_obj: {
//       street1: "Ariel Way",
//       street2: "Shepherds Bush",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "W12 7GF",
//       address_string: "Ariel Way Shepherds Bush, London W12 7GF England",
//     },
//   },
//   {
//     location_id: "7914853",
//     name: "London Bridge",
//     address_obj: {
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "EC4R 9HA",
//       address_string: "London EC4R 9HA England",
//     },
//   },
//   {
//     location_id: "187739",
//     name: "London Walks",
//     address_obj: {
//       street2: "",
//       city: "London",
//       country: "United Kingdom",
//       postalcode: "NW6 4LW",
//       address_string: "London NW6 4LW England",
//     },
//   },
//   {
//     location_id: "2190135",
//     name: "London's Farmers Market",
//     address_obj: {
//       street1: "900 King Street",
//       street2: "",
//       city: "London",
//       state: "Ontario",
//       country: "Canada",
//       postalcode: "N5Y 5P8",
//       address_string: "900 King Street, London, Ontario N5Y 5P8 Canada",
//     },
//   },
// ];

export const MarketingNearby = ({ search, to }: MarketingNearbyProps) => {
  const [locations, setLocations] = useState<TripadvisorSDK[]>([]);

  const runLocations = async () => {
    const res = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/search?key=51E86DB2EC7940CD8B8AAF2A48B1836B&searchQuery=${to.name}&category=attractions&language=en`
    );
    const data: TripadvisorNearByResponse = await res.json();
    
    console.log(data);
    
    let tripSDK: TripadvisorSDK[] = [];
    for (const tripLocation of data.data) {
      console.log('run', `https://api.content.tripadvisor.com/api/v1/location/${tripLocation.location_id}/photos?language=en&key=51E86DB2EC7940CD8B8AAF2A48B1836B`);
      const resImages = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${tripLocation.location_id}/photos?language=en&key=51E86DB2EC7940CD8B8AAF2A48B1836B`
      );
      const dataImages: TripadvisorImagesResponse = await resImages.json();

      tripSDK.push({
        location: tripLocation,
        images: dataImages.data,
        details: {},
      });
    }

    console.log(tripSDK);
    setLocations(tripSDK);
  };

  useEffect(() => {
    runLocations();
  }, []);

  return (
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        What to do in {to.name}
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        We are strategists, designers and developers. Innovators and problem
        solvers. Small enough to be simple and quick, but big enough to deliver
        the scope you want at the pace you need.
      </p>
      <div className="m-6 grid grid-cols-3 gap-2">
        {locations.map((location) => {
          return (
            <div
              key={location.location.location_id}
              className="min-w-96 sm:min-w-0"
            >
              <a
                href={`/`}
                className="relative block bg-white border border-gray-200  rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:dark:border-gray-500"
              >
                <div
                  className="h-40 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${location.images[0].images.medium.url})`,
                  }}
                ></div>
                <h5 className="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {location.location.name}
                </h5>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
