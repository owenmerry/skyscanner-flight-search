import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { MapPin, Plane, Calendar, TrendingUp, Filter, Clock } from "lucide-react";

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
}

interface FlightDestination {
  destination: {
    code: string;
    city: string;
    country: string;
  };
  price: number;
  airline: string;
  flightTime: string;
  frequency: number; // flights per week
  popularMonths: string[];
}

interface LocationPageLoaderData {
  location: Location;
  topDestinations: FlightDestination[];
  nearbyLocations: { name: string; distance: string; }[];
  seasonalDestinations: {
    summer: FlightDestination[];
    winter: FlightDestination[];
  };
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
  stats: {
    totalDestinations: number;
    averagePrice: number;
    cheapestDestination: string;
    mostExpensiveDestination: string;
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
        "name": `Flights from ${location.name}`,
        "description": seoData.description,
        "url": `https://yoursite.com/flights-from/${params.location}`,
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
  const month = url.searchParams.get("month");
  const priceRange = url.searchParams.get("priceRange");

  try {
    const location = await getLocationData(locationParam);
    if (!location) {
      throw new Response("Location not found", { status: 404 });
    }

    const [topDestinations, nearbyLocations, seasonalDestinations, stats] = await Promise.all([
      getTopDestinationsFromLocation(location.id, { sortBy, month, priceRange }),
      getNearbyLocations(location.id),
      getSeasonalDestinations(location.id),
      getLocationFlightStats(location.id)
    ]);

    const seoData = {
      title: `Flights from ${location.name} 2025 - ${stats.totalDestinations} Destinations, Compare Prices`,
      description: `Find flights from ${location.name}, ${location.country} to ${stats.totalDestinations} destinations worldwide. Compare prices starting from $${stats.averagePrice}. Book cheap flights from ${location.name} today.`,
      keywords: [
        `flights from ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} flights`,
        `${location.name.toLowerCase()} departures`,
        `cheap flights from ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} to destinations`,
        location.name.toLowerCase(),
        "flight booking",
        "flight deals"
      ]
    };

    return json({
      location,
      topDestinations,
      nearbyLocations,
      seasonalDestinations,
      seoData,
      stats
    });
  } catch (error) {
    console.error("Flights from location error:", error);
    throw new Response("Failed to load location data", { status: 500 });
  }
}

// Mock functions - replace with your actual API calls
async function getLocationData(locationParam: string): Promise<Location | null> {
  const locations: Record<string, Location> = {
    "london": {
      id: "london",
      name: "London",
      country: "United Kingdom",
      region: "Europe",
      continent: "Europe",
      currency: "GBP",
      timezone: "GMT",
      airports: [
        { code: "LHR", name: "Heathrow" },
        { code: "LGW", name: "Gatwick" },
        { code: "STN", name: "Stansted" },
        { code: "LTN", name: "Luton" }
      ]
    },
    "paris": {
      id: "paris",
      name: "Paris",
      country: "France",
      region: "Europe",
      continent: "Europe",
      currency: "EUR",
      timezone: "CET",
      airports: [
        { code: "CDG", name: "Charles de Gaulle" },
        { code: "ORY", name: "Orly" }
      ]
    }
  };
  
  return locations[locationParam] || null;
}

async function getTopDestinationsFromLocation(locationId: string, filters: any): Promise<FlightDestination[]> {
  // Mock data - replace with actual API
  const destinations: FlightDestination[] = [
    {
      destination: { code: "JFK", city: "New York", country: "United States" },
      price: 299,
      airline: "British Airways",
      flightTime: "8h 15m",
      frequency: 14,
      popularMonths: ["June", "July", "August", "December"]
    },
    {
      destination: { code: "CDG", city: "Paris", country: "France" },
      price: 89,
      airline: "EasyJet",
      flightTime: "1h 30m",
      frequency: 35,
      popularMonths: ["April", "May", "June", "September"]
    },
    {
      destination: { code: "DXB", city: "Dubai", country: "UAE" },
      price: 245,
      airline: "Emirates",
      flightTime: "7h 30m",
      frequency: 21,
      popularMonths: ["November", "December", "January", "February"]
    },
    {
      destination: { code: "BCN", city: "Barcelona", country: "Spain" },
      price: 75,
      airline: "Ryanair",
      flightTime: "2h 15m",
      frequency: 28,
      popularMonths: ["May", "June", "July", "August", "September"]
    },
    {
      destination: { code: "AMS", city: "Amsterdam", country: "Netherlands" },
      price: 95,
      airline: "KLM",
      flightTime: "1h 20m",
      frequency: 42,
      popularMonths: ["April", "May", "June", "July", "August"]
    }
  ];

  // Apply sorting
  if (filters.sortBy === "price") {
    destinations.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "duration") {
    destinations.sort((a, b) => a.flightTime.localeCompare(b.flightTime));
  }

  return destinations;
}

async function getNearbyLocations(locationId: string) {
  return [
    { name: "Manchester", distance: "200 miles" },
    { name: "Birmingham", distance: "120 miles" },
    { name: "Edinburgh", distance: "400 miles" }
  ];
}

async function getSeasonalDestinations(locationId: string) {
  return {
    summer: [
      {
        destination: { code: "ATH", city: "Athens", country: "Greece" },
        price: 125,
        airline: "Aegean Airlines",
        flightTime: "3h 30m",
        frequency: 14,
        popularMonths: ["June", "July", "August"]
      }
    ],
    winter: [
      {
        destination: { code: "DXB", city: "Dubai", country: "UAE" },
        price: 245,
        airline: "Emirates",
        flightTime: "7h 30m",
        frequency: 21,
        popularMonths: ["December", "January", "February"]
      }
    ]
  };
}

async function getLocationFlightStats(locationId: string) {
  return {
    totalDestinations: 185,
    averagePrice: 165,
    cheapestDestination: "Amsterdam",
    mostExpensiveDestination: "Tokyo"
  };
}

export default function FlightsFromLocationPage() {
  const { location, topDestinations, nearbyLocations, seasonalDestinations, stats } = useLoaderData<typeof loader>() as LocationPageLoaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flights from {location.name}
              </h1>
            </div>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Discover {stats.totalDestinations} destinations from {location.name}, {location.country}. 
              Compare prices starting from ${topDestinations[0]?.price} and find the perfect flight for your next adventure.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{stats.totalDestinations} Destinations</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>From ${topDestinations[0]?.price}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Year-round flights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</div>
              <div className="text-sm text-gray-600">Total Destinations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${stats.averagePrice}</div>
              <div className="text-sm text-gray-600">Average Price</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{location.airports.length}</div>
              <div className="text-sm text-gray-600">Airports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{location.timezone}</div>
              <div className="text-sm text-gray-600">Timezone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Form method="get" className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <select 
              name="sortBy" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Flight Duration</option>
              <option value="popularity">Popularity</option>
            </select>
            <select 
              name="month" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              <option value="summer">Summer (Jun-Aug)</option>
              <option value="winter">Winter (Dec-Feb)</option>
              <option value="spring">Spring (Mar-May)</option>
              <option value="autumn">Autumn (Sep-Nov)</option>
            </select>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Apply Filters
            </button>
          </Form>
        </div>
      </div>

      {/* Top Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Destinations from {location.name}
          </h2>
          <p className="text-gray-600 text-lg">
            Discover the most popular flight routes from {location.name}. Compare prices, flight times, and airlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topDestinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Destination Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{destination.destination.city}</h3>
                    <p className="text-sm text-gray-600">{destination.destination.code} • {destination.destination.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${destination.price}</div>
                    <div className="text-sm text-gray-600">from</div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Flight Time:</span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {destination.flightTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{destination.frequency}/week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Popular Airline:</span>
                    <span className="font-medium">{destination.airline}</span>
                  </div>
                </div>

                {/* Popular Months */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Best months to visit:</div>
                  <div className="flex flex-wrap gap-1">
                    {destination.popularMonths.slice(0, 3).map((month, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    to={`/flights/${location.airports[0].code.toLowerCase()}/to/${destination.destination.code.toLowerCase()}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    Book Flight
                  </Link>
                  <Link
                    to={`/route-guide/${location.airports[0].code.toLowerCase()}/${destination.destination.code.toLowerCase()}`}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    View Route Guide
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Destinations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Seasonal Destinations from {location.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Summer */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                ☀️ Summer Destinations
              </h3>
              <p className="text-gray-600 mb-4">Perfect for warm weather getaways and beach vacations.</p>
              <div className="space-y-3">
                {seasonalDestinations.summer.map((dest, index) => (
                  <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <div className="font-medium">{dest.destination.city}</div>
                      <div className="text-sm text-gray-600">{dest.flightTime} • {dest.airline}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${dest.price}</div>
                      <div className="text-xs text-gray-500">from</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                ❄️ Winter Destinations
              </h3>
              <p className="text-gray-600 mb-4">Escape the cold or embrace winter sports and activities.</p>
              <div className="space-y-3">
                {seasonalDestinations.winter.map((dest, index) => (
                  <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <div className="font-medium">{dest.destination.city}</div>
                      <div className="text-sm text-gray-600">{dest.flightTime} • {dest.airline}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${dest.price}</div>
                      <div className="text-xs text-gray-500">from</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Airports */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Alternative Departure Cities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {nearbyLocations.map((nearby, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{nearby.name}</h3>
                <p className="text-gray-600 mb-4">{nearby.distance} from {location.name}</p>
                <Link
                  to={`/flights-from/${nearby.name.toLowerCase().replace(' ', '-')}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Flights
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Guide to Flights from {location.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Popular Routes & Destinations</h3>
                <p className="text-gray-600 mb-4">
                  {location.name} offers direct flights to {stats.totalDestinations} destinations across {location.continent} and beyond. 
                  The most affordable destination is {stats.cheapestDestination}, while {stats.mostExpensiveDestination} represents 
                  the premium long-haul option.
                </p>
                <p className="text-gray-600">
                  Flight prices from {location.name} vary by season, with summer months typically seeing higher demand 
                  for European beach destinations and winter months popular for warm-weather escapes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">When to Book & Travel</h3>
                <p className="text-gray-600 mb-4">
                  For the best deals from {location.name}, book flights 6-8 weeks in advance for European destinations 
                  and 8-12 weeks for long-haul routes. The cheapest days to fly are typically Tuesday and Wednesday.
                </p>
                <p className="text-gray-600">
                  {location.name} operates in {location.timezone} timezone, which can affect flight schedules and 
                  jet lag considerations for international travel.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{location.name} Airport Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {location.airports.map((airport, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{airport.name} ({airport.code})</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      One of {location.name}'s major airports, offering connections to domestic and international destinations.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
