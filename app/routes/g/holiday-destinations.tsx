import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Sun, Snowflake, Palmtree, Mountain, Calendar, MapPin } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Holiday Flights 2025 - Vacation Destinations & Travel Deals" },
    { 
      name: "description", 
      content: "Find flights to top holiday destinations for 2025. Book vacation flights to tropical beaches, ski resorts, European cities, and exotic destinations worldwide. Best holiday travel deals!" 
    },
    { name: "keywords", content: "holiday flights, vacation flights, holiday destinations, beach holidays, ski holidays, christmas flights, summer vacation, winter holidays, tropical destinations" },
    { property: "og:title", content: "Holiday Flights 2025 - Book Your Dream Vacation" },
    { property: "og:description", content: "Discover amazing holiday destinations and book flights to your dream vacation. Find deals on beach, city, and adventure holidays." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded holiday destinations data
  const seasons = [
    {
      name: "Summer Holidays (Jun-Aug)",
      icon: "☀️",
      color: "orange",
      destinations: [
        {
          city: "Barcelona",
          country: "Spain",
          airport: "BCN",
          price: 395,
          highlights: ["Beach & City", "Gaudi Architecture", "Vibrant Nightlife"],
          bestFor: "Culture & Beach",
          flightTime: "8h 30m",
          slug: "jfk/to/bcn"
        },
        {
          city: "Santorini",
          country: "Greece", 
          airport: "JTR",
          price: 485,
          highlights: ["Stunning Sunsets", "White Villages", "Crystal Waters"],
          bestFor: "Romance & Relaxation",
          flightTime: "12h 45m",
          slug: "jfk/to/jtr"
        },
        {
          city: "Bali",
          country: "Indonesia",
          airport: "DPS",
          price: 750,
          highlights: ["Tropical Paradise", "Rich Culture", "Affordable Luxury"],
          bestFor: "Exotic Adventure",
          flightTime: "18h 30m",
          slug: "lax/to/dps"
        },
        {
          city: "Dubrovnik",
          country: "Croatia",
          airport: "DBV", 
          price: 420,
          highlights: ["Medieval Walls", "Adriatic Coast", "Game of Thrones"],
          bestFor: "History & Scenery",
          flightTime: "11h 15m",
          slug: "jfk/to/dbv"
        }
      ]
    },
    {
      name: "Winter Holidays (Dec-Feb)",
      icon: "❄️",
      color: "blue",
      destinations: [
        {
          city: "Aspen",
          country: "United States",
          airport: "ASE",
          price: 285,
          highlights: ["World-Class Skiing", "Luxury Resorts", "Mountain Views"],
          bestFor: "Ski & Luxury",
          flightTime: "4h 15m",
          slug: "jfk/to/ase"
        },
        {
          city: "Dubai",
          country: "UAE",
          airport: "DXB",
          price: 650,
          highlights: ["Perfect Weather", "Luxury Shopping", "Desert Adventures"],
          bestFor: "Luxury & Culture",
          flightTime: "12h 30m",
          slug: "jfk/to/dxb"
        },
        {
          city: "Bangkok",
          country: "Thailand",
          airport: "BKK",
          price: 580,
          highlights: ["Street Food", "Temples", "Warm Weather"],
          bestFor: "Culture & Food",
          flightTime: "17h 45m",
          slug: "jfk/to/bkk"
        },
        {
          city: "Cape Town",
          country: "South Africa",
          airport: "CPT",
          price: 890,
          highlights: ["Table Mountain", "Wine Country", "Safari Access"],
          bestFor: "Adventure & Wine",
          flightTime: "15h 20m",
          slug: "jfk/to/cpt"
        }
      ]
    },
    {
      name: "Spring Holidays (Mar-May)",
      icon: "🌸",
      color: "pink",
      destinations: [
        {
          city: "Tokyo",
          country: "Japan",
          airport: "NRT",
          price: 750,
          highlights: ["Cherry Blossoms", "Modern Culture", "Amazing Food"],
          bestFor: "Culture & Nature",
          flightTime: "14h 20m",
          slug: "jfk/to/nrt"
        },
        {
          city: "Amsterdam",
          country: "Netherlands",
          airport: "AMS",
          price: 385,
          highlights: ["Tulip Season", "Canal Cruises", "Art Museums"],
          bestFor: "Culture & Flowers",
          flightTime: "8h 15m",
          slug: "jfk/to/ams"
        },
        {
          city: "Morocco",
          country: "Morocco",
          airport: "CMN",
          price: 495,
          highlights: ["Perfect Weather", "Desert Tours", "Rich Culture"],
          bestFor: "Adventure & Culture",
          flightTime: "7h 45m",
          slug: "jfk/to/cmn"
        },
        {
          city: "Turkey",
          country: "Turkey",
          airport: "IST",
          price: 425,
          highlights: ["Mild Weather", "Historical Sites", "Great Value"],
          bestFor: "History & Value",
          flightTime: "10h 30m",
          slug: "jfk/to/ist"
        }
      ]
    },
    {
      name: "Fall Holidays (Sep-Nov)",
      icon: "🍂",
      color: "amber",
      destinations: [
        {
          city: "New York",
          country: "United States",
          airport: "JFK",
          price: 195,
          highlights: ["Fall Foliage", "Perfect Weather", "Cultural Events"],
          bestFor: "City & Nature",
          flightTime: "5h 30m",
          slug: "lax/to/jfk"
        },
        {
          city: "Munich",
          country: "Germany",
          airport: "MUC",
          price: 445,
          highlights: ["Oktoberfest", "Beautiful Architecture", "Beer Gardens"],
          bestFor: "Culture & Beer",
          flightTime: "9h 45m",
          slug: "jfk/to/muc"
        },
        {
          city: "Nepal",
          country: "Nepal",
          airport: "KTM",
          price: 695,
          highlights: ["Clear Mountain Views", "Perfect Trekking", "Cultural Sites"],
          bestFor: "Adventure & Spirituality",
          flightTime: "16h 20m",
          slug: "jfk/to/ktm"
        },
        {
          city: "India",
          country: "India",
          airport: "DEL",
          price: 620,
          highlights: ["Pleasant Weather", "Festivals", "Golden Triangle"],
          bestFor: "Culture & History",
          flightTime: "14h 50m",
          slug: "jfk/to/del"
        }
      ]
    }
  ];

  const holidayTypes = [
    {
      type: "Beach Holidays",
      icon: <Palmtree className="h-6 w-6" />,
      description: "Relax on pristine beaches with crystal-clear waters",
      destinations: ["Maldives", "Caribbean", "Hawaii", "Seychelles"],
      priceRange: "$400-1200"
    },
    {
      type: "City Breaks",
      icon: <MapPin className="h-6 w-6" />,
      description: "Explore vibrant cities, culture, and urban adventures",
      destinations: ["Paris", "London", "New York", "Tokyo"],
      priceRange: "$300-800"
    },
    {
      type: "Adventure Holidays",
      icon: <Mountain className="h-6 w-6" />,
      description: "Thrilling outdoor activities and extreme sports",
      destinations: ["New Zealand", "Nepal", "Patagonia", "Iceland"],
      priceRange: "$600-1500"
    },
    {
      type: "Ski Holidays",
      icon: <Snowflake className="h-6 w-6" />,
      description: "Hit the slopes at world-renowned ski resorts",
      destinations: ["Alps", "Colorado", "Japan", "Canada"],
      priceRange: "$400-1000"
    }
  ];

  const specialOffers = [
    {
      title: "Christmas & New Year Flights", 
      discount: "Book early and save up to 40%",
      period: "Dec 20 - Jan 5",
      destinations: "Worldwide destinations"
    },
    {
      title: "Summer Vacation Deals",
      discount: "Family packages from $199/person",
      period: "Jun 15 - Aug 31", 
      destinations: "Europe & Mediterranean"
    },
    {
      title: "Easter Holiday Flights",
      discount: "Spring break specials up to 35% off",
      period: "Mar 20 - Apr 15",
      destinations: "Popular family destinations"
    },
    {
      title: "Thanksgiving Travel",
      discount: "Early bird savings up to 50%",
      period: "Nov 20 - Nov 30",
      destinations: "Domestic US routes"
    }
  ];

  return json({ seasons, holidayTypes, specialOffers });
}

