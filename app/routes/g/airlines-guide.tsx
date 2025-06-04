import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Star, Plane, Wifi, Coffee, Luggage, Users } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Airlines Guide 2025 - Compare Airlines, Reviews & Flight Deals" },
    { 
      name: "description", 
      content: "Complete guide to world airlines 2025. Compare airline reviews, baggage policies, frequent flyer programs, and find the best airline for your needs. Book flights with top-rated airlines." 
    },
    { name: "keywords", content: "airlines guide, airline reviews, best airlines 2025, airline comparison, frequent flyer programs, airline baggage policy, airline ratings" },
    { property: "og:title", content: "Airlines Guide 2025 - Compare Top Airlines Worldwide" },
    { property: "og:description", content: "Comprehensive guide to choosing the best airline. Compare ratings, services, and policies of major airlines worldwide." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded airlines data
  const topAirlines = [
    {
      name: "Singapore Airlines",
      iataCode: "SQ",
      rating: 4.9,
      country: "Singapore",
      founded: 1947,
      fleet: 135,
      destinations: 130,
      headquarters: "Singapore",
      keyRoutes: ["Singapore-London", "Singapore-New York", "Singapore-Sydney"],
      strengths: ["Service excellence", "Premium cabins", "Changi Airport hub", "KrisFlyer program"],
      weaknesses: ["Premium pricing", "Limited US routes"],
      baggage: { carry: "7kg", checked: "23kg", extra: "$150-300" },
      entertainment: "KrisWorld with 1,800+ options",
      frequentFlyer: "KrisFlyer - Star Alliance",
      classTypes: ["Economy", "Premium Economy", "Business", "First/Suites"]
    },
    {
      name: "Qatar Airways",
      iataCode: "QR", 
      rating: 4.8,
      country: "Qatar",
      founded: 1997,
      fleet: 245,
      destinations: 160,
      headquarters: "Doha",
      keyRoutes: ["Doha-London", "Doha-New York", "Doha-Bangkok"],
      strengths: ["Qsuite business class", "Doha hub", "Award-winning service", "Modern fleet"],
      weaknesses: ["Political restrictions", "Limited lounges outside hubs"],
      baggage: { carry: "7kg", checked: "23kg", extra: "$100-250" },
      entertainment: "Oryx One with 4,000+ options",
      frequentFlyer: "Privilege Club - oneworld",
      classTypes: ["Economy", "Premium Economy", "Business", "First"]
    },
    {
      name: "Emirates",
      iataCode: "EK",
      rating: 4.7,
      country: "UAE", 
      founded: 1985,
      fleet: 270,
      destinations: 150,
      headquarters: "Dubai",
      keyRoutes: ["Dubai-London", "Dubai-New York", "Dubai-Sydney"],
      strengths: ["A380 experience", "Dubai hub", "Premium amenities", "Global network"],
      weaknesses: ["Fuel surcharges", "Airport chaos in Dubai"],
      baggage: { carry: "7kg", checked: "23kg", extra: "$120-280" },
      entertainment: "ice with 6,500+ options",
      frequentFlyer: "Emirates Skywards",
      classTypes: ["Economy", "Premium Economy", "Business", "First"]
    },
    {
      name: "All Nippon Airways",
      iataCode: "NH",
      rating: 4.6,
      country: "Japan",
      founded: 1952,
      fleet: 220,
      destinations: 190,
      headquarters: "Tokyo",
      keyRoutes: ["Tokyo-Los Angeles", "Tokyo-London", "Tokyo-Bangkok"],
      strengths: ["Japanese hospitality", "Punctuality", "Premium dining", "The Room first class"],
      weaknesses: ["Language barriers", "Limited European network"],
      baggage: { carry: "10kg", checked: "23kg", extra: "$100-200" },
      entertainment: "ANA Entertainment with 1,200+ options",
      frequentFlyer: "ANA Mileage Club - Star Alliance",
      classTypes: ["Economy", "Premium Economy", "Business", "First"]
    },
    {
      name: "Cathay Pacific",
      iataCode: "CX",
      rating: 4.5,
      country: "Hong Kong",
      founded: 1946,
      fleet: 190,
      destinations: 190,
      headquarters: "Hong Kong",
      keyRoutes: ["Hong Kong-London", "Hong Kong-New York", "Hong Kong-Sydney"],
      strengths: ["Business class seats", "Hong Kong hub", "Service quality", "Regional network"],
      weaknesses: ["Political uncertainty", "Aging fleet issues"],
      baggage: { carry: "7kg", checked: "23kg", extra: "$80-180" },
      entertainment: "StudioCX with 1,500+ options",
      frequentFlyer: "Asia Miles - oneworld",
      classTypes: ["Economy", "Premium Economy", "Business", "First"]
    },
    {
      name: "British Airways",
      iataCode: "BA",
      rating: 4.2,
      country: "United Kingdom",
      founded: 1974,
      fleet: 280,
      destinations: 200,
      headquarters: "London",
      keyRoutes: ["London-New York", "London-Dubai", "London-Singapore"],
      strengths: ["Extensive network", "Club World business", "Heathrow hub", "Avios program"],
      weaknesses: ["Inconsistent service", "High fuel surcharges"],
      baggage: { carry: "6kg", checked: "23kg", extra: "$90-220" },
      entertainment: "Highlife with 1,300+ options",
      frequentFlyer: "Executive Club - oneworld",
      classTypes: ["Economy", "Premium Economy", "Business", "First"]
    }
  ];

  const budgetAirlines = [
    {
      name: "Southwest Airlines",
      region: "North America",
      routes: "150+ US cities",
      strengths: ["No change fees", "Free bags", "Flexible booking"],
      pricing: "Low-cost with extras included"
    },
    {
      name: "Ryanair", 
      region: "Europe",
      routes: "200+ European cities",
      strengths: ["Ultra-low fares", "Extensive network", "Frequent flights"],
      pricing: "Base fare + fees for everything"
    },
    {
      name: "AirAsia",
      region: "Asia-Pacific", 
      routes: "120+ Asian destinations",
      strengths: ["Regional connectivity", "Modern fleet", "Digital services"],
      pricing: "Low base fare + optional add-ons"
    },
    {
      name: "EasyJet",
      region: "Europe",
      routes: "180+ European routes", 
      strengths: ["Convenient airports", "Allocated seating", "Good punctuality"],
      pricing: "Competitive fares with reasonable fees"
    }
  ];

  const airlineAlliances = [
    {
      name: "Star Alliance",
      founded: 1997,
      members: 26,
      destinations: 1200,
      countries: 190,
      majorAirlines: ["United", "Lufthansa", "Singapore Airlines", "ANA", "Air Canada"],
      benefits: ["Global lounge access", "Elite status recognition", "Round-the-world tickets"],
      bestFor: "Global coverage and seamless connections"
    },
    {
      name: "oneworld",
      founded: 1999, 
      members: 14,
      destinations: 1000,
      countries: 170,
      majorAirlines: ["American Airlines", "British Airways", "Qatar Airways", "Cathay Pacific"],
      benefits: ["Premium service focus", "Excellent business class", "Strong in premium markets"],
      bestFor: "Premium travel and business routes"
    },
    {
      name: "SkyTeam",
      founded: 2000,
      members: 19,
      destinations: 1150,
      countries: 175,
      majorAirlines: ["Delta", "Air France", "KLM", "Korean Air", "China Airlines"],
      benefits: ["Strong European network", "Good Asian coverage", "Competitive pricing"],
      bestFor: "Europe-Asia connections and value travel"
    }
  ];

  const selectionCriteria = [
    {
      factor: "Route Network",
      importance: "High",
      considerations: ["Direct flights to your destinations", "Hub locations", "Alliance partnerships", "Frequency of service"]
    },
    {
      factor: "Service Quality",
      importance: "High", 
      considerations: ["Cabin crew service", "Food and beverage", "Seat comfort", "Entertainment options"]
    },
    {
      factor: "Price & Value",
      importance: "High",
      considerations: ["Base fare pricing", "Baggage fees", "Change/cancellation policies", "Loyalty program value"]
    },
    {
      factor: "Reliability",
      importance: "Medium-High",
      considerations: ["On-time performance", "Cancellation rates", "Customer service response", "Schedule stability"]
    },
    {
      factor: "Fleet & Safety",
      importance: "Medium",
      considerations: ["Aircraft age and type", "Safety record", "Maintenance standards", "Technology features"]
    }
  ];

  return json({ topAirlines, budgetAirlines, airlineAlliances, selectionCriteria });
}

