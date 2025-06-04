import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { MapPin, Clock, DollarSign, Plane, Star, TrendingUp } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Domestic Flights Guide 2025 - Cheap US Flights & Travel Tips" },
    { 
      name: "description", 
      content: "Complete guide to domestic flights in the USA 2025. Find cheap domestic flights, best airlines for US travel, and insider tips for flying within America." 
    },
    { name: "keywords", content: "domestic flights, US flights, cheap domestic flights, domestic airlines, US domestic travel, internal flights USA, domestic flight deals" },
    { property: "og:title", content: "Domestic Flights Guide 2025 - Master US Air Travel" },
    { property: "og:description", content: "Everything you need to know about flying within the United States. Find the best deals and airlines for domestic travel." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded domestic flights data
  const popularDomesticRoutes = [
    {
      route: "New York to Los Angeles",
      airports: "JFK/LGA/EWR → LAX",
      distance: "2,445 miles",
      flightTime: "6h 15m",
      averagePrice: 245,
      airlines: ["JetBlue", "American", "Delta", "United"],
      frequency: "50+ daily flights",
      bestDays: "Tuesday, Wednesday, Saturday",
      peakSeason: "Summer (June-August)",
      tips: ["Book 6-8 weeks ahead", "Consider Newark for cheaper options", "Red-eye flights save $50-100"],
      slug: "jfk/to/lax"
    },
    {
      route: "Los Angeles to San Francisco",
      airports: "LAX → SFO/OAK/SJC",
      distance: "347 miles",
      flightTime: "1h 30m",
      averagePrice: 89,
      airlines: ["Southwest", "Alaska", "United", "American"],
      frequency: "30+ daily flights",
      bestDays: "Tuesday, Wednesday",
      peakSeason: "Business travel peaks Mon/Fri",
      tips: ["Consider Oakland for budget options", "Very competitive route", "Drive time: 6+ hours"],
      slug: "lax/to/sfo"
    },
    {
      route: "Chicago to New York",
      airports: "ORD/MDW → JFK/LGA/EWR",
      distance: "740 miles", 
      flightTime: "2h 45m",
      averagePrice: 165,
      airlines: ["American", "United", "Delta", "Southwest"],
      frequency: "40+ daily flights",
      bestDays: "Tuesday, Wednesday, Saturday",
      peakSeason: "Fall business season",
      tips: ["Midway often cheaper than O'Hare", "Many nonstop options", "Book 4-6 weeks ahead"],
      slug: "ord/to/jfk"
    },
    {
      route: "Miami to New York",
      airports: "MIA/FLL → JFK/LGA/EWR",
      distance: "1,090 miles",
      flightTime: "3h 15m", 
      averagePrice: 185,
      airlines: ["JetBlue", "American", "Delta", "Southwest"],
      frequency: "25+ daily flights",
      bestDays: "Tuesday, Wednesday",
      peakSeason: "Winter (Dec-Mar)",
      tips: ["Fort Lauderdale can be $30-50 cheaper", "Seasonal pricing varies greatly", "Hurricane season affects summer pricing"],
      slug: "mia/to/jfk"
    },
    {
      route: "Denver to Las Vegas",
      airports: "DEN → LAS",
      distance: "628 miles",
      flightTime: "2h 15m",
      averagePrice: 125,
      airlines: ["Southwest", "United", "American", "Frontier"],
      frequency: "15+ daily flights",
      bestDays: "Tuesday, Wednesday", 
      peakSeason: "New Year, March Madness, Summer",
      tips: ["Frontier often has deals", "Weekend pricing +$50-100", "Book 3-4 weeks ahead"],
      slug: "den/to/las"
    },
    {
      route: "Seattle to Los Angeles",
      airports: "SEA → LAX",
      distance: "954 miles",
      flightTime: "2h 45m",
      averagePrice: 155,
      airlines: ["Alaska", "Southwest", "Delta", "American"],
      frequency: "20+ daily flights", 
      bestDays: "Tuesday, Wednesday",
      peakSeason: "Summer travel season",
      tips: ["Alaska Airlines dominates this route", "Consider Burbank airport", "Tech business travel keeps prices stable"],
      slug: "sea/to/lax"
    }
  ];

  const domesticAirlines = [
    {
      airline: "Southwest Airlines",
      marketShare: "18.3%",
      model: "Low-cost carrier",
      strengths: ["No change fees", "Free checked bags (2)", "Flexible booking", "Good customer service"],
      weaknesses: ["No assigned seats", "No first class", "Limited international routes"],
      bestFor: "Budget travelers, families, flexible bookings",
      routes: "150+ US cities",
      hubs: ["Dallas", "Chicago", "Las Vegas", "Phoenix"],
      tipicalPrice: "$89-249"
    },
    {
      airline: "American Airlines",
      marketShare: "17.8%", 
      model: "Full-service carrier",
      strengths: ["Extensive route network", "AAdvantage program", "Premium cabins", "International connections"],
      weaknesses: ["Change fees", "Baggage fees", "Inconsistent service"],
      bestFor: "Business travelers, frequent flyers, international connections",
      routes: "350+ destinations",
      hubs: ["Dallas", "Charlotte", "Phoenix", "Miami"],
      tipicalPrice: "$129-399"
    },
    {
      airline: "Delta Air Lines",
      marketShare: "17.1%",
      model: "Full-service carrier", 
      strengths: ["Reliable service", "SkyMiles program", "Premium amenities", "On-time performance"],
      weaknesses: ["Higher prices", "Change fees", "Limited budget options"],
      bestFor: "Premium travelers, business trips, reliability",
      routes: "300+ destinations",
      hubs: ["Atlanta", "Minneapolis", "Detroit", "Seattle"],
      tipicalPrice: "$149-429"
    },
    {
      airline: "United Airlines",
      marketShare: "15.9%",
      model: "Full-service carrier",
      strengths: ["Global network", "MileagePlus program", "Premium cabins", "Tech innovation"],
      weaknesses: ["Service inconsistency", "Fees", "Overbooking issues"],
      bestFor: "International connections, business travel, Star Alliance benefits",
      routes: "350+ destinations", 
      hubs: ["Chicago", "Denver", "Houston", "San Francisco"],
      tipicalPrice: "$139-389"
    },
    {
      airline: "JetBlue Airways",
      marketShare: "5.8%",
      model: "Low-cost carrier with amenities",
      strengths: ["Free WiFi", "Extra legroom", "Live TV", "Good customer service"],
      weaknesses: ["Limited route network", "No first class", "East Coast focused"],
      bestFor: "Leisure travelers, East Coast routes, value seekers",
      routes: "100+ destinations",
      hubs: ["New York JFK", "Boston", "Fort Lauderdale"],
      tipicalPrice: "$99-289"
    },
    {
      airline: "Alaska Airlines",
      marketShare: "5.2%",
      model: "Regional carrier with premium service",
      strengths: ["West Coast focus", "Mileage Plan program", "Good service", "On-time performance"],
      weaknesses: ["Limited East Coast presence", "Smaller network", "Seasonal routes"],
      bestFor: "West Coast travel, mileage earning, service quality",
      routes: "115+ destinations",
      hubs: ["Seattle", "Portland", "Los Angeles", "San Francisco"],
      tipicalPrice: "$119-319"
    }
  ];

  const budgetTips = [
    {
      category: "Booking Timing",
      tips: [
        "Book domestic flights 1-3 months in advance",
        "Tuesdays at 3pm ET often see price drops",
        "Avoid booking on Sundays (highest prices)",
        "Use flexible date searches to find cheapest options",
        "Set up price alerts for routes you're monitoring",
        "Book after major holidays for off-season deals"
      ]
    },
    {
      category: "Route & Airport Strategy",
      tips: [
        "Consider nearby airports (within 100 miles)",
        "Secondary airports often 20-40% cheaper",
        "One-way tickets sometimes cheaper than round-trip",
        "Connecting flights can save $50-150 vs nonstop",
        "Position yourself at airline hubs for more options",
        "Southwest doesn't appear on most search engines"
      ]
    },
    {
      category: "Airline & Fare Selection",
      tips: [
        "Compare basic economy vs regular economy value",
        "Budget airlines may have lower total cost",
        "Consider bundled packages (flight + hotel)",
        "Use airline credit cards for perks and savings",
        "Join frequent flyer programs even for occasional travel",
        "Book directly with airlines for better customer service"
      ]
    },
    {
      category: "Travel Hacks",
      tips: [
        "Pack only carry-on to save baggage fees",
        "Bring empty water bottle through security",
        "Use mobile boarding passes",
        "Arrive early for potential free upgrades",
        "Use airport lounges with day passes or credit cards",
        "Download entertainment before flight to avoid WiFi fees"
      ]
    }
  ];

  const seasonalTrends = [
    {
      season: "Spring (March-May)",
      priceLevel: "Moderate",
      characteristics: "Business travel picks up, spring break peaks in March",
      bestDeals: "April-May for summer destinations",
      avoid: "Spring break destinations in March",
      tipicalSavings: "10-20% vs summer"
    },
    {
      season: "Summer (June-August)", 
      priceLevel: "High",
      characteristics: "Peak family travel, highest demand",
      bestDeals: "Tuesday/Wednesday departures, book by February",
      avoid: "Weekend departures, popular vacation spots",
      tipicalSavings: "Book early or pay 30-50% premium"
    },
    {
      season: "Fall (September-November)",
      priceLevel: "Moderate-High",
      characteristics: "Business travel resumes, leaf-peeping season",
      bestDeals: "September after Labor Day",
      avoid: "October in New England, Thanksgiving week",
      tipicalSavings: "15-25% vs summer"
    },
    {
      season: "Winter (December-February)",
      priceLevel: "Variable",
      characteristics: "Holiday peaks, January lows, winter escapes",
      bestDeals: "January-February (except warm destinations)",
      avoid: "December 15-January 5, Presidents Day weekend",
      tipicalSavings: "Up to 40% in January"
    }
  ];

  const airportTips = [
    {
      airport: "Hartsfield-Jackson Atlanta (ATL)",
      type: "Major Hub",
      tips: ["Allow extra time - very busy", "Use plane train between terminals", "Food options in every terminal", "Delta hub with many connections"],
      bestFor: "Southeast connections",
      alternatives: "None nearby"
    },
    {
      airport: "Los Angeles (LAX)",
      type: "Major Gateway", 
      tips: ["Traffic delays common", "Allow 2+ hours for connections", "Use FlyAway bus or Metro", "Terminal shuttle can be slow"],
      bestFor: "International connections, West Coast hub",
      alternatives: "Burbank (BUR), Long Beach (LGB), Orange County (SNA)"
    },
    {
      airport: "Chicago O'Hare (ORD)",
      type: "Major Hub",
      tips: ["Weather delays common in winter", "Long walks between gates", "Blue Line to downtown", "United and American hub"],
      bestFor: "Midwest connections",
      alternatives: "Midway (MDW) - often cheaper"
    },
    {
      airport: "New York Area",
      type: "Multiple Options",
      tips: ["JFK: international, longest travel time", "LaGuardia: domestic, closest to Manhattan", "Newark: good alternative, less crowded"],
      bestFor: "Depends on destination in NYC",
      alternatives: "Consider all three plus Westchester (HPN)"
    },
    {
      airport: "Denver (DEN)",
      type: "High Altitude Hub",
      tips: ["Altitude affects some passengers", "Great mountain views", "A-Train to downtown", "United hub for West Coast"],
      bestFor: "Mountain destinations, West Coast connections",
      alternatives: "Colorado Springs (COS) for southern Colorado"
    }
  ];

  const loyaltyPrograms = [
    {
      program: "Southwest Rapid Rewards",
      airline: "Southwest",
      strengths: ["No blackout dates", "Points don't expire", "Companion Pass benefit", "Simple earning structure"],
      bestValue: "Domestic travel, families",
      tipToEarn: "Use Southwest credit card for bonus points"
    },
    {
      program: "American AAdvantage", 
      airline: "American",
      strengths: ["Oneworld alliance", "Extensive award availability", "Upgrade benefits", "International partnerships"],
      bestValue: "Business travel, international trips",
      tipToEarn: "Credit card spending, partner purchases"
    },
    {
      program: "Delta SkyMiles",
      airline: "Delta",
      strengths: ["No award expiration", "Flexible redemptions", "SkyTeam alliance", "Premium cabin awards"],
      bestValue: "Premium travel, reliability",
      tipToEarn: "Delta credit card, partner spending"
    },
    {
      program: "United MileagePlus",
      airline: "United", 
      strengths: ["Star Alliance", "Global network", "Flexible awards", "United credit cards"],
      bestValue: "International travel, Star Alliance benefits",
      tipToEarn: "Credit card spend, United purchases"
    }
  ];

  return json({ 
    popularDomesticRoutes, 
    domesticAirlines, 
    budgetTips, 
    seasonalTrends, 
    airportTips, 
    loyaltyPrograms 
  });
}

