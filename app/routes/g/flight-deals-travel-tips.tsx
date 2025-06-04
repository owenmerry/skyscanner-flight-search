import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { TrendingUp, Calendar, DollarSign, MapPin, Clock, Lightbulb } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Flight Deals & Travel Tips 2025 - Save Money on Every Trip" },
    { 
      name: "description", 
      content: "Find the best flight deals and expert travel tips for 2025. Learn how to save money on airlines, discover travel hacks, and get insider advice for smart travel planning." 
    },
    { name: "keywords", content: "flight deals 2025, travel tips, travel hacks, save money on flights, travel planning, best time to book flights, travel advice, flight booking tips" },
    { property: "og:title", content: "Flight Deals & Travel Tips 2025 - Your Ultimate Travel Resource" },
    { property: "og:description", content: "Discover the latest flight deals and expert travel tips to save money and travel smarter in 2025." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded flight deals and travel tips data
  const currentDeals = [
    {
      route: "New York to London",
      normalPrice: 650,
      dealPrice: 389,
      savings: 40,
      airline: "Virgin Atlantic",
      validUntil: "March 31, 2025",
      travelPeriod: "April - June 2025",
      dealType: "Spring Sale",
      slug: "jfk/to/lhr"
    },
    {
      route: "Los Angeles to Tokyo", 
      normalPrice: 850,
      dealPrice: 499,
      savings: 41,
      airline: "Japan Airlines",
      validUntil: "April 15, 2025",
      travelPeriod: "May - September 2025",
      dealType: "Golden Week Special",
      slug: "lax/to/nrt"
    },
    {
      route: "Miami to Barcelona",
      normalPrice: 580,
      dealPrice: 349,
      savings: 40,
      airline: "Level",
      validUntil: "February 28, 2025",
      travelPeriod: "March - May 2025",
      dealType: "Early Bird",
      slug: "mia/to/bcn"
    },
    {
      route: "Chicago to Dublin",
      normalPrice: 720,
      dealPrice: 429,
      savings: 40,
      airline: "Aer Lingus",
      validUntil: "March 20, 2025",
      travelPeriod: "April - October 2025",
      dealType: "Summer Launch",
      slug: "ord/to/dub"
    },
    {
      route: "Seattle to Amsterdam",
      normalPrice: 680,
      dealPrice: 419,
      savings: 38,
      airline: "KLM",
      validUntil: "April 30, 2025",
      travelPeriod: "May - August 2025",
      dealType: "Tulip Season",
      slug: "sea/to/ams"
    },
    {
      route: "San Francisco to Singapore",
      normalPrice: 950,
      dealPrice: 599,
      savings: 37,
      airline: "Singapore Airlines",
      validUntil: "March 25, 2025", 
      travelPeriod: "June - November 2025",
      dealType: "Premium Sale",
      slug: "sfo/to/sin"
    }
  ];

  const travelTipCategories = [
    {
      category: "Booking Strategy",
      icon: <Calendar className="h-6 w-6" />,
      tips: [
        "Book domestic flights 1-3 months in advance for best prices",
        "International flights: book 2-8 months ahead depending on destination",
        "Tuesday is typically the cheapest day to book flights",
        "Fly on Tuesday, Wednesday, or Saturday for lower fares",
        "Use incognito mode to avoid price tracking cookies",
        "Set up price alerts for routes you're monitoring"
      ]
    },
    {
      category: "Money-Saving Hacks",
      icon: <DollarSign className="h-6 w-6" />,
      tips: [
        "Compare round-trip vs two one-way tickets",
        "Consider flying into nearby airports (within 100 miles)",
        "Book connecting flights instead of direct for savings",
        "Use airline miles and credit card points strategically",
        "Take advantage of error fares when they appear",
        "Book separate tickets for multi-city trips sometimes cheaper"
      ]
    },
    {
      category: "Timing & Seasonality",
      icon: <Clock className="h-6 w-6" />,
      tips: [
        "Shoulder seasons offer 20-40% savings vs peak times",
        "Avoid booking during major holidays and events",
        "Red-eye flights are often 10-30% cheaper",
        "Mid-week departures typically cost less than weekends",
        "Book summer travel by February for best deals",
        "Consider weather patterns when choosing travel dates"
      ]
    },
    {
      category: "Destination Intelligence",
      icon: <MapPin className="h-6 w-6" />,
      tips: [
        "Research visa requirements 3-6 months before travel",
        "Check for local holidays that might affect prices/crowds",
        "Consider currency exchange rates in destination selection",
        "Look into off-the-beaten-path alternatives to popular cities",
        "Factor in local transportation costs when comparing destinations",
        "Research local customs and cultural norms before arrival"
      ]
    }
  ];

  const monthlyTravelGuide = [
    {
      month: "January",
      bestDestinations: ["Thailand", "India", "Myanmar", "Philippines"],
      avoid: ["Northern Europe", "Eastern USA", "Russia"],
      dealOpportunity: "Post-holiday sales and New Year promotions",
      weatherNote: "Dry season in Southeast Asia, winter in Northern Hemisphere"
    },
    {
      month: "February", 
      bestDestinations: ["Japan", "India", "Egypt", "Jordan"],
      avoid: ["Monsoon regions", "Hurricane-prone areas"],
      dealOpportunity: "Pre-spring sales, Valentine's Day packages",
      weatherNote: "Cool and dry in many Asian destinations"
    },
    {
      month: "March",
      bestDestinations: ["India", "Egypt", "Morocco", "Nepal"],
      avoid: ["Rainy season areas", "Hurricane season beginnings"],
      dealOpportunity: "Spring break deals, early summer bookings",
      weatherNote: "Pleasant weather in Middle East and South Asia"
    },
    {
      month: "April",
      bestDestinations: ["Turkey", "Greece", "Spain", "Morocco"],
      avoid: ["Monsoon season areas", "Peak hurricane regions"],
      dealOpportunity: "Easter promotions, summer advance bookings",
      weatherNote: "Perfect weather in Mediterranean region"
    },
    {
      month: "May",
      bestDestinations: ["Turkey", "Croatia", "Spain", "Portugal"],
      avoid: ["Rainy season in tropics", "Pre-monsoon heat"],
      dealOpportunity: "Late spring sales, summer prep deals",
      weatherNote: "Ideal weather in Southern Europe"
    },
    {
      month: "June",
      bestDestinations: ["Scandinavia", "Russia", "Scandinavia", "Eastern Europe"],
      avoid: ["Hurricane-prone areas", "Extreme heat regions"],
      dealOpportunity: "Summer launch sales, family packages",
      weatherNote: "Perfect weather in Northern Europe and Asia"
    }
  ];

  const advancedStrategies = [
    {
      strategy: "Hidden City Ticketing",
      difficulty: "Advanced",
      savings: "20-50%",
      description: "Book a flight with a layover in your actual destination and skip the final leg",
      risks: ["Airline may cancel return ticket", "Only works with one-way tickets", "Cannot check bags"],
      tips: ["Only use occasionally", "Never on return tickets", "Have backup plans"]
    },
    {
      strategy: "Fuel Dumping",
      difficulty: "Expert",
      savings: "30-70%",
      description: "Exploit airline pricing errors by adding segments to reduce total cost",
      risks: ["Complex routing", "May get cancelled", "Time-sensitive"],
      tips: ["Monitor deal forums", "Book quickly", "Have flexible plans"]
    },
    {
      strategy: "Positioning Flights",
      difficulty: "Intermediate", 
      savings: "15-40%",
      description: "Fly to a different city first to access better deals from that hub",
      risks: ["Additional costs", "More complex travel", "Timing issues"],
      tips: ["Calculate total costs", "Consider time value", "Book as separate tickets"]
    },
    {
      strategy: "Airline Alliances",
      difficulty: "Beginner",
      savings: "10-30%",
      description: "Use partner airlines and loyalty programs for better deals and perks",
      risks: ["Limited to alliance partners", "Complex redemption rules"],
      tips: ["Join multiple programs", "Transfer points strategically", "Book award travel early"]
    }
  ];

  const budgetTravelTips = [
    {
      category: "Accommodation",
      tips: [
        "Book hostels or budget hotels in advance",
        "Consider Airbnb for longer stays", 
        "Use hotel comparison sites and apps",
        "Look into house-sitting opportunities",
        "Consider staying slightly outside city centers"
      ]
    },
    {
      category: "Transportation",
      tips: [
        "Use public transportation instead of taxis",
        "Walk or bike when possible",
        "Book trains and buses in advance for discounts",
        "Consider car sharing for rural areas",
        "Use rideshare apps for short distances"
      ]
    },
    {
      category: "Food & Dining",
      tips: [
        "Eat at local markets and street food stalls",
        "Cook your own meals when possible",
        "Avoid tourist restaurant areas",
        "Try lunch specials instead of dinner",
        "Bring snacks for long travel days"
      ]
    },
    {
      category: "Activities",
      tips: [
        "Look for free walking tours and city activities",
        "Visit museums on free admission days",
        "Use city tourism cards for discounts",
        "Explore nature and outdoor activities",
        "Check for student and senior discounts"
      ]
    }
  ];

  return json({ 
    currentDeals, 
    travelTipCategories, 
    monthlyTravelGuide, 
    advancedStrategies, 
    budgetTravelTips 
  });
}