export default function AirlinesGuide() {
  const { topAirlines, budgetAirlines, airlineAlliances, selectionCriteria } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Airlines Guide 2025
              </h1>
            </div>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto mb-8">
              Complete guide to choosing the best airline for your needs. Compare ratings, 
              services, baggage policies, and frequent flyer programs of major airlines worldwide.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Expert Reviews</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>50+ Airlines Covered</span>
              </div>
              <div className="flex items-center">
                <Luggage className="h-5 w-5 mr-2" />
                <span>Policy Comparisons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Rated Airlines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            World's Best Airlines 2025
          </h2>
          <p className="text-gray-600 text-lg">
            Top-rated airlines based on service quality, safety, and customer satisfaction.
          </p>
        </div>

        <div className="space-y-8">
          {topAirlines.map((airline, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Airline Header */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 rounded-full p-3 mr-4">
                        <Plane className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{airline.name}</h3>
                        <p className="text-gray-600">{airline.country} • {airline.iataCode}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(airline.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold">{airline.rating}/5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Fleet:</span> {airline.fleet} aircraft
                      </div>
                      <div>
                        <span className="font-medium">Routes:</span> {airline.destinations} destinations
                      </div>
                      <div>
                        <span className="font-medium">Founded:</span> {airline.founded}
                      </div>
                      <div>
                        <span className="font-medium">Hub:</span> {airline.headquarters}
                      </div>
                    </div>
                  </div>

                  {/* Airline Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✅ Strengths</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {airline.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-semibold text-gray-900 mb-2 mt-4">⚠️ Considerations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {airline.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-yellow-500 rounded-full mr-2 mt-2"></div>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Luggage className="h-4 w-4 mr-2" />
                            Baggage Policy
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Carry-on: {airline.baggage.carry}</div>
                            <div>Checked: {airline.baggage.checked}</div>
                            <div>Extra fees: {airline.baggage.extra}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Star className="h-4 w-4 mr-2" />
                            Loyalty Program
                          </h4>
                          <p className="text-sm text-gray-600">{airline.frequentFlyer}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Class Options</h4>
                          <div className="flex flex-wrap gap-1">
                            {airline.classTypes.map((classType, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {classType}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Routes</h4>
                      <div className="flex flex-wrap gap-2">
                        {airline.keyRoutes.map((route, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {route}
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

      {/* Budget Airlines */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Budget Airlines by Region
            </h2>
            <p className="text-gray-600 text-lg">
              Low-cost carriers that offer great value without compromising safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetAirlines.map((airline, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {airline.name}
                </h3>
                <div className="text-sm text-blue-600 font-medium mb-3">
                  {airline.region}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {airline.routes}
                </div>
                
                <div className="space-y-2">
                  {airline.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                      {strength}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 font-medium">
                    {airline.pricing}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airline Alliances */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Major Airline Alliances
            </h2>
            <p className="text-gray-600 text-lg">
              Understanding airline partnerships and how they benefit travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {airlineAlliances.map((alliance, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {alliance.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Members:</span> {alliance.members} airlines
                  </div>
                  <div>
                    <span className="font-medium">Founded:</span> {alliance.founded}
                  </div>
                  <div>
                    <span className="font-medium">Destinations:</span> {alliance.destinations}+
                  </div>
                  <div>
                    <span className="font-medium">Countries:</span> {alliance.countries}+
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Major Airlines</h4>
                  <div className="flex flex-wrap gap-1">
                    {alliance.majorAirlines.map((airline, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {airline}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {alliance.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Best For:</div>
                  <div className="text-sm text-blue-700">{alliance.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airline Selection Guide */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Choose the Right Airline
            </h2>
            <p className="text-gray-600 text-lg">
              Key factors to consider when selecting an airline for your trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectionCriteria.map((criteria, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {criteria.factor}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    criteria.importance === 'High' ? 'bg-red-100 text-red-800' :
                    criteria.importance.includes('Medium') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {criteria.importance}
                  </span>
                </div>
                
                <ul className="space-y-2">
                  {criteria.considerations.map((consideration, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-sky-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {consideration}
                    </li>
                  ))}
                </ul>
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
              Complete Guide to Airlines and Air Travel 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Understanding Airline Classes</h3>
                <p className="text-gray-600 mb-4">
                  Airlines offer different service classes to meet various traveler needs and budgets:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Economy Class:</strong> Basic service with standard seats and meals</li>
                  <li>• <strong>Premium Economy:</strong> Extra legroom and enhanced service</li>
                  <li>• <strong>Business Class:</strong> Lie-flat seats, premium dining, lounge access</li>
                  <li>• <strong>First Class:</strong> Ultimate luxury with private suites and personalized service</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Frequent Flyer Programs</h3>
                <p className="text-gray-600 mb-4">
                  Maximize your travel value with airline loyalty programs:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Earn miles or points for flights and purchases</li>
                  <li>• Achieve elite status for upgrades and perks</li>
                  <li>• Transfer points between alliance partners</li>
                  <li>• Redeem for free flights, upgrades, and experiences</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Airline Safety and Ratings</h3>
              <p className="text-gray-600 mb-4">
                All major airlines maintain high safety standards, but some factors distinguish top performers:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Safety Record</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• IATA Operational Safety Audit (IOSA)</li>
                    <li>• Government safety oversight ratings</li>
                    <li>• Incident and accident history</li>
                    <li>• Fleet age and maintenance standards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Quality</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Skytrax World Airline Awards</li>
                    <li>• Customer satisfaction surveys</li>
                    <li>• On-time performance statistics</li>
                    <li>• Baggage handling efficiency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Value Assessment</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Price competitiveness by route</li>
                    <li>• Included amenities and services</li>
                    <li>• Change and cancellation policies</li>
                    <li>• Loyalty program value proposition</li>
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