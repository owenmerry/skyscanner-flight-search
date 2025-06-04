import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { MapPin, Plane, Calendar, TrendingUp, Users, Star } from "lucide-react";

// Import your types: import type { LocationPageLoaderData, Location, Airport } from "~/types/seo";

interface Location {
  id: string;
  name: string;
  country: string;
  region: string;
  continent: string;
  airports: { code: string; name: string; }[];
  currency: string;
  timezone: string;
  attractions?: string[];
}

interface FlightOrigin {
  origin: {
    code: string;
    city: string;
    country: string;
  };
  price: number;
  airline: string;
  flightTime: string;
  frequency: number; // flights per week
  directFlight: boolean;
}

interface LocationPageLoaderData {
  location: Location;
  topOrigins: FlightOrigin[];
  regionalOrigins: {
    [region: string]: FlightOrigin[];
  };
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
  stats: {
    totalOrigins: number;
    averagePrice: number;
    cheapestOrigin: string;
    mostPopularOrigin: string;
  };
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      { title: "Location Not Found" },
      { name: "robots", content: "noindex" }
    ];
  }

  const { location, seoData } = data;
  
  return [
    { title: seoData.title },
    { name: "description", content: seoData.description },
    { name: "keywords", content: seoData.keywords.join(", ") },
    { property: "og:title", content: seoData.title },
    { property: "og:description", content: seoData.description },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // Structured data
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "TravelGuide",
        "name": `Flights to ${location.name}`,
        "description": seoData.description,
        "url": `https://yoursite.com/flights-to/${params.location}`,
        "about": {
          "@type": "Place",
          "name": location.name,
          "addressCountry": location.country
        }
      }
    }
  ];
};

export async function loader({ params, request }: LoaderArgs): Promise<Response> {
  const { location: locationParam } = params;
  
  if (!locationParam) {
    throw new Response("Location parameter missing", { status: 400 });
  }

  const url = new URL(request.url);
  const sortBy = url.searchParams.get("sortBy") || "price";
  const region = url.searchParams.get("region");

  try {
    const location = await getLocationData(locationParam);
    if (!location) {
      throw new Response("Location not found", { status: 404 });
    }

    const [topOrigins, regionalOrigins, stats] = await Promise.all([
      getTopOriginsToLocation(location.id, { sortBy, region }),
      getRegionalOrigins(location.id),
      getLocationArrivalStats(location.id)
    ]);

    const seoData = {
      title: `Flights to ${location.name} 2025 - ${stats.totalOrigins} Origins, Compare Airlines & Prices`,
      description: `Find flights to ${location.name}, ${location.country} from ${stats.totalOrigins} cities worldwide. Compare prices from $${stats.averagePrice}. Book flights to ${location.name} with top airlines.`,
      keywords: [
        `flights to ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} flights`,
        `${location.name.toLowerCase()} arrivals`,
        `fly to ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} airport`,
        location.name.toLowerCase(),
        "flight booking",
        "cheap flights"
      ]
    };

    return json({
      location,
      topOrigins,
      regionalOrigins,
      seoData,
      stats
    });
  } catch (error) {
    console.error("Flights to location error:", error);
    throw new Response("Failed to load location data", { status: 500 });
  }
}

// Mock functions - replace with your actual API calls
async function getLocationData(locationParam: string): Promise<Location | null> {
  const locations: Record<string, Location> = {
    "tokyo": {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      region: "Asia",
      continent: "Asia",
      currency: "JPY",
      timezone: "JST",
      airports: [
        { code: "NRT", name: "Narita International" },
        { code: "HND", name: "Haneda" }
      ],
      attractions: ["Shibuya Crossing", "Tokyo Tower", "Sensoji Temple", "Imperial Palace"]
    },
    "dubai": {
      id: "dubai",
      name: "Dubai",
      country: "UAE",
      region: "Middle East",
      continent: "Asia",
      currency: "AED",
      timezone: "GST",
      airports: [
        { code: "DXB", name: "Dubai International" },
        { code: "DWC", name: "Al Maktoum International" }
      ],
      attractions: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Fountain"]
    }
  };
  
  return locations[locationParam] || null;
}

async function getTopOriginsToLocation(locationId: string, filters: any): Promise<FlightOrigin[]> {
  const origins: FlightOrigin[] = [
    {
      origin: { code: "LHR", city: "London", country: "United Kingdom" },
      price: 456,
      airline: "British Airways",
      flightTime: "11h 45m",
      frequency: 14,
      directFlight: true
    },
    {
      origin: { code: "LAX", city: "Los Angeles", country: "United States" },
      price: 589,
      airline: "Japan Airlines",
      flightTime: "11h 30m",
      frequency: 21,
      directFlight: true
    },
    {
      origin: { code: "SIN", city: "Singapore", country: "Singapore" },
      price: 234,
      airline: "Singapore Airlines",
      flightTime: "7h 20m",
      frequency: 35,
      directFlight: true
    },
    {
      origin: { code: "ICN", city: "Seoul", country: "South Korea" },
      price: 189,
      airline: "Korean Air",
      flightTime: "2h 15m",
      frequency: 42,
      directFlight: true
    },
    {
      origin: { code: "BKK", city: "Bangkok", country: "Thailand" },
      price: 298,
      airline: "Thai Airways",
      flightTime: "6h 30m",
      frequency: 28,
      directFlight: true
    }
  ];

  if (filters.sortBy === "price") {
    origins.sort((a, b) => a.price - b.price);
  }

  return origins;
}

