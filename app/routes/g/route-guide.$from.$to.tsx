import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { MapPin, Plane, Clock, DollarSign, Star } from "lucide-react";

// Import your types: import type { RoutePageLoaderData, FlightRoute, Airport, Airline } from "~/types/seo";

interface Airport {
  code: string;
  city: string;
  country: string;
  name?: string;
  timezone?: string;
}

interface FlightRoute {
  from: Airport;
  to: Airport;
  distance: number;
  averageFlightTime: string;
  popularAirlines: string[];
  averagePrice: {
    economy: number;
    business: number;
    first?: number;
  };
  seasonality: {
    peak: string[];
    low: string[];
  };
  frequency: number;
  directFlights: boolean;
}

interface Airline {
  iataCode: string;
  name: string;
  rating?: number;
  classTypes?: string[];
}

interface RoutePageLoaderData {
  route: FlightRoute;
  alternativeRoutes: FlightRoute[];
  monthlyPrices: { month: string; price: number }[];
  airlines: Airline[];
  tips: {
    bestTimeToBook: string;
    cheapestDay: string;
    seasonalAdvice: string[];
  };
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      { title: "Route Not Found" },
      { name: "robots", content: "noindex" }
    ];
  }

  const { route, seoData } = data;
  
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
        "name": `${route.from.city} to ${route.to.city} Flight Guide`,
        "description": seoData.description,
        "url": `https://yoursite.com/route-guide/${params.from}/${params.to}`,
        "about": [
          {
            "@type": "Place",
            "name": route.from.city,
            "addressCountry": route.from.country
          },
          {
            "@type": "Place", 
            "name": route.to.city,
            "addressCountry": route.to.country
          }
        ]
      }
    }
  ];
};

export async function loader({ params }: LoaderArgs): Promise<Response> {
  const { from, to } = params;
  
  if (!from || !to) {
    throw new Response("Route parameters missing", { status: 400 });
  }

  try {
    const [route, alternativeRoutes, monthlyPrices, airlines, tips] = await Promise.all([
      getRouteData(from.toUpperCase(), to.toUpperCase()),
      getAlternativeRoutes(from.toUpperCase(), to.toUpperCase()),
      getMonthlyPrices(from.toUpperCase(), to.toUpperCase()),
      getRouteAirlines(from.toUpperCase(), to.toUpperCase()),
      getRouteTips(from.toUpperCase(), to.toUpperCase())
    ]);

    if (!route) {
      throw new Response("Route not found", { status: 404 });
    }

    const seoData = {
      title: `${route.from.city} to ${route.to.city} Flight Guide 2025 - Routes, Airlines & Tips`,
      description: `Complete flight guide for ${route.from.city} to ${route.to.city}. ${route.distance} miles, ${route.averageFlightTime} flight time, from $${route.averagePrice.economy}. Compare ${airlines.length} airlines, find deals & travel tips.`,
      keywords: [
        `${route.from.city.toLowerCase()} to ${route.to.city.toLowerCase()}`,
        `${route.from.city.toLowerCase()} ${route.to.city.toLowerCase()} flights`,
        `${route.from.code} to ${route.to.code}`,
        `flight ${route.from.city.toLowerCase()} ${route.to.city.toLowerCase()}`,
        "flight guide",
        "travel tips",
        "airline comparison"
      ]
    };

    return json({
      route,
      alternativeRoutes,
      monthlyPrices,
      airlines,
      tips,
      seoData
    });
  } catch (error) {
    console.error("Route guide error:", error);
    throw new Response("Failed to load route data", { status: 500 });
  }
}