export default function DomesticFlightsGuide() {
  const { 
    popularDomesticRoutes, 
    domesticAirlines, 
    budgetTips, 
    seasonalTrends, 
    airportTips, 
    loyaltyPrograms 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Domestic Flights Guide 2025
              </h1>
            </div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Your complete guide to flying within the United States. Find cheap domestic flights, 
              compare airlines, and master the art of US air travel with expert tips and strategies.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>500+ US Routes</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>Money-Saving Tips</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Airline Comparisons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Domestic Routes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Most Popular US Domestic Flight Routes
          </h2>
          <p className="text-gray-600 text-lg">
            Top domestic routes with pricing insights, airline options, and booking strategies.
          </p>
        </div>

        <div className="space-y-8">
          {popularDomesticRoutes.map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Route Header */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 rounded-full p-3 mr-4">
                        <Plane className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {route.route}
                        </h3>
                        <p className="text-gray-600">{route.airports}</p>
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
                      <div className="text-sm text-gray-600 mt-2">
                        {route.frequency}
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Airlines & Options</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {route.airlines.map((airline, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {airline}
                            </span>
                          ))}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div><strong>Best days:</strong> {route.bestDays}</div>
                          <div><strong>Peak season:</strong> {route.peakSeason}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Money-Saving Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {route.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="text-green-600 mr-2">💡</div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        to={`/flights/${route.slug}?departDate=${new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}`}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Find Flights: {route.route.split(' to ').join(' → ')} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domestic Airlines Comparison */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Major US Airlines Comparison
            </h2>
            <p className="text-gray-600 text-lg">
              Detailed comparison of major domestic airlines to help you choose the best option.
            </p>
          </div>

          <div className="space-y-8">
            {domesticAirlines.map((airline, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 rounded-full p-3 mr-4">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {airline.airline}
                        </h3>
                        <p className="text-gray-600">{airline.model}</p>
                        <p className="text-sm text-gray-500">
                          {airline.marketShare} market share
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div><strong>Routes:</strong> {airline.routes}</div>
                      <div><strong>Price range:</strong> {airline.tipicalPrice}</div>
                      <div><strong>Best for:</strong> {airline.bestFor}</div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {airline.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">⚠️ Considerations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {airline.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-red-500 rounded-full mr-2 mt-2"></div>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Major Hubs</h4>
                      <div className="flex flex-wrap gap-2">
                        {airline.hubs.map((hub, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {hub}
                          </span>
                        ))}
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
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Domestic Flight Money-Saving Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Expert strategies to save money on domestic flights within the US.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetTips.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seasonal Domestic Flight Trends
            </h2>
            <p className="text-gray-600 text-lg">
              Understanding seasonal patterns helps you time your bookings for maximum savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalTrends.map((season, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {season.season}
                </h3>
                
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-4 ${
                  season.priceLevel === 'High' ? 'bg-red-100 text-red-800' :
                  season.priceLevel === 'Moderate-High' ? 'bg-orange-100 text-orange-800' :
                  season.priceLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {season.priceLevel} Prices
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong>Characteristics:</strong> {season.characteristics}
                  </div>
                  <div>
                    <strong>Best deals:</strong> {season.bestDeals}
                  </div>
                  <div>
                    <strong>Avoid:</strong> {season.avoid}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Savings Tip</div>
                  <div className="text-sm text-blue-700">{season.tipicalSavings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airport Tips */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Major US Airport Navigation Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Insider tips for navigating America's busiest airports efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airportTips.map((airport, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {airport.airport}
                </h3>
                <div className="text-sm text-blue-600 font-medium mb-4">
                  {airport.type}
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Navigation Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {airport.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Best For:</div>
                    <div className="text-sm text-gray-600">{airport.bestFor}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Alternatives:</div>
                    <div className="text-sm text-gray-600">{airport.alternatives}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loyalty Programs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Domestic Airline Loyalty Programs
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the right frequent flyer program to maximize your domestic travel benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loyaltyPrograms.map((program, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {program.program}
                    </h3>
                    <p className="text-gray-600">{program.airline} Airlines</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {program.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Best Value For:</div>
                    <div className="text-sm text-gray-600">{program.bestValue}</div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-green-800 mb-1">💡 Earning Tip</div>
                    <div className="text-sm text-green-700">{program.tipToEarn}</div>
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
              Complete Guide to Domestic Flight Travel in the US 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Understanding Domestic Flight Pricing</h3>
                <p className="text-gray-600 mb-4">
                  Domestic flight prices in the US are influenced by several key factors:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Route competition:</strong> More airlines = lower prices</li>
                  <li>• <strong>Seasonality:</strong> Summer and holidays cost 30-50% more</li>
                  <li>• <strong>Day of week:</strong> Tuesday/Wednesday flights cheapest</li>
                  <li>• <strong>Advance booking:</strong> 1-3 months ahead is optimal</li>
                  <li>• <strong>Time of day:</strong> Early morning and red-eye flights cheaper</li>
                  <li>• <strong>Airport choice:</strong> Secondary airports often 20-40% less</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Domestic vs International Flight Differences</h3>
                <p className="text-gray-600 mb-4">
                  Domestic flights within the US have unique characteristics:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• No passport required (government-issued ID needed)</li>
                  <li>• Shorter booking window (1-3 months vs 2-8 months)</li>
                  <li>• More frequent sales and last-minute deals</li>
                  <li>• Greater airline competition on popular routes</li>
                  <li>• More options for budget and low-cost carriers</li>
                  <li>• Easier to change plans due to flexible policies</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Regional Travel Patterns</h3>
              <p className="text-gray-600 mb-4">
                Understanding US regional travel patterns helps you find better deals:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">East Coast Corridor</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• High business travel demand</li>
                    <li>• Multiple airport options in major cities</li>
                    <li>• Amtrak competition keeps some prices lower</li>
                    <li>• Weather delays common in winter</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">West Coast Routes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tech industry drives premium demand</li>
                    <li>• Alaska Airlines strong presence</li>
                    <li>• Southwest provides competition</li>
                    <li>• Seasonal variations less pronounced</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cross-Country Travel</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Higher prices due to distance</li>
                    <li>• Red-eye flights common and cheaper</li>
                    <li>• Hub connections often required</li>
                    <li>• Premium cabin upgrades more valuable</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Domestic Flight FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">What ID do I need for domestic flights?</h4>
                  <p className="text-gray-600">A government-issued photo ID such as driver's license, state ID, or passport. REAL ID will be required starting May 2025.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How early should I arrive for domestic flights?</h4>
                  <p className="text-gray-600">2 hours for most domestic flights, 1.5 hours for smaller airports. TSA PreCheck members can arrive 1-1.5 hours early.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Are basic economy fares worth it?</h4>
                  <p className="text-gray-600">For short flights with carry-on only, yes. For longer flights or when you need flexibility, regular economy often provides better value.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Which domestic airline is best?</h4>
                  <p className="text-gray-600">Depends on your priorities: Southwest for flexibility, Delta for reliability, JetBlue for amenities, and budget carriers for lowest prices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}