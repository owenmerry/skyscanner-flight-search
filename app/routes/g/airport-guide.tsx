import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MapPin, Clock, Car, Utensils, Wifi, ShoppingBag } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Airport Guide 2025 - World's Best Airports, Amenities & Travel Tips" },
    { 
      name: "description", 
      content: "Complete guide to major airports worldwide. Find airport amenities, transportation, lounges, dining, shopping, and travel tips for smooth airport experiences in 2025." 
    },
    { name: "keywords", content: "airport guide, best airports 2025, airport amenities, airport transportation, airport lounges, airport dining, airport maps, travel tips" },
    { property: "og:title", content: "Airport Guide 2025 - Navigate Airports Like a Pro" },
    { property: "og:description", content: "Comprehensive guide to world's major airports. Find amenities, transportation, and insider tips for seamless travel." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded airport data
  const topAirports = [
    {
      name: "Singapore Changi Airport",
      code: "SIN",
      city: "Singapore",
      country: "Singapore",
      rating: 4.9,
      passengers: "68.3 million",
      terminals: 4,
      airlines: 100,
      destinations: 140,
      features: ["Jewel Changi with waterfall", "Free WiFi throughout", "Movie theater", "Swimming pool", "Butterfly garden"],
      transportation: {
        taxi: "25-45 minutes to city center",
        metro: "30 minutes via MRT",
        bus: "45-60 minutes",
        cost: "$15-30 taxi, $2 MRT"
      },
      lounges: ["Singapore Airlines KrisFlyer", "Priority Pass", "Plaza Premium"],
      bestFor: "Long layovers and premium amenities",
      tips: ["Free Singapore city tour for 5+ hour layovers", "Try the famous Singapore street food court"]
    },
    {
      name: "Tokyo Haneda Airport", 
      code: "HND",
      city: "Tokyo",
      country: "Japan",
      rating: 4.8,
      passengers: "85.5 million",
      terminals: 3,
      airlines: 65,
      destinations: 95,
      features: ["Traditional Japanese gardens", "Observatory decks", "Early morning slot access", "Cultural exhibitions"],
      transportation: {
        taxi: "30-45 minutes to central Tokyo",
        metro: "20-30 minutes via monorail/train",
        bus: "35-50 minutes",
        cost: "$25-40 taxi, $5-8 train"
      },
      lounges: ["JAL Sakura Lounge", "ANA Suite Lounge", "Priority Pass locations"],
      bestFor: "Business travelers and city access",
      tips: ["Closer to Tokyo than Narita", "Excellent early morning departure slots"]
    },
    {
      name: "Dubai International Airport",
      code: "DXB", 
      city: "Dubai",
      country: "UAE",
      rating: 4.7,
      passengers: "89.1 million",
      terminals: 3,
      airlines: 140,
      destinations: 260,
      features: ["World's largest duty-free", "Indoor waterfalls", "Zen garden", "Gaming zones", "Luxury shopping"],
      transportation: {
        taxi: "45-60 minutes to Dubai Marina",
        metro: "35-50 minutes via Red Line", 
        bus: "60-90 minutes",
        cost: "$15-25 taxi, $2 metro"
      },
      lounges: ["Emirates Business/First", "Marhaba Lounge", "Priority Pass"],
      bestFor: "Shopping and Middle East connections",
      tips: ["Massive duty-free shopping", "Long walking distances between gates"]
    },
    {
      name: "London Heathrow Airport",
      code: "LHR",
      city: "London", 
      country: "United Kingdom",
      rating: 4.3,
      passengers: "79.2 million",
      terminals: 5,
      airlines: 90,
      destinations: 180,
      features: ["Extensive shopping", "Art exhibitions", "Multiple lounges", "Good dining options"],
      transportation: {
        taxi: "45-90 minutes depending on traffic",
        metro: "45-60 minutes via Piccadilly Line",
        bus: "60-120 minutes",
        cost: "$60-120 taxi, $6 Tube"
      },
      lounges: ["British Airways Galleries", "Virgin Clubhouse", "Priority Pass"],
      bestFor: "European and transatlantic connections",
      tips: ["Allow extra time for security", "Terminal 5 is most modern"]
    },
    {
      name: "Hong Kong International Airport",
      code: "HKG",
      city: "Hong Kong",
      country: "Hong Kong SAR",
      rating: 4.6,
      passengers: "71.5 million",
      terminals: 2,
      airlines: 120,
      destinations: 220,
      features: ["IMAX theater", "Golf simulator", "Shower facilities", "Sleeping pods", "Art installations"],
      transportation: {
        taxi: "45-60 minutes to Central",
        metro: "24 minutes via Airport Express",
        bus: "45-75 minutes", 
        cost: "$50-70 taxi, $12 Airport Express"
      },
      lounges: ["Cathay Pacific The Pier", "Plaza Premium", "United Club"],
      bestFor: "Asian connections and efficiency",
      tips: ["Free in-town check-in service", "Efficient Airport Express train"]
    },
    {
      name: "Amsterdam Schiphol Airport",
      code: "AMS",
      city: "Amsterdam",
      country: "Netherlands", 
      rating: 4.4,
      passengers: "71.7 million",
      terminals: 1,
      airlines: 100,
      destinations: 330,
      features: ["Rijksmuseum branch", "Library", "Casino", "Meditation center", "Park outdoor terrace"],
      transportation: {
        taxi: "20-45 minutes to city center",
        metro: "15-20 minutes via train",
        bus: "30-45 minutes",
        cost: "$45-60 taxi, $5 train"
      },
      lounges: ["KLM Crown Lounge", "Aspire Lounge", "Priority Pass"],
      bestFor: "European hub and cultural activities",
      tips: ["Single terminal makes connections easy", "Visit the museum annex"]
    }
  ];

  const airportTypes = [
    {
      type: "Hub Airports",
      description: "Major connection points with extensive airline networks",
      examples: ["Atlanta ATL", "Dubai DXB", "London LHR", "Amsterdam AMS"],
      pros: ["Many flight options", "Frequent connections", "Good facilities"],
      cons: ["Can be crowded", "Longer connection times", "More expensive"]
    },
    {
      type: "Focus Cities",
      description: "Important bases for airlines with good connectivity",
      examples: ["Seattle SEA", "Munich MUC", "Tokyo NRT", "Sydney SYD"],
      pros: ["Less crowded than hubs", "Good facilities", "Reasonable prices"],
      cons: ["Fewer flight options", "Limited off-peak services"]
    },
    {
      type: "Secondary Airports",
      description: "Alternative airports serving major cities",
      examples: ["London STN/LTN", "Paris BVA", "Milan BGY", "Tokyo HND"],
      pros: ["Often cheaper flights", "Less crowded", "Faster processing"],
      cons: ["Further from city center", "Limited amenities", "Fewer services"]
    },
    {
      type: "Regional Airports",
      description: "Smaller airports serving specific regions",
      examples: ["Venice VCE", "Nice NCE", "Zurich ZUR", "Copenhagen CPH"],
      pros: ["Quick and easy", "Shorter lines", "Close to destinations"],
      cons: ["Limited flight options", "Fewer amenities", "Weather delays"]
    }
  ];

  const airportAmenities = [
    {
      category: "Connectivity",
      icon: <Wifi className="h-6 w-6" />,
      features: ["Free WiFi (most major airports)", "Charging stations and power outlets", "Business centers with computers", "Mobile phone rental services"]
    },
    {
      category: "Dining & Shopping", 
      icon: <Utensils className="h-6 w-6" />,
      features: ["Local and international restaurants", "Fast food and coffee chains", "Duty-free shopping", "Local souvenir and gift shops"]
    },
    {
      category: "Comfort & Services",
      icon: <Clock className="h-6 w-6" />,
      features: ["Airport lounges and day rooms", "Shower facilities and spas", "Sleeping pods and quiet zones", "Baggage storage and wrapping"]
    },
    {
      category: "Transportation",
      icon: <Car className="h-6 w-6" />,
      features: ["Taxi and rideshare pickup zones", "Public transportation connections", "Car rental desks", "Hotel shuttle services"]
    }
  ];

  const travelTips = [
    {
      phase: "Before Departure",
      tips: [
        "Check in online 24 hours before departure",
        "Download airline and airport apps",
        "Verify passport validity (6+ months)",
        "Research airport layout and amenities",
        "Join airport lounge programs if traveling frequently"
      ]
    },
    {
      phase: "At the Airport",
      tips: [
        "Arrive 2-3 hours early for international flights",
        "Use mobile boarding passes when possible",
        "Pack liquids in 3-1-1 compliance",
        "Wear easy-to-remove shoes for security",
        "Keep important documents easily accessible"
      ]
    },
    {
      phase: "During Layovers",
      tips: [
        "Check minimum connection times",
        "Stay near your departure gate",
        "Set multiple alarms for boarding time",
        "Consider airport tours for long layovers",
        "Keep carry-on essentials with you"
      ]
    },
    {
      phase: "Upon Arrival",
      tips: [
        "Check visa requirements before travel",
        "Have customs declaration ready",
        "Download local transportation apps",
        "Exchange currency if needed",
        "Confirm onward transportation arrangements"
      ]
    }
  ];

  const connectionTips = [
    {
      timeFrame: "Short Connections (30-90 minutes)",
      advice: "Only recommended for same airline/alliance",
      tips: ["Stay in transit area", "Check if baggage transfers automatically", "Know gate locations in advance", "Consider travel insurance"]
    },
    {
      timeFrame: "Medium Connections (1.5-3 hours)", 
      advice: "Ideal for most international connections",
      tips: ["Time for meals and shopping", "Clear security if changing terminals", "Use airport WiFi to check gate changes", "Relax in lounges if available"]
    },
    {
      timeFrame: "Long Connections (3+ hours)",
      advice: "Opportunity to explore airport or city",
      tips: ["Consider leaving airport if visa allows", "Book airport hotels for overnight", "Use sleeping pods for rest", "Take advantage of airport amenities"]
    }
  ];

  return json({ topAirports, airportTypes, airportAmenities, travelTips, connectionTips });
}