// Mock functions - replace with your actual API calls
async function getRouteData(from: string, to: string): Promise<FlightRoute | null> {
  const routes: Record<string, FlightRoute> = {
    "LHR-JFK": {
      from: { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow", timezone: "GMT" },
      to: { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy", timezone: "EST" },
      distance: 3459,
      averageFlightTime: "8h 15m",
      popularAirlines: ["BA", "VS", "AA"],
      averagePrice: { economy: 450, business: 2500, first: 5000 },
      seasonality: {
        peak: ["June", "July", "August", "December"],
        low: ["January", "February", "November"]
      },
      frequency: 35,
      directFlights: true
    },
    "CDG-JFK": {
      from: { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle", timezone: "CET" },
      to: { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy", timezone: "EST" },
      distance: 3625,
      averageFlightTime: "8h 30m",
      popularAirlines: ["AF", "DL", "AA"],
      averagePrice: { economy: 485, business: 2800 },
      seasonality: {
        peak: ["May", "June", "July", "August", "September"],
        low: ["January", "February", "March"]
      },
      frequency: 28,
      directFlights: true
    }
  };
  
  return routes[`${from}-${to}`] || null;
}

async function getAlternativeRoutes(from: string, to: string): Promise<FlightRoute[]> {
  return [
    {
      from: { code: "LGW", city: "London", country: "United Kingdom", name: "Gatwick" },
      to: { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy" },
      distance: 3459,
      averageFlightTime: "8h 25m",
      popularAirlines: ["VS", "B6"],
      averagePrice: { economy: 425, business: 2300 },
      seasonality: { peak: ["Summer"], low: ["Winter"] },
      frequency: 14,
      directFlights: true
    }
  ];
}

async function getMonthlyPrices(from: string, to: string) {
  return [
    { month: "Jan", price: 380 },
    { month: "Feb", price: 365 },
    { month: "Mar", price: 420 },
    { month: "Apr", price: 465 },
    { month: "May", price: 520 },
    { month: "Jun", price: 580 },
    { month: "Jul", price: 650 },
    { month: "Aug", price: 620 },
    { month: "Sep", price: 495 },
    { month: "Oct", price: 445 },
    { month: "Nov", price: 395 },
    { month: "Dec", price: 550 }
  ];
}

async function getRouteAirlines(from: string, to: string): Promise<Airline[]> {
  return [
    { iataCode: "BA", name: "British Airways", rating: 4.2, classTypes: ["Economy", "Premium Economy", "Business", "First"] },
    { iataCode: "VS", name: "Virgin Atlantic", rating: 4.3, classTypes: ["Economy", "Premium", "Upper Class"] },
    { iataCode: "AA", name: "American Airlines", rating: 4.0, classTypes: ["Economy", "Premium Economy", "Business", "First"] }
  ];
}

async function getRouteTips(from: string, to: string) {
  return {
    bestTimeToBook: "8-10 weeks before departure",
    cheapestDay: "Tuesday",
    seasonalAdvice: [
      "Summer months (June-August) are peak season with highest prices",
      "January-February offer the best deals but weather can be unpredictable",
      "Book holiday travel (Christmas/New Year) at least 3 months in advance"
    ]
  };
}

export default function RouteGuidePage() {
  const { route, alternativeRoutes, monthlyPrices, airlines, tips } = useLoaderData<typeof loader>() as RoutePageLoaderData;

  const lowestPrice = Math.min(...monthlyPrices.map(m => m.price));
  const highestPrice = Math.max(...monthlyPrices.map(m => m.price));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{route.from.code}</div>
                  <div className="text-sm text-purple-200">{route.from.city}</div>
                </div>
                <Plane className="h-8 w-8 mx-4" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{route.to.code}</div>
                  <div className="text-sm text-purple-200">{route.to.city}</div>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {route.from.city} to {route.to.city}
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Complete flight guide with prices, airlines, and travel tips for the {route.from.city} to {route.to.city} route.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{route.averageFlightTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{route.distance} miles</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>from ${route.averagePrice.economy}</span>
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
              <div className="text-2xl font-bold text-gray-900">{route.frequency}</div>
              <div className="text-sm text-gray-600">Flights/Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{airlines.length}</div>
              <div className="text-sm text-gray-600">Airlines</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{route.directFlights ? 'Yes' : 'No'}</div>
              <div className="text-sm text-gray-600">Direct Flights</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{route.from.timezone} → {route.to.timezone}</div>
              <div className="text-sm text-gray-600">Time Zones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Price Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Price Trends</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Cheapest: ${lowestPrice} (Jan-Feb)</span>
                  <span>Most Expensive: ${highestPrice} (Jul)</span>
                </div>
                <div className="relative">
                  <div className="flex items-end space-x-2 h-48">
                    {monthlyPrices.map((month, index) => {
                      const height = ((month.price - lowestPrice) / (highestPrice - lowestPrice)) * 100 + 20;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs font-semibold text-gray-900 mb-1">
                            ${month.price}
                          </div>
                          <div 
                            className={`w-full rounded-t ${
                              month.price === lowestPrice ? 'bg-green-500' : 
                              month.price === highestPrice ? 'bg-red-500' : 'bg-blue-400'
                            }`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Airlines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Airlines on this Route</h2>
              <div className="space-y-4">
                {airlines.map((airline, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{airline.name}</h3>
                          <p className="text-sm text-gray-600">{airline.iataCode}</p>
                          {airline.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm">{airline.rating}/5.0</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {airline.classTypes?.slice(0, 2).map((classType, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {classType}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/airlines/${airline.iataCode.toLowerCase()}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Routes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternative Routes</h2>
              <div className="space-y-4">
                {alternativeRoutes.map((altRoute, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {altRoute.from.city} ({altRoute.from.code}) → {altRoute.to.city} ({altRoute.to.code})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {altRoute.averageFlightTime} • {altRoute.frequency} flights/week
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Airlines: {altRoute.popularAirlines.join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          from ${altRoute.averagePrice.economy}
                        </div>
                        <Link
                          to={`/flights/${altRoute.from.code.toLowerCase()}/to/${altRoute.to.code.toLowerCase()}`}
                          className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                        >
                          Search flights →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Economy:</span>
                  <span className="font-semibold">${route.averagePrice.economy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business:</span>
                  <span className="font-semibold">${route.averagePrice.business}</span>
                </div>
                {route.averagePrice.first && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Class:</span>
                    <span className="font-semibold">${route.averagePrice.first}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Tips</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Best Time to Book</h4>
                  <p className="text-sm text-gray-600">{tips.bestTimeToBook}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Cheapest Day</h4>
                  <p className="text-sm text-gray-600">{tips.cheapestDay}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Seasonal Advice</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tips.seasonalAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Peak/Low Season */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Patterns</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Peak Season</h4>
                  <div className="flex flex-wrap gap-1">
                    {route.seasonality.peak.map((month, index) => (
                      <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Low Season</h4>
                  <div className="flex flex-wrap gap-1">
                    {route.seasonality.low.map((month, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/flights/${route.from.code.toLowerCase()}/to/${route.to.code.toLowerCase()}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                >
                  Search Flights
                </Link>
                <Link
                  to={`/flights-from/${route.from.city.toLowerCase().replace(' ', '-')}`}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center block"
                >
                  More from {route.from.city}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete {route.from.city} to {route.to.city} Flight Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Route Overview</h3>
                <p className="text-gray-600 mb-4">
                  The {route.from.city} to {route.to.city} route covers {route.distance} miles with an average flight time of {route.averageFlightTime}. 
                  This popular international route offers {route.directFlights ? 'direct flights' : 'connecting flights'} 
                  with {route.frequency} weekly departures from multiple airlines.
                </p>
                <p className="text-gray-600">
                  Flight prices range from ${route.averagePrice.economy} in economy class to ${route.averagePrice.business} in business class, 
                  with the cheapest fares typically available during {route.seasonality.low.join(" and ")}.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Time to Fly</h3>
                <p className="text-gray-600 mb-4">
                  For the best deals on {route.from.city} to {route.to.city} flights, avoid peak season months 
                  ({route.seasonality.peak.join(", ")}) when prices can be 40-60% higher than average. 
                  The most affordable time to fly is during {route.seasonality.low.join(" and ")}.
                </p>
                <p className="text-gray-600">
                  Book your flight {tips.bestTimeToBook} and try to fly on {tips.cheapestDay}s for additional savings. 
                  Time zone difference between {route.from.city} ({route.from.timezone}) and {route.to.city} ({route.to.timezone}) 
                  should be considered when planning your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