async function getRegionalOrigins(locationId: string) {
  return {
    "Asia": [
      {
        origin: { code: "ICN", city: "Seoul", country: "South Korea" },
        price: 189,
        airline: "Korean Air",
        flightTime: "2h 15m",
        frequency: 42,
        directFlight: true
      },
      {
        origin: { code: "PVG", city: "Shanghai", country: "China" },
        price: 245,
        airline: "China Eastern",
        flightTime: "3h 30m",
        frequency: 35,
        directFlight: true
      }
    ],
    "Europe": [
      {
        origin: { code: "LHR", city: "London", country: "United Kingdom" },
        price: 456,
        airline: "British Airways",
        flightTime: "11h 45m",
        frequency: 14,
        directFlight: true
      }
    ],
    "North America": [
      {
        origin: { code: "LAX", city: "Los Angeles", country: "United States" },
        price: 589,
        airline: "Japan Airlines",
        flightTime: "11h 30m",
        frequency: 21,
        directFlight: true
      }
    ]
  };
}

async function getLocationArrivalStats(locationId: string) {
  return {
    totalOrigins: 145,
    averagePrice: 342,
    cheapestOrigin: "Seoul",
    mostPopularOrigin: "Singapore"
  };
}

export default function FlightsToLocationPage() {
  const { location, topOrigins, regionalOrigins, stats } = useLoaderData<typeof loader>() as LocationPageLoaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flights to {location.name}
              </h1>
            </div>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto mb-8">
              Find flights to {location.name}, {location.country} from {stats.totalOrigins} cities worldwide. 
              Compare airlines and prices starting from ${topOrigins[0]?.price}.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>{stats.totalOrigins} Origins</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>From ${topOrigins[0]?.price}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Multiple Airlines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{location.airports.length}</div>
              <div className="text-sm text-gray-600">Airports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{location.timezone}</div>
              <div className="text-sm text-gray-600">Local Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{location.currency}</div>
              <div className="text-sm text-gray-600">Currency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${stats.averagePrice}</div>
              <div className="text-sm text-gray-600">Avg Flight Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Form method="get" className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter origins:</span>
            <select 
              name="sortBy" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Flight Duration</option>
              <option value="frequency">Flight Frequency</option>
            </select>
            <select 
              name="region" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="north-america">North America</option>
              <option value="oceania">Oceania</option>
            </select>
            <button 
              type="submit" 
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Apply Filters
            </button>
          </Form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Origins */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Origins to {location.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topOrigins.map((origin, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{origin.origin.city}</h3>
                      <p className="text-sm text-gray-600">{origin.origin.code} • {origin.origin.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-rose-600">${origin.price}</div>
                      <div className="text-sm text-gray-600">from</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Flight Time:</span>
                      <span className="font-medium">{origin.flightTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium">{origin.frequency}/week</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Airline:</span>
                      <span className="font-medium">{origin.airline}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Direct:</span>
                      <span className="font-medium">{origin.directFlight ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/flights/${origin.origin.code.toLowerCase()}/to/${location.airports[0].code.toLowerCase()}`}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                    >
                      Book Flight
                    </Link>
                    <Link
                      to={`/route-guide/${origin.origin.code.toLowerCase()}/${location.airports[0].code.toLowerCase()}`}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                    >
                      Route Guide
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Origins */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Flights to {location.name} by Region
          </h2>
          
          {Object.entries(regionalOrigins).map(([region, origins]) => (
            <div key={region} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                🌍 {region}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {origins.map((origin, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{origin.origin.city}</h4>
                        <p className="text-sm text-gray-600">{origin.origin.code} • {origin.origin.country}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {origin.flightTime} • {origin.airline} • {origin.frequency}/week
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-rose-600">${origin.price}</div>
                        <Link 
                          to={`/flights/${origin.origin.code.toLowerCase()}/to/${location.airports[0].code.toLowerCase()}`}
                          className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                        >
                          Book →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination Info */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About {location.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {location.name} is a major destination in {location.region}, attracting visitors from around the world. 
                The city is served by {location.airports.length} major airports, making it easily accessible from {stats.totalOrigins} cities globally.
              </p>
              <p className="text-gray-600">
                Most popular arrival city is {stats.mostPopularOrigin}, while the most affordable flights typically come from {stats.cheapestOrigin}. 
                Average flight prices to {location.name} are around ${stats.averagePrice}.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Airport Information</h3>
              <div className="space-y-4">
                {location.airports.map((airport, index) => (
                  <div key={index} className="border-l-4 border-rose-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{airport.name} ({airport.code})</h4>
                    <p className="text-gray-600 text-sm">
                      Major international airport serving {location.name} with connections worldwide.
                    </p>
                  </div>
                ))}
              </div>
              
              {location.attractions && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Top Attractions</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.attractions.slice(0, 4).map((attraction, index) => (
                      <span key={index} className="bg-rose-100 text-rose-800 text-sm px-3 py-1 rounded-full">
                        {attraction}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
