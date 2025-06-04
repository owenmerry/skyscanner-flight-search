import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Search, TrendingUp, Shield, Clock, DollarSign, CheckCircle } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Flight Comparison Guide 2025 - How to Find & Compare Cheap Flights" },
    { 
      name: "description", 
      content: "Learn how to compare flights and find the best deals. Complete guide to flight comparison sites, booking tips, and strategies to save money on airfare in 2025." 
    },
    { name: "keywords", content: "flight comparison, flight booking guide, compare flights, flight search tips, cheap airfare, flight booking strategies, best flight deals" },
    { property: "og:title", content: "Flight Comparison Guide - Find the Best Flight Deals" },
    { property: "og:description", content: "Master the art of flight comparison and booking. Learn expert strategies to find cheap flights and save money." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded comparison guide data
  const comparisonSites = [
    {
      name: "Google Flights",
      rating: 4.8,
      pros: ["Comprehensive search", "Price tracking", "Easy date flexibility", "No booking fees"],
      cons: ["Limited customer service", "Basic filtering options"],
      bestFor: "Overall flight search and price tracking",
      specialty: "Price alerts and flexible dates"
    },
    {
      name: "Skyscanner", 
      rating: 4.7,
      pros: ["Global coverage", "Whole month view", "Mix and match airlines", "Price prediction"],
      cons: ["Some outdated prices", "Complex interface"],
      bestFor: "International flights and route flexibility",
      specialty: "Cheapest month finder"
    },
    {
      name: "Kayak",
      rating: 4.6,
      pros: ["Comprehensive filters", "Price forecasting", "Trip planning tools", "Hotel bundling"],
      cons: ["Cluttered interface", "Redirects to booking sites"],
      bestFor: "Advanced filtering and trip planning",
      specialty: "Price prediction and hacker fares"
    },
    {
      name: "Momondo",
      rating: 4.5,
      pros: ["Creative route options", "Price insights", "Beautiful interface", "Deal alerts"],
      cons: ["Limited customer support", "Fewer direct bookings"],
      bestFor: "Creative routing and price analysis",
      specialty: "Alternative route suggestions"
    },
    {
      name: "Expedia",
      rating: 4.3,
      pros: ["Package deals", "Loyalty program", "24/7 support", "Booking protection"],
      cons: ["Higher prices sometimes", "Upselling attempts"],
      bestFor: "Package bookings and customer support",
      specialty: "Flight + hotel packages"
    },
    {
      name: "Priceline",
      rating: 4.2,
      pros: ["Express deals", "Name your price", "VIP program", "Last-minute deals"],
      cons: ["Limited transparency", "Restrictive booking terms"],
      bestFor: "Mystery deals and last-minute bookings",
      specialty: "Express deals with hidden airline names"
    }
  ];

  const bookingTips = [
    {
      category: "Timing",
      tips: [
        "Book domestic flights 1-3 months in advance",
        "Book international flights 2-8 months ahead", 
        "Fly on Tuesday, Wednesday, or Saturday",
        "Avoid booking on Sundays (most expensive day)",
        "Clear browser cookies before booking"
      ]
    },
    {
      category: "Flexibility",
      tips: [
        "Be flexible with travel dates (±3 days)",
        "Consider nearby airports within 100 miles",
        "Mix and match airlines for round trips",
        "Consider connecting flights vs direct",
        "Use the 'whole month' view for cheapest dates"
      ]
    },
    {
      category: "Search Strategy", 
      tips: [
        "Search multiple booking sites and compare",
        "Check airline websites directly for deals",
        "Use incognito/private browsing mode",
        "Set up price alerts for your route",
        "Consider one-way vs round-trip pricing"
      ]
    },
    {
      category: "Booking",
      tips: [
        "Read the fine print before purchasing",
        "Consider travel insurance for expensive trips",
        "Join airline loyalty programs for perks",
        "Pay with a credit card for protection",
        "Double-check passport validity (6+ months)"
      ]
    }
  ];

  const pricingFactors = [
    {
      factor: "Seasonality",
      impact: "High",
      description: "Peak travel seasons (summer, holidays) cost 30-100% more",
      tip: "Travel during shoulder seasons for 20-40% savings"
    },
    {
      factor: "Day of Week",
      impact: "Medium", 
      description: "Weekend departures cost 10-25% more than midweek",
      tip: "Fly Tuesday-Thursday for lowest prices"
    },
    {
      factor: "Advance Booking",
      impact: "High",
      description: "Last-minute bookings can cost 50-200% more",
      tip: "Sweet spot is 6-8 weeks for domestic, 8-12 weeks international"
    },
    {
      factor: "Route Popularity",
      impact: "Medium",
      description: "Popular routes have more competition and options",
      tip: "Consider connecting flights on less popular routes"
    },
    {
      factor: "Fuel Prices",
      impact: "Low-Medium",
      description: "Fuel surcharges affect long-haul international flights",
      tip: "Monitor oil prices for potential fare changes"
    },
    {
      factor: "Competition",
      impact: "High",
      description: "Routes with multiple airlines have better prices",
      tip: "Avoid monopoly routes or consider nearby airports"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Not comparing enough sources",
      solution: "Check at least 3-4 booking sites plus airline websites",
      cost: "Could miss savings of $50-200+"
    },
    {
      mistake: "Booking too early or too late", 
      solution: "Follow the 6-8 week rule for domestic, 8-12 weeks international",
      cost: "Can cost 20-100% more than optimal timing"
    },
    {
      mistake: "Only looking at direct flights",
      solution: "Consider 1-stop flights which can be 30-50% cheaper",
      cost: "Missing potential savings of $100-500"
    },
    {
      mistake: "Not being flexible with dates",
      solution: "Use flexible date tools and consider ±3 days",
      cost: "Could save 20-40% with date flexibility"
    },
    {
      mistake: "Ignoring nearby airports",
      solution: "Check airports within 50-100 miles of destination",
      cost: "Potential savings of $50-300 per ticket"
    },
    {
      mistake: "Not reading the fine print",
      solution: "Check baggage fees, change policies, and restrictions",
      cost: "Hidden fees can add $50-200 to total cost"
    }
  ];

  return json({ comparisonSites, bookingTips, pricingFactors, commonMistakes });
}