export default function FlightDealsAndTips() {
  const { 
    currentDeals, 
    travelTipCategories, 
    monthlyTravelGuide, 
    advancedStrategies, 
    budgetTravelTips 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flight Deals & Travel Tips 2025
              </h1>
            </div>
            <p className="text-xl text-violet-100 max-w-3xl mx-auto mb-8">
              Your ultimate resource for finding cheap flights and traveling smart. Discover the latest deals, 
              expert tips, and insider strategies to save money on every trip.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>Save Up to 70%</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Updated Daily</span>
              </div>
              <div className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                <span>Expert Strategies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Flight Deals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔥 Hot Flight Deals Right Now
          </h2>
          <p className="text-gray-600 text-lg">
            Limited-time flight deals with significant savings. Book quickly before these offers expire!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDeals.map((deal, index) => (
            <Link 
              key={index} 
              to={`/flights/${deal.slug}?departDate=${new Date(Date.now() + 45*24*60*60*1000).toISOString().split('T')[0]}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-violet-500"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {deal.savings}% OFF
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${deal.dealPrice}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      was ${deal.normalPrice}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {deal.route}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {deal.airline} • {deal.dealType}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>
                    <strong>Travel Period:</strong> {deal.travelPeriod}
                  </div>
                  <div>
                    <strong>Book by:</strong> {deal.validUntil}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="text-violet-600 font-medium hover:text-violet-700">
                    Book this deal →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Travel Tips by Category */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Travel Tips & Strategies
            </h2>
            <p className="text-gray-600 text-lg">
              Proven strategies used by travel experts to save money and travel smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {travelTipCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="text-violet-600 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Travel Guide */}
      <div className="bg-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Time to Travel: Month-by-Month Guide
            </h2>
            <p className="text-gray-600 text-lg">
              Plan your travels around weather patterns, local events, and seasonal deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyTravelGuide.map((month, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {month.month}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">✅ Best Destinations</h4>
                    <div className="flex flex-wrap gap-1">
                      {month.bestDestinations.map((dest, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Avoid</h4>
                    <div className="flex flex-wrap gap-1">
                      {month.avoid.map((dest, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Deal Opportunity</h4>
                    <p className="text-sm text-gray-600">{month.dealOpportunity}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🌤️ Weather Note</h4>
                    <p className="text-sm text-gray-600">{month.weatherNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Strategies */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Flight Booking Strategies
            </h2>
            <p className="text-gray-600 text-lg">
              Advanced techniques used by experienced travelers to find exceptional deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedStrategies.map((strategy, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {strategy.strategy}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        strategy.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        strategy.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        strategy.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {strategy.difficulty}
                      </span>
                      <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs font-bold">
                        Save {strategy.savings}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{strategy.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Risks</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {strategy.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2 mt-2"></div>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">💡 Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {strategy.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                          {tip}
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

      {/* Budget Travel Tips */}
      <div className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Budget Travel Tips: Save Money on Everything
            </h2>
            <p className="text-gray-600 text-lg">
              Comprehensive strategies to minimize costs across all aspects of travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetTravelTips.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
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
              Complete Guide to Smart Travel and Flight Booking in 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Flight Deal Alerts and Monitoring</h3>
                <p className="text-gray-600 mb-4">
                  Stay informed about the best flight deals with these monitoring strategies:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Sign up for airline newsletters and fare alerts</li>
                  <li>• Follow deal-focused social media accounts and blogs</li>
                  <li>• Use flight comparison sites with price alert features</li>
                  <li>• Join travel deal communities and forums</li>
                  <li>• Set up Google Flights price tracking for specific routes</li>
                  <li>• Subscribe to credit card travel portals for exclusive deals</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Travel Rewards and Loyalty Programs</h3>
                <p className="text-gray-600 mb-4">
                  Maximize your travel value through strategic use of rewards programs:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Choose credit cards with valuable travel rewards</li>
                  <li>• Focus on one airline alliance for elite status benefits</li>
                  <li>• Transfer points between partners for maximum value</li>
                  <li>• Book award travel during off-peak times for better availability</li>
                  <li>• Use shopping portals to earn extra miles on purchases</li>
                  <li>• Take advantage of promotion bonuses and double-mile offers</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Travel Planning and Preparation</h3>
              <p className="text-gray-600 mb-4">
                Proper planning ensures smooth travels and can save significant money:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check passport expiration dates (6+ months validity)</li>
                    <li>• Research visa requirements early</li>
                    <li>• Make copies of important documents</li>
                    <li>• Consider Global Entry/TSA PreCheck for US travelers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Health & Safety</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check vaccination requirements</li>
                    <li>• Purchase comprehensive travel insurance</li>
                    <li>• Research local health and safety conditions</li>
                    <li>• Register with your embassy for overseas travel</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Financial Preparation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Notify banks of travel plans</li>
                    <li>• Research currency exchange rates</li>
                    <li>• Set up travel-friendly banking options</li>
                    <li>• Budget for unexpected expenses</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">What's the best day to book flights?</h4>
                  <p className="text-gray-600">Tuesday is traditionally the cheapest day to book, but prices vary. The key is being flexible and comparing across multiple days and booking sites.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How far in advance should I book for the best deals?</h4>
                  <p className="text-gray-600">Domestic flights: 1-3 months ahead. International flights: 2-8 months ahead. Book earlier for peak travel periods and popular destinations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Are flight comparison sites reliable?</h4>
                  <p className="text-gray-600">Yes, but always verify prices on the airline's website before booking. Some comparison sites show outdated prices or don't include all fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Should I book directly with airlines or through third parties?</h4>
                  <p className="text-gray-600">Booking directly with airlines often provides better customer service and flexibility, especially for changes or cancellations. However, third parties sometimes offer better prices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}