export default function AirportGuide() {
  const { topAirports, airportTypes, airportAmenities, travelTips, connectionTips } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Airport Guide 2025
              </h1>
            </div>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Your complete guide to navigating airports worldwide. Discover amenities, transportation options, 
              dining, shopping, and insider tips for seamless travel experiences.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>500+ Airports Covered</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Real-Time Info</span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                <span>Transportation Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World's Best Airports */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            World's Best Airports 2025
          </h2>
          <p className="text-gray-600 text-lg">
            Top-rated airports for passenger experience, amenities, and overall quality.
          </p>
        </div>

        <div className="space-y-8">
          {topAirports.map((airport, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Airport Header */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 rounded-full p-3 mr-4">
                        <MapPin className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{airport.name}</h3>
                        <p className="text-gray-600">{airport.city}, {airport.country}</p>
                        <p className="text-sm text-gray-500">Airport Code: {airport.code}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(airport.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold">{airport.rating}/5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Passengers:</span> {airport.passengers}
                      </div>
                      <div>
                        <span className="font-medium">Terminals:</span> {airport.terminals}
                      </div>
                      <div>
                        <span className="font-medium">Airlines:</span> {airport.airlines}+
                      </div>
                      <div>
                        <span className="font-medium">Destinations:</span> {airport.destinations}+
                      </div>
                    </div>
                  </div>

                  {/* Airport Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Key Features
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {airport.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full mr-2 mt-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-semibold text-gray-900 mb-2 mt-4 flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Best For
                        </h4>
                        <p className="text-sm text-gray-600">{airport.bestFor}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            Transportation
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>Taxi:</strong> {airport.transportation.taxi}</div>
                            <div><strong>Public Transit:</strong> {airport.transportation.metro}</div>
                            <div><strong>Cost:</strong> {airport.transportation.cost}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Airport Lounges</h4>
                          <div className="flex flex-wrap gap-1">
                            {airport.lounges.map((lounge, idx) => (
                              <span key={idx} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                                {lounge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Insider Tips</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {airport.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="text-emerald-600 mr-2">💡</div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Airport Types */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Different Airport Types
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the right airport type for your travel needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {airportTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {type.type}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">✅ Advantages</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {type.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">⚠️ Considerations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {type.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2 mt-2"></div>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airport Amenities */}
      <div className="bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What to Expect at Modern Airports
            </h2>
            <p className="text-gray-600 text-lg">
              Standard amenities and services available at major airports worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {airportAmenities.map((amenity, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-emerald-600 mb-4">
                  
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {amenity.category}
                </h3>
                <ul className="space-y-2">
                  {amenity.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Tips by Phase */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Airport Travel Tips by Phase
            </h2>
            <p className="text-gray-600 text-lg">
              Expert advice for every stage of your airport experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((phase, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {phase.phase}
                </h3>
                <ul className="space-y-3">
                  {phase.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Guide */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Airport Connection Guide
            </h2>
            <p className="text-gray-600 text-lg">
              How to handle different connection times and make the most of layovers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {connectionTips.map((connection, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {connection.timeFrame}
                </h3>
                <div className="text-sm text-blue-600 font-medium mb-4">
                  {connection.advice}
                </div>
                <ul className="space-y-2">
                  {connection.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
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
              Complete Airport Navigation and Travel Guide 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Airport Security Tips</h3>
                <p className="text-gray-600 mb-4">
                  Navigate airport security efficiently with these expert tips:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Follow 3-1-1 liquids rule: 3oz containers, 1 quart bag, 1 bag per passenger</li>
                  <li>• Wear slip-on shoes and avoid metal accessories</li>
                  <li>• Keep electronics larger than phone in separate bins</li>
                  <li>• Have ID and boarding pass ready at all checkpoints</li>
                  <li>• Consider TSA PreCheck or Global Entry for faster processing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Airport Lounge Access</h3>
                <p className="text-gray-600 mb-4">
                  Ways to access airport lounges for comfortable travel:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Elite status with airlines or airline alliances</li>
                  <li>• Premium credit cards with lounge access benefits</li>
                  <li>• Priority Pass membership for independent lounges</li>
                  <li>• Day passes purchased directly from lounges</li>
                  <li>• Business or first-class ticket holders</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Airport Dining and Shopping Guide</h3>
              <p className="text-gray-600 mb-4">
                Make the most of airport amenities while waiting for your flight:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dining Options</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Fast food chains (McDonald's, Starbucks)</li>
                    <li>• Local restaurants featuring regional cuisine</li>
                    <li>• Grab-and-go options for quick meals</li>
                    <li>• Fine dining for special occasions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shopping Categories</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Duty-free alcohol, tobacco, and perfumes</li>
                    <li>• Electronics and travel accessories</li>
                    <li>• Local souvenirs and gifts</li>
                    <li>• Luxury brands and designer goods</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Shopping Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Compare prices before assuming duty-free savings</li>
                    <li>• Check liquid restrictions for purchases</li>
                    <li>• Save receipts for customs declarations</li>
                    <li>• Consider weight limits for additional purchases</li>
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