export default function FlightComparisonGuide() {
  const { comparisonSites, bookingTips, pricingFactors, commonMistakes } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Search className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flight Comparison & Booking Guide
              </h1>
            </div>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Master the art of finding cheap flights. Learn expert strategies, comparison techniques, 
              and insider tips to save money on every flight booking.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>Save up to 60%</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Expert Strategies</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Booking Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Flight Comparison Sites */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Best Flight Comparison Sites 2025
          </h2>
          <p className="text-gray-600 text-lg">
            Compare the top flight search engines and find the right tool for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {comparisonSites.map((site, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {site.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(site.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{site.rating}/5.0</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{site.bestFor}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-semibold text-green-800 mb-2">Strengths:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {site.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">Limitations:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {site.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        </div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Specialty:</h4>
                  <p className="text-sm text-blue-700">{site.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Booking Tips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Flight Booking Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Proven strategies used by travel experts to find the cheapest flights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookingTips.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flight Pricing Factors */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Affects Flight Prices?
            </h2>
            <p className="text-gray-600 text-lg">
              Understand the key factors that influence airfare pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingFactors.map((factor, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {factor.factor}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                    factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {factor.impact} Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {factor.description}
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">
                    💡 {factor.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Booking Mistakes */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Flight Booking Mistakes to Avoid
            </h2>
            <p className="text-gray-600 text-lg">
              Learn from these expensive mistakes that cost travelers thousands each year.
            </p>
          </div>

          <div className="space-y-6">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      ❌ {item.mistake}
                    </h3>
                    <p className="text-red-700 text-sm">
                      {item.cost}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">
                      ✅ Solution:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {item.solution}
                    </p>
                  </div>
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
              Complete Flight Comparison and Booking Strategy Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Step-by-Step Flight Search Process</h3>
                <p className="text-gray-600 mb-4">
                  Follow this systematic approach to find the best flight deals every time:
                </p>
                <ol className="space-y-2 text-gray-600">
                  <li>1. Start with flexible date searches on Google Flights or Skyscanner</li>
                  <li>2. Compare results across 3-4 different booking sites</li>
                  <li>3. Check airline websites directly for exclusive deals</li>
                  <li>4. Consider nearby airports within 50-100 miles</li>
                  <li>5. Look at both one-way and round-trip options</li>
                  <li>6. Set up price alerts if you're not ready to book</li>
                  <li>7. Clear cookies and search in incognito mode before booking</li>
                  <li>8. Read all terms and conditions before purchasing</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Advanced Money-Saving Techniques</h3>
                <p className="text-gray-600 mb-4">
                  These advanced strategies can save experienced travelers even more:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Hidden city ticketing:</strong> Book connecting flights but get off at the layover (risky)</li>
                  <li>• <strong>Mistake fares:</strong> Follow deal blogs for airline pricing errors</li>
                  <li>• <strong>Positioning flights:</strong> Fly to a cheaper departure city first</li>  
                  <li>• <strong>Multi-city trips:</strong> Sometimes cheaper than round-trip tickets</li>
                  <li>• <strong>Split ticketing:</strong> Book two one-way tickets instead of round-trip</li>
                  <li>• <strong>Airline alliances:</strong> Use partner airlines for better award availability</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Flight Booking Protection and Insurance</h3>
              <p className="text-gray-600 mb-4">
                Protect your investment with these booking and travel insurance options:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Credit Card Protection</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Purchase protection and extended warranty</li>
                    <li>• Trip cancellation/interruption coverage</li>
                    <li>• Baggage delay/loss reimbursement</li>
                    <li>• Emergency medical coverage abroad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Travel Insurance</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive trip cancellation coverage</li>
                    <li>• Medical emergency and evacuation</li>
                    <li>• Coverage for pre-existing conditions</li>
                    <li>• Cancel for any reason policies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Airline Policies</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 24-hour free cancellation window</li>
                    <li>• Change fees and restrictions</li>
                    <li>• Refund policies for different fare types</li>
                    <li>• Weather delay compensation</li>
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