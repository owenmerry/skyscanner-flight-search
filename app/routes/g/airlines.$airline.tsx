import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Star, Plane, MapPin, Clock, DollarSign, Wifi, Coffee, Users, Shield } from "lucide-react";

// You'll import this from your types file: import type { AirlinePageLoaderData, Airline, Airport, FlightRoute } from "~/types/seo";

interface Airline {
  iataCode: string;
  name: string;
  country: string;
  founded?: number;
  fleet?: number;
  destinations?: number;
  headquarters?: string;
  rating?: number;
  strengths?: string[];
  weaknesses?: string[];
  baggage?: { carry: string; checked: string; extra: string; };
  entertainment?: string;
  frequentFlyer?: string;
  classTypes?: string[];
  keyRoutes?: string[];
  hub?: string;
  logo?: string;
}

interface Airport {
  code: string;
  city: string;
  country: string;
  name?: string;
}

interface FlightRoute {
  from: Airport;
  to: Airport;
  distance: number;
  averageFlightTime: string;
  averagePrice: { economy: number; business: number; };
  frequency: number;
  directFlights: boolean;
}

interface AirlinePageLoaderData {
  airline: Airline;
  destinations: Airport[];
  popularRoutes: FlightRoute[];
  reviews: {
    rating: number;
    totalReviews: number;
    categories: { service: number; food: number; entertainment: number; comfort: number; };
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
      { title: "Airline Not Found" },
      { name: "robots", content: "noindex" }
    ];
  }

  const { airline, seoData } = data;
  
  return [
    { title: seoData.title },
    { name: "description", content: seoData.description },
    { name: "keywords", content: seoData.keywords.join(", ") },
    { property: "og:title", content: seoData.title },
    { property: "og:description", content: seoData.description },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // Structured data for airline
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Airline",
        "name": airline.name,
        "iataCode": airline.iataCode,
        "foundingDate": airline.founded,
        "url": `https://yoursite.com/airlines/${params.airline}`,
      }
    }
  ];
};

export async function loader({ params }: LoaderArgs): Promise<Response> {
  const { airline: airlineParam } = params;
  
  if (!airlineParam) {
    throw new Response("Airline parameter missing", { status: 400 });
  }

  try {
    // Mock data - replace with your actual API calls
    const airline = await getAirlineData(airlineParam.toUpperCase());
    if (!airline) {
      throw new Response("Airline not found", { status: 404 });
    }

    const [destinations, popularRoutes, reviews] = await Promise.all([
      getAirlineDestinations(airline.iataCode),
      getAirlinePopularRoutes(airline.iataCode),
      getAirlineReviews(airline.iataCode)
    ]);

    const seoData = {
      title: `${airline.name} Flights & Reviews 2025 - Book ${airline.name} Tickets`,
      description: `Book ${airline.name} flights and read reviews. Find the best ${airline.name} deals, baggage policy, route network, and flight schedules. ${airline.destinations}+ destinations worldwide.`,
      keywords: [
        airline.name.toLowerCase(),
        `${airline.name.toLowerCase()} flights`,
        `${airline.name.toLowerCase()} reviews`,
        `${airline.name.toLowerCase()} baggage policy`,
        `${airline.name.toLowerCase()} destinations`,
        airline.iataCode.toLowerCase(),
        "airline booking",
        "flight deals"
      ]
    };

    return json({
      airline,
      destinations,
      popularRoutes,
      reviews,
      seoData
    });
  } catch (error) {
    console.error("Airline page error:", error);
    throw new Response("Failed to load airline data", { status: 500 });
  }
}

// Mock functions - replace with your actual API calls
async function getAirlineData(iataCode: string): Promise<Airline | null> {
  const airlines: Record<string, Airline> = {
    "BA": {
      iataCode: "BA",
      name: "British Airways",
      country: "United Kingdom",
      founded: 1974,
      fleet: 280,
      destinations: 200,
      headquarters: "London Heathrow",
      rating: 4.2,
      strengths: ["Extensive network", "Club World business class", "Heathrow hub", "Avios program"],
      weaknesses: ["Inconsistent service", "High fuel surcharges", "Aging fleet"],
      baggage: { carry: "6kg", checked: "23kg", extra: "$90-220" },
      entertainment: "Highlife with 1,300+ options",
      frequentFlyer: "Executive Club - oneworld",
      classTypes: ["Economy", "Premium Economy", "Business", "First"],
      keyRoutes: ["London-New York", "London-Dubai", "London-Singapore"],
      hub: "London Heathrow"
    },
    "EK": {
      iataCode: "EK",
      name: "Emirates",
      country: "UAE",
      founded: 1985,
      fleet: 270,
      destinations: 150,
      headquarters: "Dubai",
      rating: 4.7,
      strengths: ["A380 experience", "Dubai hub", "Premium amenities", "Global network"],
      weaknesses: ["Fuel surcharges", "Airport congestion"],
      baggage: { carry: "7kg", checked: "23kg", extra: "$120-280" },
      entertainment: "ice with 6,500+ options",
      frequentFlyer: "Emirates Skywards",
      classTypes: ["Economy", "Premium Economy", "Business", "First"],
      keyRoutes: ["Dubai-London", "Dubai-New York", "Dubai-Sydney"],
      hub: "Dubai International"
    }
  };
  
  return airlines[iataCode] || null;
}

