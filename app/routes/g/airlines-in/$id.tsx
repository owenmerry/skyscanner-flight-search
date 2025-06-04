import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { MapPin, Plane, Star, TrendingUp, Calendar } from "lucide-react";

// Import your types: import type { AirlinesByLocationLoaderData, Location, Airline } from "~/types/seo";

interface Location {
  id: string;
  name: string;
  country: string;
  region: string;
  continent: string;
  airports: { code: string; name: string; }[];
  currency: string;
}

interface AirlineWithLocationData {
  iataCode: string;
  name: string;
  country: string;
  rating?: number;
  hub?: string;
  routesFromLocation: number;
  averagePriceFromLocation: number;
  popularDestinationsFromLocation: string[];
  strengths?: string[];
  baggage?: { carry: string; checked: string; };
  frequentFlyer?: string;
}

interface AirlinesByLocationLoaderData {
  location: Location;
  airlines: AirlineWithLocationData[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
  stats: {
    totalRoutes: number;
    averagePrice: number;
    mostPopularDestination: string;
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
        "name": `Airlines from ${location.name}`,
        "description": seoData.description,
        "url": `https://yoursite.com/airlines-in/${params.location}`,
        "about": {
          "@type": "Place",
          "name": location.name,
          "addressCountry": location.country
        }
      }
    }
  ];
};

export async function loader({ params }: LoaderArgs): Promise<Response> {
  const { id: locationParam } = params;
  
  if (!locationParam) {
    throw new Response("Location parameter missing", { status: 400 });
  }

  try {
    const location = await getLocationData(locationParam);
    if (!location) {
      throw new Response("Location not found", { status: 404 });
    }

    const [airlines, stats] = await Promise.all([
      getAirlinesByLocation(location.id),
      getLocationStats(location.id)
    ]);

    const seoData = {
      title: `Airlines from ${location.name} 2025 - Compare Flights & Carriers`,
      description: `Discover all airlines flying from ${location.name}, ${location.country}. Compare ${airlines.length} airlines, routes, prices, and services. Book flights from ${location.name} with the best carriers.`,
      keywords: [
        `airlines from ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} flights`,
        `${location.name.toLowerCase()} airport airlines`,
        `flights from ${location.name.toLowerCase()}`,
        `${location.name.toLowerCase()} carriers`,
        location.name.toLowerCase(),
        "airline comparison",
        "flight booking"
      ]
    };

    return json({
      location,
      airlines,
      seoData,
      stats
    });
  } catch (error) {
    console.error("Airlines by location error:", error);
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
      airports: [
        { code: "LHR", name: "Heathrow" },
        { code: "LGW", name: "Gatwick" },
        { code: "STN", name: "Stansted" },
        { code: "LTN", name: "Luton" }
      ]
    },
    "new-york": {
      id: "new-york",
      name: "New York",
      country: "United States",
      region: "North America",
      continent: "North America",
      currency: "USD",
      airports: [
        { code: "JFK", name: "John F. Kennedy" },
        { code: "LGA", name: "LaGuardia" },
        { code: "EWR", name: "Newark" }
      ]
    },
    "tokyo": {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      region: "Asia",
      continent: "Asia",
      currency: "JPY",
      airports: [
        { code: "NRT", name: "Narita" },
        { code: "HND", name: "Haneda" }
      ]
    }
  };
  
  return locations[locationParam] || null;
}

async function getAirlinesByLocation(locationId: string): Promise<AirlineWithLocationData[]> {
  // Mock data - replace with actual API
  const airlinesData: Record<string, AirlineWithLocationData[]> = {
    "london": [
      {
        iataCode: "BA",
        name: "British Airways",
        country: "United Kingdom",
        rating: 4.2,
        hub: "London Heathrow",
        routesFromLocation: 185,
        averagePriceFromLocation: 245,
        popularDestinationsFromLocation: ["New York", "Dubai", "Singapore", "Sydney", "Los Angeles"],
        strengths: ["Extensive network", "Premium cabins", "Heathrow hub"],
        baggage: { carry: "6kg", checked: "23kg" },
        frequentFlyer: "Executive Club"
      },
      {
        iataCode: "VS",
        name: "Virgin Atlantic",
        country: "United Kingdom",
        rating: 4.3,
        hub: "London Heathrow",
        routesFromLocation: 35,
        averagePriceFromLocation: 285,
        popularDestinationsFromLocation: ["New York", "Los Angeles", "Miami", "Las Vegas", "Boston"],
        strengths: ["Premium service", "Modern fleet", "US routes"],
        baggage: { carry: "10kg", checked: "23kg" },
        frequentFlyer: "Virgin Points"
      },
      {
        iataCode: "FR",
        name: "Ryanair",
        country: "Ireland",
        rating: 3.5,
        hub: "Multiple bases",
        routesFromLocation: 120,
        averagePriceFromLocation: 65,
        popularDestinationsFromLocation: ["Barcelona", "Rome", "Berlin", "Dublin", "Amsterdam"],
        strengths: ["Low prices", "Frequent flights", "European network"],
        baggage: { carry: "10kg", checked: "20kg" },
        frequentFlyer: "myRyanair"
      }
    ]
  };
  
  return airlinesData[locationId] || [];
}

