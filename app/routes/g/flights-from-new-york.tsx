import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { MapPin, Plane, Star, TrendingUp, Clock } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Flights from New York (NYC) - JFK, LGA, EWR | Cheap NYC Flights" },
    { 
      name: "description", 
      content: "Find cheap flights from New York City (JFK, LaGuardia, Newark). Compare airlines and prices for flights departing from NYC to destinations worldwide." 
    },
    { name: "keywords", content: "flights from New York, NYC flights, JFK flights, LaGuardia flights, Newark flights, New York airport, flights from NYC" },
    { property: "og:title", content: "Flights from New York City - Compare NYC Flight Deals" },
    { property: "og:description", content: "Find the best flight deals departing from New York City airports. Compare prices and book cheap flights from NYC." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded NYC flight data
  const nycAirports = [
    {
      code: "JFK",
      name: "John F. Kennedy International Airport",
      location: "Queens, NY",
      airlines: 90,
      destinations: 180,
      type: "Major International Hub"
    },
    {
      code: "LGA", 
      name: "LaGuardia Airport",
      location: "Queens, NY",
      airlines: 45,
      destinations: 95,
      type: "Domestic & Short-Haul"
    },
    {
      code: "EWR",
      name: "Newark Liberty International Airport", 
      location: "Newark, NJ",
      airlines: 65,
      destinations: 140,
      type: "International Gateway"
    }
  ];

  const popularDestinations = [
    {
      city: "London",
      country: "United Kingdom",
      airport: "LHR",
      price: 485,
      flightTime: "7h 30m",
      airlines: ["British Airways", "Virgin Atlantic", "American Airlines"],
      slug: "jfk/to/lhr",
      popularity: "Most Popular"
    },
    {
      city: "Los Angeles", 
      country: "United States",
      airport: "LAX",
      price: 245,
      flightTime: "6h 15m",
      airlines: ["JetBlue", "American Airlines", "Delta"],
      slug: "jfk/to/lax",
      popularity: "#2 Domestic"
    },
    {
      city: "Paris",
      country: "France", 
      airport: "CDG",
      price: 520,
      flightTime: "8h 45m",
      airlines: ["Air France", "Delta", "American Airlines"],
      slug: "jfk/to/cdg",
      popularity: "Trending"
    },
    {
      city: "Miami",
      country: "United States",
      airport: "MIA", 
      price: 185,
      flightTime: "3h 15m",
      airlines: ["JetBlue", "American Airlines", "Delta"],
      slug: "lga/to/mia",
      popularity: "Winter Favorite"
    },
    {
      city: "Tokyo",
      country: "Japan",
      airport: "NRT",
      price: 750,
      flightTime: "14h 20m",
      airlines: ["Japan Airlines", "All Nippon Airways", "United"],
      slug: "jfk/to/nrt",
      popularity: "Business Hub"
    },
    {
      city: "Barcelona",
      country: "Spain",
      airport: "BCN",
      price: 395,
      flightTime: "8h 30m", 
      airlines: ["Level", "American Airlines", "Delta"],
      slug: "jfk/to/bcn",
      popularity: "Summer Hot Spot"
    }
  ];

  const seasonalDeals = [
    {
      season: "Spring (Mar-May)",
      destinations: ["London", "Paris", "Amsterdam"],
      savings: "Up to 35%",
      description: "Perfect weather, fewer crowds"
    },
    {
      season: "Summer (Jun-Aug)", 
      destinations: ["Barcelona", "Rome", "Athens"],
      savings: "Up to 25%",
      description: "Peak season, book early"
    },
    {
      season: "Fall (Sep-Nov)",
      destinations: ["Tokyo", "Seoul", "Dubai"], 
      savings: "Up to 40%",
      description: "Great weather, best deals"
    },
    {
      season: "Winter (Dec-Feb)",
      destinations: ["Miami", "Los Angeles", "Las Vegas"],
      savings: "Up to 30%",
      description: "Escape the cold"
    }
  ];

  return json({ nycAirports, popularDestinations, seasonalDeals });
}

export default function FlightsFromNewYork() {
  const { nycAirports, popularDestinations, seasonalDeals } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flights from New York City
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find cheap flights departing from NYC's three major airports: JFK, LaGuardia, and Newark. 
              Compare prices to 180+ destinations worldwide.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>3 Major Airports</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>200+ Airlines</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NYC Airports Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New York City Airports
          </h2>
          <p className="text-gray-600 text-lg">
            NYC is served by three major airports, each offering unique advantages for different types of travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nycAirports.map((airport, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {airport.code} - {airport.name.split(' ').slice(0, 3).join(' ')}
                </h3>
                <p className="text-gray-600">{airport.location}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                  {airport.type}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Airlines:</span>
                  <span className="font-semibold">{airport.airlines}+</span>
                </div>
                <div className="flex justify-between">
                  <span>Destinations:</span>
                  <span className="font-semibold">{airport.destinations}+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Destinations from New York
            </h2>
            <p className="text-gray-600 text-lg">
              Top flight routes from NYC based on passenger volume and search popularity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest, index) => (
              <Link 
                key={index} 
                to={`/flights/${dest.slug}`}
                className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      {dest.popularity}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${dest.price}
                      </div>
                      <div className="text-sm text-gray-500">from NYC</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {dest.city}
                    </h3>
                    <p className="text-gray-600">{dest.country}</p>
                    <p className="text-sm text-gray-500">{dest.airport} Airport</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Flight time: {dest.flightTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      Airlines: {dest.airlines.slice(0, 2).join(", ")}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-blue-600 font-medium hover:text-blue-700">
                      Search flights →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Travel Guide */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Time to Fly from New York
            </h2>
            <p className="text-gray-600 text-lg">
              Plan your travel based on seasonal trends and save money on flights from NYC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalDeals.map((season, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {season.season}
                </h3>
                <div className="text-green-600 font-bold text-lg mb-3">
                  {season.savings}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {season.description}
                </p>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
                  <div className="flex flex-wrap gap-1">
                    {season.destinations.map((dest, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Complete Guide to Flying from New York City
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Choosing the Right NYC Airport</h3>
                <p className="text-gray-600 mb-4">
                  New York City has three major airports, each serving different purposes:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>JFK:</strong> Best for international flights and major airlines</li>
                  <li>• <strong>LaGuardia:</strong> Ideal for domestic and short-haul flights</li>
                  <li>• <strong>Newark:</strong> Good alternative with often lower prices</li>
                  <li>• Consider transportation costs and time to each airport</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Money-Saving Tips for NYC Flights</h3>
                <p className="text-gray-600 mb-4">
                  Save money on flights departing from New York with these strategies:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Compare prices across all three NYC airports</li>
                  <li>• Book domestic flights 1-3 months in advance</li>
                  <li>• Consider flying midweek for better deals</li>
                  <li>• Use public transportation to save on airport transfers</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">NYC Airport Transportation</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">JFK Airport</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• AirTrain JFK + Subway: $8.25</li>
                    <li>• Express bus: $18-22</li>
                    <li>• Taxi to Manhattan: $52-70</li>
                    <li>• Uber/Lyft: $45-80</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">LaGuardia Airport</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Q70 Bus + Subway: $2.90</li>
                    <li>• Express bus: $16-18</li>
                    <li>• Taxi to Manhattan: $42-54</li>
                    <li>• Uber/Lyft: $35-65</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Newark Airport</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• AirTrain + NJ Transit: $13.75</li>
                    <li>• Express bus: $18-20</li>
                    <li>• Taxi to Manhattan: $50-75</li>
                    <li>• Uber/Lyft: $45-85</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}