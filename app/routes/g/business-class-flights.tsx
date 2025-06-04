import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Crown, Wifi, Coffee, Bed, Star, Plane } from "lucide-react";
import { Layout } from "~/components/ui/layout/layout";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Business Class Flights - Premium Travel Deals & Upgrades 2025" },
    {
      name: "description",
      content:
        "Find business class flight deals and premium travel options. Compare business class prices, amenities, and book luxury flights with lie-flat beds, priority boarding, and premium service.",
    },
    {
      name: "keywords",
      content:
        "business class flights, premium flights, luxury travel, business class deals, first class flights, lie flat seats, premium cabin, business class upgrades",
    },
    {
      property: "og:title",
      content: "Business Class Flights - Luxury Travel at the Best Prices",
    },
    {
      property: "og:description",
      content:
        "Discover business class flight deals and premium travel options. Book luxury flights with premium amenities and service.",
    },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const apiUrl = process.env.API_URL || "";
  // Hardcoded business class flight data
  const premiumRoutes = [
    {
      from: { code: "JFK", city: "New York" },
      to: { code: "LHR", city: "London" },
      businessPrice: 2450,
      economyPrice: 485,
      savings: "45% off regular price",
      flightTime: "7h 30m",
      airline: "British Airways",
      aircraft: "Boeing 777-300",
      features: [
        "Lie-flat seats",
        "À la carte dining",
        "Priority boarding",
        "Lounge access",
      ],
      slug: "jfk/to/lhr",
    },
    {
      from: { code: "LAX", city: "Los Angeles" },
      to: { code: "NRT", city: "Tokyo" },
      businessPrice: 3200,
      economyPrice: 650,
      savings: "30% off regular price",
      flightTime: "11h 15m",
      airline: "Japan Airlines",
      aircraft: "Boeing 787-9",
      features: [
        "The Sky Suite",
        "Kaiseki dining",
        "Amenity kit",
        "Wi-Fi included",
      ],
      slug: "lax/to/nrt",
    },
    {
      from: { code: "LHR", city: "London" },
      to: { code: "DXB", city: "Dubai" },
      businessPrice: 1850,
      economyPrice: 420,
      savings: "40% off regular price",
      flightTime: "7h 45m",
      airline: "Emirates",
      aircraft: "Airbus A380",
      features: [
        "Private suites",
        "Onboard shower",
        "Bar lounge",
        "Chauffeur service",
      ],
      slug: "lhr/to/dxb",
    },
    {
      from: { code: "JFK", city: "New York" },
      to: { code: "CDG", city: "Paris" },
      businessPrice: 2800,
      economyPrice: 520,
      savings: "35% off regular price",
      flightTime: "8h 45m",
      airline: "Air France",
      aircraft: "Boeing 777-200",
      features: [
        "Lie-flat beds",
        "French cuisine",
        "Amenity by Clarins",
        "Priority check-in",
      ],
      slug: "jfk/to/cdg",
    },
    {
      from: { code: "SFO", city: "San Francisco" },
      to: { code: "SIN", city: "Singapore" },
      businessPrice: 4200,
      economyPrice: 890,
      savings: "25% off regular price",
      flightTime: "17h 30m",
      airline: "Singapore Airlines",
      aircraft: "Airbus A350-900",
      features: [
        "Book the Cook",
        "32-inch seat width",
        "Noise-canceling headphones",
        "Spa amenities",
      ],
      slug: "sfo/to/sin",
    },
    {
      from: { code: "FRA", city: "Frankfurt" },
      to: { code: "JFK", city: "New York" },
      businessPrice: 2950,
      economyPrice: 520,
      savings: "38% off regular price",
      flightTime: "8h 45m",
      airline: "Lufthansa",
      aircraft: "Airbus A340-600",
      features: [
        "Fully flat beds",
        "5-course meals",
        "Welcome champagne",
        "Fast track security",
      ],
      slug: "fra/to/jfk",
    },
  ];

  const airlines = [
    {
      name: "Emirates",
      rating: 5,
      highlights: [
        "Private suites on A380",
        "Onboard shower spa",
        "Michelin-starred chefs",
      ],
      routes: "150+ destinations",
    },
    {
      name: "Singapore Airlines",
      rating: 5,
      highlights: [
        "Widest business seats",
        "Book the Cook service",
        "KrisFlyer benefits",
      ],
      routes: "130+ destinations",
    },
    {
      name: "Qatar Airways",
      rating: 5,
      highlights: ["Qsuite privacy", "Al mourjan lounge", "Oryx entertainment"],
      routes: "160+ destinations",
    },
    {
      name: "Cathay Pacific",
      rating: 4,
      highlights: ["Reverse herringbone", "Premium wines", "The Pier lounge"],
      routes: "190+ destinations",
    },
    {
      name: "British Airways",
      rating: 4,
      highlights: ["Club World suite", "Galleries lounge", "Champagne service"],
      routes: "200+ destinations",
    },
    {
      name: "Lufthansa",
      rating: 4,
      highlights: ["Fully flat beds", "Senator lounge", "German efficiency"],
      routes: "220+ destinations",
    },
  ];

  const amenities = [
    {
      category: "Seating",
      features: [
        "Lie-flat beds (78-82 inches)",
        "Direct aisle access",
        "Privacy screens and doors",
        "Personal storage compartments",
      ],
    },
    {
      category: "Dining",
      features: [
        "Multi-course gourmet meals",
        "Premium wine and champagne",
        "À la carte dining options",
        "Celebrity chef collaborations",
      ],
    },
    {
      category: "Entertainment",
      features: [
        "Large personal screens (15-18 inches)",
        "Noise-canceling headphones",
        "Premium movie selection",
        "High-speed Wi-Fi",
      ],
    },
    {
      category: "Service",
      features: [
        "Priority check-in and boarding",
        "Business lounge access",
        "Dedicated cabin crew",
        "Luxury amenity kits",
      ],
    },
  ];

  return json({ premiumRoutes, airlines, amenities, apiUrl });
}