async function getAirlineDestinations(iataCode: string): Promise<Airport[]> {
  // Mock data - replace with actual API
  return [
    { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow" },
    { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy" },
    { code: "DXB", city: "Dubai", country: "UAE", name: "Dubai International" },
    { code: "SIN", city: "Singapore", country: "Singapore", name: "Changi" },
    { code: "SYD", city: "Sydney", country: "Australia", name: "Kingsford Smith" }
  ];
}

async function getAirlinePopularRoutes(iataCode: string): Promise<FlightRoute[]> {
  return [
    {
      from: { code: "LHR", city: "London", country: "UK" },
      to: { code: "JFK", city: "New York", country: "US" },
      distance: 5585,
      averageFlightTime: "8h 15m",
      averagePrice: { economy: 450, business: 2500 },
      frequency: 14,
      directFlights: true
    }
  ];
}

async function getAirlineReviews(iataCode: string) {
  return {
    rating: 4.2,
    totalReviews: 15420,
    categories: {
      service: 4.1,
      food: 3.8,
      entertainment: 4.3,
      comfort: 4.0
    }
  };
}

export default function AirlinePage() {
  const { airline, destinations, popularRoutes, reviews } = useLoaderData<typeof loader>() as AirlinePageLoaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Plane className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {airline.name}
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  {airline.iataCode} • {airline.country} • Founded {airline.founded}
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>{airline.rating}/5.0 ({reviews.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{airline.destinations} destinations</span>
                  </div>
                  <div className="flex items-center">
                    <Plane className="h-5 w-5 mr-2" />
                    <span>{airline.fleet} aircraft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reviews.categories.service}/5</div>
              <div className="text-sm text-gray-600">Service Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reviews.categories.comfort}/5</div>
              <div className="text-sm text-gray-600">Seat Comfort</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reviews.categories.food}/5</div>
              <div className="text-sm text-gray-600">Food & Drink</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reviews.categories.entertainment}/5</div>
              <div className="text-sm text-gray-600">Entertainment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {airline.name}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">✅ Strengths</h3>
                  <ul className="space-y-2">
                    {airline.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-amber-700">⚠️ Considerations</h3>
                  <ul className="space-y-2">
                    {airline.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular {airline.name} Routes</h2>
              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {route.from.city} to {route.to.city}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {route.from.code} → {route.to.code} • {route.averageFlightTime}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {route.frequency} flights/week • {route.directFlights ? 'Direct' : 'Connecting'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          from ${route.averagePrice.economy}
                        </div>
                        <div className="text-sm text-gray-600">Economy</div>
                        <Link 
                          to={`/flights/${route.from.code.toLowerCase()}/to/${route.to.code.toLowerCase()}`}
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

            {/* Destinations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {airline.name} Destinations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {destinations.slice(0, 12).map((destination, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{destination.city}</div>
                      <div className="text-sm text-gray-600">{destination.code}</div>
                    </div>
                  </div>
                ))}
              </div>
              {destinations.length > 12 && (
                <p className="text-center text-gray-600 mt-4">
                  And {destinations.length - 12} more destinations...
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Airline Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Airline Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">IATA Code:</span>
                  <span className="font-medium">{airline.iataCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hub:</span>
                  <span className="font-medium">{airline.hub || airline.headquarters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fleet Size:</span>
                  <span className="font-medium">{airline.fleet} aircraft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-medium">{airline.founded}</span>
                </div>
              </div>
            </div>

            {/* Baggage Policy */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Baggage Policy
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carry-on:</span>
                  <span className="font-medium">{airline.baggage?.carry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Checked:</span>
                  <span className="font-medium">{airline.baggage?.checked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra fees:</span>
                  <span className="font-medium">{airline.baggage?.extra}</span>
                </div>
              </div>
            </div>

            {/* Class Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Classes</h3>
              <div className="space-y-2">
                {airline.classTypes?.map((classType, index) => (
                  <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm">
                    {classType}
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty Program */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Frequent Flyer Program
              </h3>
              <p className="text-sm text-gray-700">{airline.frequentFlyer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Flying with {airline.name} - Everything You Need to Know
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why Choose {airline.name}?</h3>
                <p className="text-gray-600 mb-4">
                  {airline.name} has been serving passengers since {airline.founded}, operating from their main hub at {airline.headquarters}. 
                  With a fleet of {airline.fleet} aircraft serving {airline.destinations} destinations worldwide, 
                  {airline.name} is a leading choice for both business and leisure travelers.
                </p>
                <p className="text-gray-600">
                  The airline is particularly known for {airline.strengths?.[0]?.toLowerCase()} and offers {airline.classTypes?.length} different service classes 
                  to meet various travel needs and budgets.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Booking {airline.name} Flights</h3>
                <p className="text-gray-600 mb-4">
                  When booking {airline.name} flights, consider joining their {airline.frequentFlyer} program to earn miles and enjoy exclusive benefits. 
                  The airline's baggage policy allows {airline.baggage?.carry} carry-on and {airline.baggage?.checked} checked baggage for most fares.
                </p>
                <p className="text-gray-600">
                  {airline.name} operates frequent flights on popular routes and offers {airline.entertainment} for in-flight entertainment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
