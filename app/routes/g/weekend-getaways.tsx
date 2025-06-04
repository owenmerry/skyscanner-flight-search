import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Calendar, Clock, MapPin, Coffee, Camera, Plane } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Weekend Getaways 2025 - Best Short Trip Destinations & Cheap Flights" },
    { 
      name: "description", 
      content: "Discover amazing weekend getaway destinations for 2025. Find cheap flights for 2-4 day trips, city breaks, and short vacations. Perfect escapes within 3 hours flight time." 
    },
    { name: "keywords", content: "weekend getaways, short trips, city breaks, 3 day trips, weekend flights, short vacations, quick getaways, weekend travel deals" },
    { property: "og:title", content: "Weekend Getaways 2025 - Perfect Short Trip Destinations" },
    { property: "og:description", content: "Find the perfect weekend getaway with cheap flights and amazing destinations for 2-4 day trips." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded weekend getaway data
  const weekendDestinations = [
    {
      city: "Las Vegas",
      state: "Nevada",
      country: "USA",
      airport: "LAS",
      flightTime: "1-5 hours from most US cities",
      averagePrice: 180,
      bestFor: "Entertainment & Nightlife",
      highlights: ["World-class shows", "Casinos & gaming", "Fine dining", "Pool parties"],
      quickItinerary: [
        "Day 1: Arrive, explore The Strip, see a show",
        "Day 2: Pool day, shopping, fine dining",
        "Day 3: Brunch and departure"
      ],
      budgetTips: ["Book mid-week for better hotel rates", "Look for show package deals", "Eat at off-Strip locations"],
      fromCities: ["Los Angeles ($89)", "San Francisco ($129)", "Phoenix ($95)", "Seattle ($149)"],
      slug: "lax/to/las"
    },
    {
      city: "Miami",
      state: "Florida", 
      country: "USA",
      airport: "MIA",
      flightTime: "1-4 hours from East Coast",
      averagePrice: 195,
      bestFor: "Beach & Culture",
      highlights: ["South Beach", "Art Deco District", "Cuban cuisine", "Vibrant nightlife"],
      quickItinerary: [
        "Day 1: South Beach, Art Deco walking tour",
        "Day 2: Little Havana, Wynwood Walls art district", 
        "Day 3: Beach day, Lincoln Road shopping"
      ],
      budgetTips: ["Visit during shoulder season", "Use public transportation", "Try authentic Cuban food"],
      fromCities: ["New York ($159)", "Atlanta ($119)", "Chicago ($179)", "Boston ($189)"],
      slug: "jfk/to/mia"
    },
    {
      city: "Nashville",
      state: "Tennessee",
      country: "USA", 
      airport: "BNA",
      flightTime: "1-3 hours from most US cities",
      averagePrice: 165,
      bestFor: "Music & Food",
      highlights: ["Country music scene", "Broadway honky-tonks", "Hot chicken", "Music history"],
      quickItinerary: [
        "Day 1: Broadway district, Country Music Hall of Fame",
        "Day 2: Music Row, Ryman Auditorium tour",
        "Day 3: Brunch, live music venues"
      ],
      budgetTips: ["Many free live music venues", "Try food trucks", "Walk Broadway for free entertainment"],
      fromCities: ["Chicago ($125)", "Atlanta ($95)", "Dallas ($139)", "New York ($169)"],
      slug: "ord/to/bna"
    },
    {
      city: "Montreal",
      state: "Quebec",
      country: "Canada",
      airport: "YUL", 
      flightTime: "1-3 hours from Northeast US",
      averagePrice: 225,
      bestFor: "Culture & Food",
      highlights: ["French culture", "Amazing food scene", "Historic Old Town", "Festivals"],
      quickItinerary: [
        "Day 1: Old Montreal, Notre-Dame Basilica",
        "Day 2: Mount Royal Park, Plateau neighborhood",
        "Day 3: Jean-Talon Market, farewell brunch"
      ],
      budgetTips: ["Favorable exchange rate", "BYOB restaurants save money", "Free walking tours available"],
      fromCities: ["New York ($189)", "Boston ($159)", "Chicago ($219)", "Toronto ($99)"],
      slug: "jfk/to/yul"
    },
    {
      city: "Austin",
      state: "Texas",
      country: "USA",
      airport: "AUS",
      flightTime: "1-4 hours from most US cities", 
      averagePrice: 175,
      bestFor: "Music & Food Trucks",
      highlights: ["Live music everywhere", "Food truck culture", "Craft breweries", "Outdoor activities"],
      quickItinerary: [
        "Day 1: 6th Street, live music venues",
        "Day 2: Food truck tour, brewery hopping",
        "Day 3: Lady Bird Lake, South by Southwest (if timing works)"
      ],
      budgetTips: ["Free live music at many venues", "Food trucks offer great value", "Rent bikes to explore"],
      fromCities: ["Dallas ($89)", "Houston ($79)", "Chicago ($149)", "Los Angeles ($179)"],
      slug: "dfw/to/aus"
    },
    {
      city: "Charleston",
      state: "South Carolina", 
      country: "USA",
      airport: "CHS",
      flightTime: "1-3 hours from Southeast",
      averagePrice: 185,
      bestFor: "History & Southern Charm",
      highlights: ["Historic architecture", "Southern cuisine", "Carriage tours", "Plantations"],
      quickItinerary: [
        "Day 1: Historic district walking tour",
        "Day 2: Plantation visit, waterfront dining",
        "Day 3: Shopping on King Street, farewell meal"
      ],
      budgetTips: ["Free self-guided walking tours", "Happy hour specials", "Visit free historic sites"],
      fromCities: ["Atlanta ($119)", "Charlotte ($89)", "New York ($199)", "Miami ($149)"],
      slug: "atl/to/chs"
    }
  ];

  const internationalShortTrips = [
    {
      city: "London",
      country: "United Kingdom",
      airport: "LHR",
      flightTime: "6-8 hours from US East Coast",
      averagePrice: 450,
      bestFor: "History & Culture",
      highlights: ["Museums", "Royal palaces", "Theater district", "Pubs"],
      idealLength: "3-4 days",
      slug: "jfk/to/lhr"
    },
    {
      city: "Paris", 
      country: "France",
      airport: "CDG",
      flightTime: "7-9 hours from US East Coast",
      averagePrice: 520,
      bestFor: "Romance & Art",
      highlights: ["Eiffel Tower", "Louvre", "Cafes", "Architecture"],
      idealLength: "3-4 days",
      slug: "jfk/to/cdg"
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      airport: "AMS", 
      flightTime: "7-8 hours from US East Coast",
      averagePrice: 425,
      bestFor: "Canals & Culture",
      highlights: ["Canal tours", "Museums", "Bike culture", "Tulips (seasonal)"],
      idealLength: "2-3 days",
      slug: "jfk/to/ams"
    },
    {
      city: "Reykjavik",
      country: "Iceland",
      airport: "KEF",
      flightTime: "5-6 hours from US East Coast", 
      averagePrice: 350,
      bestFor: "Nature & Adventure",
      highlights: ["Northern lights", "Blue Lagoon", "Geysers", "Unique landscapes"],
      idealLength: "3-4 days",
      slug: "jfk/to/kef"
    }
  ];

  const weekendTripTypes = [
    {
      type: "City Breaks",
      icon: <MapPin className="h-6 w-6" />,
      description: "Explore vibrant cities with museums, dining, and nightlife",
      idealFor: ["Culture enthusiasts", "Food lovers", "Urban explorers"],
      examples: ["New York", "Chicago", "San Francisco", "Montreal"],
      tipDuration: "2-3 days perfect"
    },
    {
      type: "Beach Getaways",
      icon: <Coffee className="h-6 w-6" />,
      description: "Relax on beautiful beaches with sun, sand, and water activities", 
      idealFor: ["Relaxation seekers", "Water sports enthusiasts", "Sun worshippers"],
      examples: ["Miami", "San Diego", "Myrtle Beach", "Key West"],
      tipDuration: "2-4 days ideal"
    },
    {
      type: "Adventure Trips",
      icon: <Camera className="h-6 w-6" />,
      description: "Outdoor activities like hiking, skiing, or extreme sports",
      idealFor: ["Adventure seekers", "Nature lovers", "Active travelers"],
      examples: ["Denver", "Salt Lake City", "Portland", "Seattle"],
      tipDuration: "3-4 days recommended"
    },
    {
      type: "Cultural Immersion",
      icon: <Clock className="h-6 w-6" />,
      description: "Experience local culture, food, music, and traditions",
      idealFor: ["Culture buffs", "Food enthusiasts", "Music lovers"],  
      examples: ["New Orleans", "Nashville", "Santa Fe", "Charleston"],
      tipDuration: "2-3 days sufficient"
    }
  ];

  const planningTips = [
    {
      category: "Booking Strategy",
      tips: [
        "Book flights 3-6 weeks in advance for domestic weekend trips",
        "Consider Friday afternoon or Sunday evening departures for better prices", 
        "Use flexible date searches to find the cheapest weekend",
        "Book accommodations early for popular weekend destinations",
        "Look for flight + hotel packages for additional savings"
      ]
    },
    {
      category: "Packing Smart",
      tips: [
        "Travel with carry-on only to save time and money",
        "Pack versatile clothing that can be mixed and matched",
        "Bring comfortable walking shoes and one dressy option",
        "Download offline maps and translation apps before departure",
        "Pack light layers for unpredictable weather"
      ]
    },
    {
      category: "Time Management", 
      tips: [
        "Prioritize 2-3 must-see attractions rather than overpacking itinerary",
        "Book restaurant reservations in advance for popular spots",
        "Consider location when booking hotels to minimize transit time",
        "Allow buffer time for unexpected discoveries and relaxation",
        "Use ride-sharing or public transit for efficient city navigation"
      ]
    },
    {
      category: "Budget Optimization",
      tips: [
        "Look for free walking tours and city activities",
        "Eat lunch at dinner restaurants for lower prices",
        "Use apps like Groupon for activity discounts",
        "Take advantage of happy hour specials",
        "Consider vacation rentals for groups to save on accommodation"
      ]
    }
  ];

  const seasonalGuide = [
    {
      season: "Spring (March-May)",
      bestDestinations: ["Washington DC (cherry blossoms)", "Austin (perfect weather)", "Charleston (mild temps)"],
      avoid: ["Ski destinations", "Hurricane-prone areas"],
      pricingNote: "Moderate prices, good deals before summer surge"
    },
    {
      season: "Summer (June-August)",
      bestDestinations: ["Seattle (dry season)", "Chicago (festivals)", "Montreal (warm weather)"],
      avoid: ["Extremely hot destinations", "Crowded beach towns"],
      pricingNote: "Peak pricing, book well in advance"
    },
    {
      season: "Fall (September-November)", 
      bestDestinations: ["New England (foliage)", "Nashville (comfortable weather)", "San Francisco (clear skies)"],
      avoid: ["Hurricane season areas", "Early winter destinations"],
      pricingNote: "Great deals after summer, comfortable weather"
    },
    {
      season: "Winter (December-February)",
      bestDestinations: ["Miami (escape cold)", "Las Vegas (mild weather)", "New Orleans (fewer crowds)"],
      avoid: ["Cold weather destinations unless for winter sports"],
      pricingNote: "Mixed pricing, great deals except holidays"
    }
  ];

  return json({ 
    weekendDestinations, 
    internationalShortTrips, 
    weekendTripTypes, 
    planningTips, 
    seasonalGuide 
  });
}