async function getLocationStats(locationId: string) {
  return {
    totalRoutes: 340,
    averagePrice: 198,
    mostPopularDestination: "Paris"
  };
}

export default function AirlinesByLocationPage() {
  const { location, airlines, stats } = useLoaderData<typeof loader>() as AirlinesByLocationLoaderData;

  // Sort airlines by rating
  const sortedAirlines = airlines.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Airlines from {location.name}
              </h1>
            </div>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Discover all {airlines.length} airlines flying from {location.name}, {location.country}. 
              Compare routes, prices, and services to find the perfect flight for your journey.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>{airlines.length} Airlines</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>{stats.totalRoutes} Routes</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Avg ${stats.averagePrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Airports Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {location.name} Airports
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {location.airports.map((airport, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-lg p-4">
                <div className="text-lg font-bold text-gray-900">{airport.code}</div>
                <div className="text-sm text-gray-600">{airport.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airlines Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Airlines Operating from {location.name}
          </h2>
          <p className="text-gray-600 text-lg">
            Compare airlines by rating, routes, and average prices. Click on any airline to see detailed information and book flights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAirlines.map((airline, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Airline Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Plane className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{airline.name}</h3>
                      <p className="text-sm text-gray-600">{airline.iataCode} • {airline.country}</p>
                    </div>
                  </div>
                  {airline.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{airline.rating}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-gray-900">{airline.routesFromLocation}</div>
                    <div className="text-gray-600">Routes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-gray-900">${airline.averagePriceFromLocation}</div>
                    <div className="text-gray-600">Avg Price</div>
                  </div>
                </div>

                {/* Popular Destinations */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Popular Destinations</h4>
                  <div className="flex flex-wrap gap-1">
                    {airline.popularDestinationsFromLocation.slice(0, 3).map((dest, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {dest}
                      </span>
                    ))}
                    {airline.popularDestinationsFromLocation.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{airline.popularDestinationsFromLocation.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {airline.strengths?.slice(0, 2).map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Baggage & Program */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carry-on:</span>
                    <span className="font-medium">{airline.baggage?.carry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loyalty:</span>
                    <span className="font-medium text-xs">{airline.frequentFlyer}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <Link
                    to={`/airlines/${airline.iataCode.toLowerCase()}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    View Airline Details
                  </Link>
                  <Link
                    to={`/flights-from/${location.id}?airline=${airline.iataCode}`}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                  >
                    See {airline.name} Flights
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {location.name} Flight Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Plane className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{airlines.length}</div>
              <div className="text-gray-600">Airlines Operating</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRoutes}</div>
              <div className="text-gray-600">Total Routes</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">${stats.averagePrice}</div>
              <div className="text-gray-600">Average Flight Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Guide to Airlines from {location.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Major Airlines & Hubs</h3>
                <p className="text-gray-600 mb-4">
                  {location.name} serves as a major aviation hub in {location.region}, with {location.airports.length} airports 
                  connecting travelers to destinations worldwide. The city is home to several major airline hubs and serves 
                  as a gateway to {location.continent}.
                </p>
                <p className="text-gray-600">
                  Top-rated airlines from {location.name} include full-service carriers offering premium amenities, 
                  as well as low-cost airlines providing budget-friendly options for price-conscious travelers.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Choosing the Right Airline</h3>
                <p className="text-gray-600 mb-4">
                  When flying from {location.name}, consider factors such as route network, service quality, baggage policies, 
                  and loyalty programs. Full-service carriers typically offer more amenities and flexibility, while 
                  low-cost carriers focus on competitive pricing.
                </p>
                <p className="text-gray-600">
                  The most popular destination from {location.name} is {stats.mostPopularDestination}, with an average 
                  flight price of ${stats.averagePrice}. Book in advance for the best deals and consider joining 
                  frequent flyer programs for additional benefits.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Airport Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {location.airports.map((airport, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{airport.name} Airport ({airport.code})</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      One of {location.name}'s major airports, serving multiple airlines with both domestic and international routes.
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
