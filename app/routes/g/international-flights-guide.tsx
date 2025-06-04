import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Globe, Shield, Clock} from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "International Flights Guide 2025 - Cheap International Flights & Travel Tips" },
    { 
      name: "description", 
      content: "Complete guide to international flights 2025. Find cheap international flights, visa requirements, travel documentation, and expert tips for overseas travel planning." 
    },
    { name: "keywords", content: "international flights, overseas flights, international travel, passport requirements, visa information, international flight deals, overseas travel tips" },
    { property: "og:title", content: "International Flights Guide 2025 - Your Gateway to the World" },
    { property: "og:description", content: "Everything you need to know about international travel. Find cheap flights and essential travel information for overseas trips." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded international travel data
  const popularInternationalRoutes = [
    {
      from: "New York",
      to: "London",
      route: "JFK-LHR",
      distance: "3,459 miles",
      flightTime: "7h 30m",
      averagePrice: 485,
      airlines: ["British Airways", "Virgin Atlantic", "American Airlines", "Delta"],
      bestTimeToBook: "2-4 months ahead",
      peakSeason: "June-August",
      shoulderSeason: "April-May, September-October",
      lowSeason: "November-March",
      slug: "jfk/to/lhr"
    },
    {
      from: "Los Angeles", 
      to: "Tokyo",
      route: "LAX-NRT",
      distance: "5,433 miles",
      flightTime: "11h 15m",
      averagePrice: 650,
      airlines: ["Japan Airlines", "All Nippon Airways", "United", "American Airlines"],
      bestTimeToBook: "3-5 months ahead",
      peakSeason: "March-May (cherry blossom), July-August",
      shoulderSeason: "September-November",
      lowSeason: "December-February",
      slug: "lax/to/nrt"
    },
    {
      from: "Miami",
      to: "Barcelona", 
      route: "MIA-BCN",
      distance: "4,533 miles",
      flightTime: "8h 45m",
      averagePrice: 420,
      airlines: ["Iberia", "American Airlines", "Level", "Air Europa"],
      bestTimeToBook: "2-3 months ahead",
      peakSeason: "June-August",
      shoulderSeason: "April-May, September-October",
      lowSeason: "November-March",
      slug: "mia/to/bcn"
    },
    {
      from: "Chicago",
      to: "Frankfurt",
      route: "ORD-FRA", 
      distance: "4,336 miles",
      flightTime: "8h 30m",
      averagePrice: 520,
      airlines: ["Lufthansa", "United Airlines", "American Airlines"],
      bestTimeToBook: "2-4 months ahead",
      peakSeason: "May-September",
      shoulderSeason: "April, October",
      lowSeason: "November-March",
      slug: "ord/to/fra"
    },
    {
      from: "San Francisco",
      to: "Paris",
      route: "SFO-CDG",
      distance: "5,558 miles", 
      flightTime: "11h 15m",
      averagePrice: 580,
      airlines: ["Air France", "United Airlines", "Delta", "KLM"],
      bestTimeToBook: "3-4 months ahead",
      peakSeason: "May-August",
      shoulderSeason: "April, September-October",
      lowSeason: "November-March",
      slug: "sfo/to/cdg"
    },
    {
      from: "Boston",
      to: "Dublin",
      route: "BOS-DUB",
      distance: "2,993 miles",
      flightTime: "6h 30m", 
      averagePrice: 380,
      airlines: ["Aer Lingus", "Delta", "Virgin Atlantic"],
      bestTimeToBook: "2-3 months ahead",
      peakSeason: "June-August",
      shoulderSeason: "April-May, September",
      lowSeason: "October-March",
      slug: "bos/to/dub"
    }
  ];

  const documentationGuide = [
    {
      document: "Passport",
      requirements: [
        "Valid for at least 6 months beyond travel date",
        "Must have blank pages for entry/exit stamps",
        "Check processing times (6-11 weeks standard)",
        "Consider expedited service if needed (2-3 weeks)"
      ],
      tips: [
        "Make photocopies and store separately",
        "Take photos of passport pages on your phone",
        "Check passport validity well in advance",
        "Some countries require 2+ blank pages"
      ],
      cost: "$130-$165 for adults (new/renewal)"
    },
    {
      document: "Visa",
      requirements: [
        "Research requirements for each destination",
        "Apply 2-3 months before travel",
        "Some countries offer visa-on-arrival",
        "Transit visas may be required for connections"
      ],
      tips: [
        "Check if tourist visa is needed",
        "Some visas require travel insurance",
        "Keep digital and physical copies",
        "Understand single vs multiple entry visas"
      ],
      cost: "Varies by country ($50-$300+)"
    },
    {
      document: "Travel Insurance",
      requirements: [
        "Medical coverage for overseas treatment",
        "Emergency evacuation coverage",
        "Trip cancellation/interruption protection",
        "Coverage for pre-existing conditions (if applicable)"
      ],
      tips: [
        "Buy within 14 days of booking for full coverage",
        "Check if credit card provides travel insurance",
        "Understand coverage limits and exclusions",
        "Keep insurance documents accessible"
      ],
      cost: "2-10% of total trip cost"
    },
    {
      document: "Health Requirements",
      requirements: [
        "Check CDC recommendations for vaccinations",
        "Some countries require yellow fever certificate",
        "COVID-19 requirements (varies by destination)",
        "Consider travel health consultation"
      ],
      tips: [
        "Get vaccinations 4-6 weeks before travel",
        "Bring prescription medications in original bottles",
        "Research local health risks and precautions",
        "Pack basic first-aid supplies"
      ],
      cost: "Varies by destination and vaccines needed"
    }
  ];

  const regionalInsights = [
    {
      region: "Europe",
      averageFlightPrice: "$400-700",
      bestTimeToVisit: "April-May, September-October",
      visaInfo: "90-day tourist visa waiver for US citizens (Schengen Area)",
      currency: "Euro (€) in most countries",
      tips: [
        "Consider open-jaw tickets to visit multiple countries",
        "Budget airlines offer cheap intra-Europe flights",
        "Train travel is efficient for country-hopping",
        "Book accommodation early in summer"
      ],
      topDestinations: ["London", "Paris", "Rome", "Barcelona", "Amsterdam"]
    },
    {
      region: "Asia",
      averageFlightPrice: "$600-1200", 
      bestTimeToVisit: "October-March (varies by country)",
      visaInfo: "Varies by country - some visa-free, others require visa",
      currency: "Varies by country",
      tips: [
        "Consider stopover programs (Singapore, Dubai)",
        "Book well in advance for peak seasons",
        "Research local customs and etiquette",
        "Asia passes available for multi-country travel"
      ],
      topDestinations: ["Tokyo", "Bangkok", "Singapore", "Hong Kong", "Seoul"]
    },
    {
      region: "South America",
      averageFlightPrice: "$500-900",
      bestTimeToVisit: "April-May, September-November",
      visaInfo: "Tourist visa required for some countries",
      currency: "Varies by country",
      tips: [
        "Yellow fever vaccination may be required",
        "Consider altitude sickness in Andean regions",
        "Spanish/Portuguese language basics helpful",
        "Multi-city tickets often good value"
      ],
      topDestinations: ["Buenos Aires", "Lima", "Rio de Janeiro", "Santiago", "Bogotá"]
    },
    {
      region: "Africa",
      averageFlightPrice: "$800-1500",
      bestTimeToVisit: "May-October (varies by region)",
      visaInfo: "Visa required for most countries",
      currency: "Varies by country",
      tips: [
        "Multiple vaccinations usually required",
        "Consider travel insurance with evacuation coverage",
        "Research political stability and safety",
        "Book safari accommodations well in advance"
      ],
      topDestinations: ["Cape Town", "Cairo", "Marrakech", "Nairobi", "Lagos"]
    },
    {
      region: "Oceania",
      averageFlightPrice: "$900-1800",
      bestTimeToVisit: "September-November, March-May",
      visaInfo: "Electronic visa required for Australia",
      currency: "Australian/New Zealand Dollar",
      tips: [
        "Long flight times - consider stopovers",
        "Seasons are opposite to Northern Hemisphere",
        "Book domestic flights within region separately",
        "Consider working holiday visas for young travelers"
      ],
      topDestinations: ["Sydney", "Melbourne", "Auckland", "Brisbane", "Perth"]
    }
  ];

  const budgetTips = [
    {
      category: "Flight Booking",
      strategies: [
        "Book international flights 2-8 months in advance",
        "Consider flying mid-week (Tuesday-Thursday)",
        "Use flexible date searches to find cheapest options",
        "Compare one-way vs round-trip pricing",
        "Look into error fares and flash sales",
        "Consider positioning flights from cheaper departure cities"
      ]
    },
    {
      category: "Route Planning",
      strategies: [
        "Consider open-jaw tickets (fly into one city, out of another)",
        "Use stopovers to visit additional cities at no extra cost",
        "Compare direct vs connecting flights for savings",
        "Look into regional budget airlines for intra-region travel",
        "Consider overland travel between nearby countries",
        "Use airline alliances for round-the-world tickets"
      ]
    },
    {
      category: "Timing & Seasonality",
      strategies: [
        "Travel during shoulder seasons for 20-40% savings",
        "Avoid local holidays and peak tourist seasons",
        "Consider opposite seasons in Southern Hemisphere",
        "Book summer travel to Europe by February",
        "Take advantage of airline sales during slow booking periods",
        "Monitor currency exchange rates for additional savings"
      ]
    },
    {
      category: "Additional Savings",
      strategies: [
        "Use travel credit cards to earn points and miles",
        "Book hotels and flights together for package discounts",
        "Consider vacation rentals for longer stays",
        "Use public transportation instead of taxis",
        "Eat like a local at markets and street food stalls",
        "Look for free walking tours and museum days"
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: "Not checking passport validity",
      consequence: "Denied boarding or entry",
      solution: "Ensure passport valid 6+ months beyond travel date",
      prevention: "Check passport expiry when booking flights"
    },
    {
      mistake: "Ignoring visa requirements",
      consequence: "Entry denial, expensive last-minute visa fees",
      solution: "Research visa requirements for all destinations",
      prevention: "Check government websites 3+ months before travel"
    },
    {
      mistake: "Not considering jet lag",
      consequence: "Wasted vacation days recovering",
      solution: "Plan arrival time and first few days accordingly",
      prevention: "Research time differences and plan gradual adjustment"
    },
    {
      mistake: "Overpacking luggage",
      consequence: "Expensive baggage fees, mobility issues",
      solution: "Pack light, check airline baggage policies",
      prevention: "Practice packing weeks before departure"
    },
    {
      mistake: "Not notifying banks of travel",
      consequence: "Frozen cards, no access to money abroad",
      solution: "Notify all banks and credit card companies",
      prevention: "Set travel notifications 1-2 weeks before departure"
    },
    {
      mistake: "Skipping travel insurance",
      consequence: "Massive medical bills, trip loss",
      solution: "Buy comprehensive travel insurance",
      prevention: "Purchase within 14 days of booking for full coverage"
    }
  ];

  return json({ 
    popularInternationalRoutes, 
    documentationGuide, 
    regionalInsights, 
    budgetTips, 
    commonMistakes 
  });
}

export default function InternationalFlightsGuide() {
  const { 
    popularInternationalRoutes, 
    documentationGuide, 
    regionalInsights, 
    budgetTips, 
    commonMistakes 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                International Flights Guide 2025
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Your complete guide to international travel. Find cheap international flights, 
              understand visa requirements, and get expert tips for seamless overseas adventures.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Visa & Documentation</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Travel Insurance</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Expert Planning Tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular International Routes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Most Popular International Flight Routes
          </h2>
          <p className="text-gray-600 text-lg">
            Top international routes with flight times, pricing, and booking strategies.
          </p>
        </div>

        <div className="space-y-8">
          {popularInternationalRoutes.map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Route Header */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 rounded-full p-3 mr-4">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {route.from} → {route.to}
                        </h3>
                        <p className="text-gray-600">{route.route}</p>
                        <p className="text-sm text-gray-500">
                          {route.distance} • {route.flightTime}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        From ${route.averagePrice}
                      </div>
                      <div className="text-sm text-gray-500">average price</div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <strong>Best booking time:</strong> {route.bestTimeToBook}
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Airlines</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {route.airlines.map((airline, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {airline}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">Seasonal Pricing</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div><span className="text-red-600">Peak:</span> {route.peakSeason}</div>
                          <div><span className="text-yellow-600">Shoulder:</span> {route.shoulderSeason}</div>
                          <div><span className="text-green-600">Low:</span> {route.lowSeason}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Money-Saving Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <div className="text-green-600 mr-2">💡</div>
                            Book during shoulder season for 20-30% savings
                          </li>
                          <li className="flex items-start">
                            <div className="text-green-600 mr-2">💡</div>
                            Consider Tuesday/Wednesday departures
                          </li>
                          <li className="flex items-start">
                            <div className="text-green-600 mr-2">💡</div>
                            Use airline alliances for better award availability
                          </li>
                          <li className="flex items-start">
                            <div className="text-green-600 mr-2">💡</div>
                            Compare one-way vs round-trip pricing
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        to={`/flights/${route.slug}?departDate=${new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Find Flights: {route.from} to {route.to} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Guide */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              International Travel Documentation Guide
            </h2>
            <p className="text-gray-600 text-lg">
              Essential documents and requirements for international travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentationGuide.map((doc, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {doc.document}
                  </h3>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {doc.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {doc.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="text-green-600 mr-2">💡</div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Typical Cost</div>
                  <div className="text-sm text-blue-700">{doc.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Insights */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Regional Travel Insights
            </h2>
            <p className="text-gray-600 text-lg">
              Detailed information for planning trips to different world regions.
            </p>
          </div>

          <div className="space-y-8">
            {regionalInsights.map((region, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {region.region}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div>
                        <strong>Average Flight Cost:</strong> {region.averageFlightPrice}
                      </div>
                      <div>
                        <strong>Best Time to Visit:</strong> {region.bestTimeToVisit}
                      </div>
                      <div>
                        <strong>Visa Info:</strong> {region.visaInfo}
                      </div>
                      <div>
                        <strong>Currency:</strong> {region.currency}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Travel Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {region.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Top Destinations</h4>
                        <div className="flex flex-wrap gap-2">
                          {region.topDestinations.map((dest, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              International Travel Budget Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Expert strategies to save money on international flights and travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetTips.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.strategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common International Travel Mistakes to Avoid
            </h2>
            <p className="text-gray-600 text-lg">
              Learn from these expensive mistakes that cost travelers thousands each year.
            </p>
          </div>

          <div className="space-y-6">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-white border-l-4 border-red-500 rounded-lg p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      ❌ {item.mistake}
                    </h3>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                      Consequence:
                    </h4>
                    <p className="text-red-700 text-sm">
                      {item.consequence}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-800 mb-2">
                      Solution:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {item.solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                      Prevention:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {item.prevention}
                    </p>
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
              Complete International Travel Planning Guide 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Planning Timeline for International Travel</h3>
                <p className="text-gray-600 mb-4">
                  Proper timing is crucial for international trip planning. Follow this timeline for stress-free travel:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>6+ months ahead:</strong> Research destinations, check passport validity</li>
                  <li>• <strong>4-5 months:</strong> Apply for visas, get required vaccinations</li>
                  <li>• <strong>2-4 months:</strong> Book flights and main accommodations</li>
                  <li>• <strong>1-2 months:</strong> Purchase travel insurance, notify banks</li>
                  <li>• <strong>2-4 weeks:</strong> Check in online, download offline maps</li>
                  <li>• <strong>1 week:</strong> Confirm all bookings, pack strategically</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Money-Saving Strategies</h3>
                <p className="text-gray-600 mb-4">
                  International travel can be expensive, but these strategies help minimize costs:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use travel credit cards that waive foreign transaction fees</li>
                  <li>• Book accommodations with kitchen facilities for some meals</li>
                  <li>• Use public transportation instead of taxis and ride-shares</li>
                  <li>• Take advantage of free walking tours and museum days</li>
                  <li>• Shop at local markets for authentic and affordable food</li>
                  <li>• Consider house-sitting or home exchanges for free lodging</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Health and Safety Considerations</h3>
              <p className="text-gray-600 mb-4">
                Stay healthy and safe during international travel with proper preparation:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Before You Go</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visit travel medicine clinic 4-6 weeks before departure</li>
                    <li>• Research common health risks at destination</li>
                    <li>• Pack prescription medications in original bottles</li>
                    <li>• Get travel insurance with medical evacuation coverage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">While Traveling</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Drink bottled or properly filtered water</li>
                    <li>• Be cautious with street food and raw foods</li>
                    <li>• Use mosquito repellent in tropical areas</li>
                    <li>• Keep emergency contacts easily accessible</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Safety Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Register with your country's embassy</li>
                    <li>• Share itinerary with trusted contacts at home</li>
                    <li>• Research local laws and cultural norms</li>
                    <li>• Keep copies of important documents separate</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">International Travel FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">How far in advance should I book international flights?</h4>
                  <p className="text-gray-600">Generally 2-8 months ahead for the best prices. Europe: 2-4 months, Asia: 3-5 months, South America/Africa: 4-6 months.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Do I need travel insurance for international trips?</h4>
                  <p className="text-gray-600">Yes, travel insurance is highly recommended for international travel. It covers medical emergencies, trip cancellation, and lost luggage.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">What vaccinations do I need for international travel?</h4>
                  <p className="text-gray-600">Depends on your destination. Check CDC recommendations and consult a travel medicine clinic 4-6 weeks before departure.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Can I use my phone internationally?</h4>
                  <p className="text-gray-600">Yes, but international roaming can be expensive. Consider international plans, local SIM cards, or international eSIM options.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}