export default function WeekendGetaways() {
  const { 
    weekendDestinations, 
    internationalShortTrips, 
    weekendTripTypes, 
    planningTips, 
    seasonalGuide 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Weekend Getaways 2025
              </h1>
            </div>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto mb-8">
              Discover amazing destinations perfect for 2-4 day trips. Find cheap flights for weekend escapes, 
              city breaks, and short vacations that fit your busy schedule.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>2-4 Day Trips</span>
              </div>
              <div className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                <span>Quick Flights</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Perfect Escapes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Weekend Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Best Weekend Destinations in the US
          </h2>
          <p className="text-gray-600 text-lg">
            Perfect destinations for quick 2-4 day getaways with easy flight access.
          </p>
        </div>

        <div className="space-y-8">
          {weekendDestinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Destination Header */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-pink-100 rounded-full p-3 mr-4">
                        <MapPin className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {destination.city}, {destination.state}
                        </h3>
                        <p className="text-gray-600">{destination.airport} Airport</p>
                        <p className="text-sm text-gray-500">{destination.flightTime}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        From ${destination.averagePrice}
                      </div>
                      <div className="text-sm text-gray-500">average flight price</div>
                      <div className="bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full inline-block mt-2">
                        {destination.bestFor}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Sample Flight Prices:</h4>
                      {destination.fromCities.map((city, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          From {city}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Top Highlights</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {destination.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-pink-500 rounded-full mr-2 mt-2"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-semibold text-gray-900 mb-2 mt-4">Budget Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {destination.budgetTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="text-green-600 mr-2">💡</div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Quick 3-Day Itinerary</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {destination.quickItinerary.map((day, idx) => (
                            <li key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <strong>{day.split(':')[0]}:</strong> {day.split(':')[1]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        to={`/flights/${destination.slug}?departDate=${new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]}&returnDate=${new Date(Date.now() + 17*24*60*60*1000).toISOString().split('T')[0]}`}
                        className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Find Weekend Flights to {destination.city} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International Short Trips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              International Weekend Getaways
            </h2>
            <p className="text-gray-600 text-lg">
              Longer flight times but incredible destinations for extended weekends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {internationalShortTrips.map((destination, index) => (
              <Link 
                key={index} 
                to={`/flights/${destination.slug}?departDate=${new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}&returnDate=${new Date(Date.now() + 34*24*60*60*1000).toISOString().split('T')[0]}`}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {destination.city}
                  </h3>
                  <p className="text-gray-600 text-sm">{destination.country}</p>
                  <p className="text-xs text-gray-500">{destination.flightTime}</p>
                </div>

                <div className="mb-4">
                  <div className="text-xl font-bold text-green-600">
                    From ${destination.averagePrice}
                  </div>
                  <div className="text-xs text-gray-500">{destination.idealLength}</div>
                </div>

                <div className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full inline-block mb-3">
                  {destination.bestFor}
                </div>

                <ul className="text-sm text-gray-600 space-y-1">
                  {destination.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-pink-600 font-medium hover:text-pink-700">
                    Find flights →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Weekend Trip Types */}
      <div className="bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Weekend Getaways
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect weekend trip style that matches your interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekendTripTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-pink-600 mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {type.type}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {type.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ideal For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.idealFor.map((person, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 bg-pink-500 rounded-full mr-2 mt-2"></div>
                        {person}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((example, idx) => (
                      <span key={idx} className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-blue-600 font-medium">
                  💡 {type.tipDuration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planning Tips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Weekend Trip Planning Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Expert advice for maximizing your short getaway experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planningTips.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Guide */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Weekend Destinations by Season
            </h2>
            <p className="text-gray-600 text-lg">
              Time your weekend getaways for optimal weather and pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalGuide.map((season, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {season.season}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">✅ Best Destinations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {season.bestDestinations.map((dest, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                          {dest}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-800 mb-2">❌ Avoid</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {season.avoid.map((dest, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2 mt-2"></div>
                          {dest}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">💰 Pricing Note</h4>
                    <p className="text-sm text-blue-700">{season.pricingNote}</p>
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
              Complete Guide to Weekend Getaways and Short Trips 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why Weekend Getaways Are Perfect</h3>
                <p className="text-gray-600 mb-4">
                  Weekend getaways offer the perfect balance of adventure and practicality for busy lifestyles:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Minimal time off work required (or none for 2-day trips)</li>
                  <li>• Lower overall cost compared to week-long vacations</li>
                  <li>• Easy to plan and execute with minimal preparation</li>
                  <li>• Perfect for trying new destinations before longer visits</li>
                  <li>• Ideal for celebrating special occasions or anniversaries</li>
                  <li>• Great way to break routine and recharge quickly</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Maximizing Short Trip Value</h3>
                <p className="text-gray-600 mb-4">
                  Get the most out of your weekend getaway with these strategies:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Choose destinations within 3-4 hours flight time</li>
                  <li>• Book accommodations in central locations</li>
                  <li>• Research must-see attractions in advance</li>
                  <li>• Use travel apps for real-time recommendations</li>
                  <li>• Pack light to avoid check-in baggage delays</li>
                  <li>• Consider extending to Monday for better flight prices</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Weekend Travel FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">How far in advance should I book weekend trips?</h4>
                  <p className="text-gray-600">For domestic weekend trips, 3-6 weeks in advance typically offers the best prices. For international destinations, book 6-12 weeks ahead.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">What's the ideal length for a weekend getaway?</h4>
                  <p className="text-gray-600">2-4 days is perfect for most weekend trips. 2 days for nearby destinations, 3-4 days for farther locations or when you want a more relaxed pace.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Are weekend flights more expensive?</h4>
                  <p className="text-gray-600">Yes, flights departing Friday evening and returning Sunday are typically 10-30% more expensive. Consider Thursday departures or Monday returns for savings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How do I choose between multiple weekend destinations?</h4>
                  <p className="text-gray-600">Consider flight time, total cost, weather, your interests, and what you want to accomplish. Shorter flights leave more time for activities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}