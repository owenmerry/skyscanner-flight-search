import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Plane, TrendingUp, Clock, DollarSign } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Popular Flight Routes 2025 - Find Cheap Flights | FlightSearch" },
    { 
      name: "description", 
      content: "Discover the most popular flight routes in 2025. Compare prices for top destinations like New York to London, Los Angeles to Tokyo, and more. Book cheap flights today." 
    },
    { name: "keywords", content: "popular flight routes, cheap flights, flight deals, best flight routes 2025, international flights, domestic flights" },
    { property: "og:title", content: "Popular Flight Routes 2025 - Find Cheap Flights" },
    { property: "og:description", content: "Discover the most popular flight routes and find cheap flights to top destinations worldwide." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded popular routes data
  const popularRoutes = [
    {
      from: { code: "JFK", city: "New York", country: "United States" },
      to: { code: "LHR", city: "London", country: "United Kingdom" },
      avgPrice: 485,
      searchVolume: "125K/month",
      flightTime: "7h 30m",
      airlines: ["British Airways", "Virgin Atlantic", "American Airlines"],
      slug: "jfk/to/lhr"
    },
    {
      from: { code: "LAX", city: "Los Angeles", country: "United States" },
      to: { code: "NRT", city: "Tokyo", country: "Japan" },
      avgPrice: 650,
      searchVolume: "89K/month",
      flightTime: "11h 15m",
      airlines: ["Japan Airlines", "All Nippon Airways", "United Airlines"],
      slug: "lax/to/nrt"
    },
    {
      from: { code: "LHR", city: "London", country: "United Kingdom" },
      to: { code: "CDG", city: "Paris", country: "France" },
      avgPrice: 125,
      searchVolume: "156K/month",
      flightTime: "1h 25m",
      airlines: ["British Airways", "Air France", "EasyJet"],
      slug: "lhr/to/cdg"
    },
    {
      from: { code: "DXB", city: "Dubai", country: "United Arab Emirates" },
      to: { code: "BOM", city: "Mumbai", country: "India" },
      avgPrice: 185,
      searchVolume: "78K/month",
      flightTime: "3h 5m",
      airlines: ["Emirates", "Air India", "IndiGo"],
      slug: "dxb/to/bom"
    },
    {
      from: { code: "SYD", city: "Sydney", country: "Australia" },
      to: { code: "AKL", city: "Auckland", country: "New Zealand" },
      avgPrice: 225,
      searchVolume: "45K/month",
      flightTime: "3h 15m",
      airlines: ["Qantas", "Air New Zealand", "Jetstar"],
      slug: "syd/to/akl"
    },
    {
      from: { code: "FRA", city: "Frankfurt", country: "Germany" },
      to: { code: "JFK", city: "New York", country: "United States" },
      avgPrice: 520,
      searchVolume: "67K/month",
      flightTime: "8h 45m",
      airlines: ["Lufthansa", "United Airlines", "Delta"],
      slug: "fra/to/jfk"
    }
  ];

  const trendingDestinations = [
    { city: "Bangkok", country: "Thailand", growth: "+45%", avgPrice: 780 },
    { city: "Istanbul", country: "Turkey", growth: "+38%", avgPrice: 420 },
    { city: "Dubai", country: "UAE", growth: "+32%", avgPrice: 650 },
    { city: "Singapore", country: "Singapore", growth: "+28%", avgPrice: 890 },
  ];

  return json({ popularRoutes, trendingDestinations });
}

export default function PopularRoutes() {
  const { popularRoutes, trendingDestinations } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Most Popular Flight Routes in 2025
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover the world's most traveled flight routes and find amazing deals 
              on flights to top destinations. Compare prices from hundreds of airlines.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Routes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Flight Routes Worldwide
          </h2>
          <p className="text-gray-600 text-lg">
            These are the most searched and booked flight routes globally, 
            offering great connectivity and competitive prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route, index) => (
            <Link 
              key={index} 
              to={`/flights/${route.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-500">#{index + 1} Most Popular</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${route.avgPrice}
                    </div>
                    <div className="text-sm text-gray-500">avg price</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <div>
                      <div className="text-gray-900">{route.from.city}</div>
                      <div className="text-sm text-gray-500">{route.from.code}</div>
                    </div>
                    <div className="text-blue-600">→</div>
                    <div className="text-right">
                      <div className="text-gray-900">{route.to.city}</div>
                      <div className="text-sm text-gray-500">{route.to.code}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Flight time: {route.flightTime}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {route.searchVolume}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Popular airlines: {route.airlines.slice(0, 2).join(", ")}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium hover:text-blue-700">
                    Search flights →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Destinations 2025
            </h2>
            <p className="text-gray-600 text-lg">
              These destinations are seeing the biggest increase in flight searches this year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDestinations.map((dest, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {dest.city}
                </h3>
                <p className="text-gray-600 mb-3">{dest.country}</p>
                <div className="text-green-600 font-bold text-lg mb-2">
                  {dest.growth}
                </div>
                <div className="text-sm text-gray-500">
                  From ${dest.avgPrice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Flight Routes: Your Guide to the World's Busiest Air Corridors
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why These Routes Are Popular</h3>
                <p className="text-gray-600 mb-4">
                  The most popular flight routes connect major business centers, tourist destinations, 
                  and cultural hubs worldwide. These routes offer frequent flights, competitive pricing, 
                  and excellent connectivity.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• High frequency of flights daily</li>
                  <li>• Multiple airline options</li>
                  <li>• Competitive pricing due to demand</li>
                  <li>• Direct and connecting flight options</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Time to Book</h3>
                <p className="text-gray-600 mb-4">
                  For the best deals on popular routes, consider these booking strategies:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Book 2-3 months in advance for international flights</li>
                  <li>• Tuesday and Wednesday flights are often cheaper</li>
                  <li>• Avoid peak travel seasons when possible</li>
                  <li>• Compare prices across multiple airlines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}