export default function BusinessClassFlights() {
  const { premiumRoutes, airlines, amenities, apiUrl } =
    useLoaderData<typeof loader>();

  return (
    <Layout apiUrl={apiUrl}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Business Class Flights
                </h1>
              </div>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                Experience luxury travel with business class flights. Enjoy
                lie-flat beds, gourmet dining, priority service, and exclusive
                lounge access at competitive prices.
              </p>
              <div className="flex justify-center items-center space-x-8 text-sm">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>Lie-Flat Beds</span>
                </div>
                <div className="flex items-center">
                  <Coffee className="h-5 w-5 mr-2" />
                  <span>Premium Dining</span>
                </div>
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  <span>Lounge Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Routes */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Business Class Routes
            </h2>
            <p className="text-gray-600 text-lg">
              Premium travel deals on the world's most popular business routes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {premiumRoutes.map((route, index) => (
              <Link
                key={index}
                to={`/flights/${route.slug}?class=business`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <Crown className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {route.airline}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {route.aircraft}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ${route.businessPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {route.savings}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <div>
                        <div className="text-gray-900">{route.from.city}</div>
                        <div className="text-sm text-gray-500">
                          {route.from.code}
                        </div>
                      </div>
                      <div className="text-purple-600">→</div>
                      <div className="text-right">
                        <div className="text-gray-900">{route.to.city}</div>
                        <div className="text-sm text-gray-500">
                          {route.to.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Flight time: {route.flightTime}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Compare to Economy:{" "}
                      <span className="line-through">
                        ${route.economyPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {route.features.slice(0, 4).map((feature, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 flex items-center"
                        >
                          <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-purple-600 font-medium hover:text-purple-700">
                      View business class details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Airlines */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Top Business Class Airlines
              </h2>
              <p className="text-gray-600 text-lg">
                Airlines with the best business class products and service
                worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {airlines.map((airline, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {airline.name}
                    </h3>
                    <div className="flex">
                      {[...Array(airline.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {airline.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">{airline.routes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Class Amenities */}
        <div className="bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What to Expect in Business Class
              </h2>
              <p className="text-gray-600 text-lg">
                Premium amenities and services that make business class worth
                the investment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {amenities.map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business vs Economy Comparison */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Business Class vs Economy: Is It Worth It?
              </h2>
              <p className="text-gray-600 text-lg">
                Compare what you get with business class versus economy travel.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <Crown className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Business Class
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Lie-flat beds (78-82 inches long)",
                      "Priority boarding and check-in",
                      "Business lounge access worldwide",
                      "Gourmet meals with wine pairings",
                      "Dedicated cabin crew (1:6 ratio)",
                      "Larger entertainment screens",
                      "Premium amenity kits",
                      "Extra baggage allowance",
                      "Fast-track security and immigration",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <Plane className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Economy Class
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Standard seats (30-32 inches pitch)",
                      "Regular boarding process",
                      "No lounge access included",
                      "Basic meal service",
                      "Shared cabin crew attention",
                      "Smaller entertainment screens",
                      "Basic or no amenity kit",
                      "Standard baggage allowance",
                      "Regular security lines",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Guide to Business Class Travel in 2025
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    When Business Class Makes Sense
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Business class travel is ideal for certain situations where
                    comfort, productivity, and arriving refreshed are
                    priorities.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Long-haul flights over 6 hours</li>
                    <li>• Important business meetings upon arrival</li>
                    <li>• Red-eye flights where sleep is crucial</li>
                    <li>• Special occasions and honeymoons</li>
                    <li>• When using points or miles for upgrades</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    How to Find Business Class Deals
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Business class doesn't have to break the bank. Here are
                    strategies to find premium travel at reasonable prices.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Book 3-6 months in advance for best prices</li>
                    <li>• Use points and miles for maximum value</li>
                    <li>• Consider premium economy as a middle ground</li>
                    <li>• Look for error fares and flash sales</li>
                    <li>• Bid for upgrades at check-in</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Business Class FAQs
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      What's included in business class?
                    </h4>
                    <p className="text-gray-600">
                      Business class typically includes lie-flat seats, gourmet
                      meals, premium beverages, priority boarding, lounge
                      access, and enhanced entertainment systems.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      How much more expensive is business class?
                    </h4>
                    <p className="text-gray-600">
                      Business class typically costs 3-5 times more than
                      economy, but prices vary by route, airline, and booking
                      time. Deals can reduce this premium significantly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Can I upgrade to business class after booking?
                    </h4>
                    <p className="text-gray-600">
                      Yes, you can often upgrade using miles, cash, or bid for
                      an upgrade. Airlines also offer last-minute upgrade
                      opportunities at check-in.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      What's the difference between business and first class?
                    </h4>
                    <p className="text-gray-600">
                      First class offers more space, privacy, and personalized
                      service. However, modern business class on many airlines
                      rivals traditional first class amenities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