export default function HolidayDestinations() {
  const { seasons, holidayTypes, specialOffers } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sun className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Holiday Flights & Destinations 2025
              </h1>
            </div>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
              Discover amazing holiday destinations around the world. From tropical beaches 
              to snowy mountains, find flights to your perfect vacation spot.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Year-Round Destinations</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>200+ Holiday Destinations</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2" />
                <span>Best Holiday Deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Holiday Type
          </h2>
          <p className="text-gray-600 text-lg">
            What kind of holiday experience are you looking for?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {holidayTypes.map((holiday, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-teal-600 mb-4">
                
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {holiday.type}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {holiday.description}
              </p>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
                <div className="flex flex-wrap gap-1">
                  {holiday.destinations.map((dest, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm font-semibold text-teal-600">
                From {holiday.priceRange}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Destinations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Destinations by Season
            </h2>
            <p className="text-gray-600 text-lg">
              Find the perfect time to visit your dream destination.
            </p>
          </div>

          {seasons.map((season, seasonIndex) => (
            <div key={seasonIndex} className="mb-16">
              <div className="flex items-center mb-8">
                <span className="text-3xl mr-3">{season.icon}</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  {season.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {season.destinations.map((dest, index) => (
                  <Link 
                    key={index} 
                    to={`/flights/${dest.slug}?departDate=${new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]}`}
                    className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`bg-${season.color}-100 text-${season.color}-800 text-xs font-bold px-2 py-1 rounded-full`}>
                          {dest.bestFor}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${dest.price}
                          </div>
                          <div className="text-xs text-gray-500">{dest.flightTime}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {dest.city}
                        </h4>
                        <p className="text-gray-600 text-sm">{dest.country}</p>
                        <p className="text-xs text-gray-500">{dest.airport} Airport</p>
                      </div>

                      <div className="space-y-2">
                        {dest.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1 h-1 bg-teal-600 rounded-full mr-2"></div>
                            {highlight}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-teal-600 font-medium hover:text-teal-700">
                          Book holiday flights →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Holiday Offers */}
      <div className="bg-gradient-to-r from-red-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Special Holiday Flight Offers
            </h2>
            <p className="text-gray-600 text-lg">
              Don't miss these limited-time holiday travel deals and seasonal specials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialOffers.map((offer, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <div className="text-red-600 font-bold text-lg mb-3">
                  {offer.discount}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Travel period: {offer.period}</div>
                  <div>Available for: {offer.destinations}</div>
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
              Your Complete Guide to Holiday Travel Planning 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Time to Book Holiday Flights</h3>
                <p className="text-gray-600 mb-4">
                  Timing is crucial when booking holiday flights. Popular destinations and 
                  peak travel periods require advance planning for the best deals.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Summer holidays:</strong> Book 2-3 months in advance</li>
                  <li>• <strong>Christmas & New Year:</strong> Book 4-6 months ahead</li>
                  <li>• <strong>Easter holidays:</strong> Book 6-8 weeks early</li>
                  <li>• <strong>School holidays:</strong> Book as early as possible</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Holiday Travel Tips</h3>
                <p className="text-gray-600 mb-4">
                  Make your holiday travel smooth and enjoyable with these expert recommendations:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check passport expiry dates (6 months validity required)</li>
                  <li>• Research visa requirements for your destination</li>
                  <li>• Consider travel insurance for international trips</li>
                  <li>• Book accommodation early for popular destinations</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Popular Holiday Destinations by Budget</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Budget Holidays (Under $500)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Eastern Europe (Prague, Budapest)</li>
                    <li>• Southeast Asia (Thailand, Vietnam)</li>
                    <li>• Central America (Costa Rica, Guatemala)</li>
                    <li>• Domestic destinations (within US)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Mid-Range Holidays ($500-1000)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Western Europe (Spain, Italy, Greece)</li>
                    <li>• Turkey and Middle East</li>
                    <li>• South America (Peru, Argentina)</li>
                    <li>• East Asia (Japan, South Korea)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Luxury Holidays ($1000+)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Maldives and Seychelles</li>
                    <li>• Australia and New Zealand</li>
                    <li>• Scandinavia and Northern Europe</li>
                    <li>• African Safari destinations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Holiday Travel FAQs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">When should I book my holiday flights?</h4>
                  <p className="text-gray-600">For the best deals, book domestic holidays 1-3 months in advance and international holidays 2-6 months ahead, especially for peak seasons.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">What are the most affordable holiday destinations?</h4>
                  <p className="text-gray-600">Southeast Asia, Eastern Europe, and Central America offer excellent value for money with low-cost flights and affordable accommodations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How can I find cheap holiday flights?</h4>
                  <p className="text-gray-600">Be flexible with dates, consider nearby airports, book in advance, use fare comparison sites, and sign up for price alerts.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">What documents do I need for international holidays?</h4>
                  <p className="text-gray-600">You'll need a valid passport (with 6+ months validity), possible visa, travel insurance, and any required health certificates or vaccinations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}