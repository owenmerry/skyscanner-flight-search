import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Plane, Map, Calendar, Users, Clock, Star, TrendingUp, Globe } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Trip Planning & Flight Booking - Plan Your Perfect Journey" },
    { 
      name: "description", 
      content: "Plan your perfect trip with our comprehensive travel guide. Book flights, find destinations, and discover travel inspiration for business trips, vacations, and adventures worldwide." 
    },
    { name: "keywords", content: "trip planning, flight booking, travel destinations, business trips, vacation packages, travel guide, trip ideas, flight deals, travel inspiration" },
    { property: "og:title", content: "Trip Planning & Flight Booking - Your Journey Starts Here" },
    { property: "og:description", content: "Discover amazing destinations and plan your perfect trip. From business travel to exotic adventures, find flights and inspiration for every journey." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Trip categories data
  const tripTypes = [
    {
      name: "Business Travel",
      icon: "💼",
      color: "blue",
      description: "Efficient travel solutions for business professionals",
      features: ["Flexible booking", "Priority support", "Corporate rates", "Easy changes"],
      averagePrice: "$450",
      destinations: ["New York", "London", "Dubai", "Singapore"],
      bookingTips: "Book early for better rates, consider nearby airports"
    },
    {
      name: "Family Vacations", 
      icon: "👨‍👩‍👧‍👦",
      color: "green",
      description: "Create lasting memories with family-friendly destinations",
      features: ["Family packages", "Kid-friendly hotels", "Activities included", "Flexible cancellation"],
      averagePrice: "$380",
      destinations: ["Orlando", "Barcelona", "Tokyo", "Sydney"],
      bookingTips: "Look for family deals, book connecting rooms in advance"
    },
    {
      name: "Solo Adventures",
      icon: "🎒",
      color: "purple",
      description: "Discover the world at your own pace",
      features: ["Single supplements", "Group tours", "Safety resources", "Solo traveler perks"],
      averagePrice: "$520",
      destinations: ["Iceland", "New Zealand", "Thailand", "Portugal"],
      bookingTips: "Consider hostels, join travel groups, research safety"
    },
    {
      name: "Romantic Getaways",
      icon: "💕",
      color: "pink",
      description: "Intimate destinations for couples",
      features: ["Couple packages", "Romantic hotels", "Private experiences", "Special occasions"],
      averagePrice: "$650",
      destinations: ["Paris", "Santorini", "Maldives", "Tuscany"],
      bookingTips: "Book honeymoon packages, request special arrangements"
    },
    {
      name: "Adventure Travel",
      icon: "🏔️",
      color: "orange",
      description: "Thrilling experiences for adventure seekers",
      features: ["Activity packages", "Gear rental", "Expert guides", "Insurance included"],
      averagePrice: "$780",
      destinations: ["Nepal", "Patagonia", "Alaska", "New Zealand"],
      bookingTips: "Book with activity operators, check weather seasons"
    },
    {
      name: "Cultural Tours",
      icon: "🏛️",
      color: "yellow",
      description: "Immerse yourself in local culture and history",
      features: ["Guided tours", "Cultural experiences", "Local cuisine", "Historical sites"],
      averagePrice: "$420",
      destinations: ["Egypt", "India", "Peru", "Greece"],
      bookingTips: "Research cultural etiquette, book guides in advance"
    }
  ];

  const featuredTrips = [
    {
      title: "European Grand Tour",
      duration: "14 days",
      countries: 5,
      cities: ["Paris", "Rome", "Barcelona", "Amsterdam", "Prague"],
      price: 1850,
      highlights: ["High-speed rail passes", "Historic city centers", "Art museums", "Local cuisine"],
      difficulty: "Easy",
      bestTime: "Apr-Oct",
      includes: ["Flights", "Hotels", "Rail passes", "Guided tours"]
    },
    {
      title: "Southeast Asia Discovery", 
      duration: "21 days",
      countries: 4,
      cities: ["Bangkok", "Siem Reap", "Ho Chi Minh", "Bali"],
      price: 1650,
      highlights: ["Ancient temples", "Street food tours", "Tropical beaches", "Cultural immersion"],
      difficulty: "Moderate",
      bestTime: "Nov-Mar",
      includes: ["Flights", "Accommodation", "Local transport", "Activities"]
    },
    {
      title: "African Safari Adventure",
      duration: "10 days", 
      countries: 2,
      cities: ["Nairobi", "Serengeti", "Ngorongoro", "Zanzibar"],
      price: 2850,
      highlights: ["Big Five safari", "Migration viewing", "Beach relaxation", "Cultural villages"],
      difficulty: "Moderate",
      bestTime: "Jun-Sep",
      includes: ["Flights", "Safari lodges", "Game drives", "Meals"]
    },
    {
      title: "South American Highlights",
      duration: "16 days",
      countries: 3, 
      cities: ["Lima", "Cusco", "Buenos Aires", "Rio de Janeiro"],
      price: 2250,
      highlights: ["Machu Picchu", "Tango shows", "Christ the Redeemer", "Amazon rainforest"],
      difficulty: "Challenging",
      bestTime: "Apr-Jun, Sep-Nov",
      includes: ["Flights", "Hotels", "Train to Machu Picchu", "Tours"]
    }
  ];

  const trendingDestinations = [
    { name: "Iceland", growth: "+45%", reason: "Northern Lights season", price: "$425" },
    { name: "Japan", growth: "+38%", reason: "Cherry blossom season", price: "$750" },
    { name: "Portugal", growth: "+32%", reason: "Affordable luxury", price: "$380" },
    { name: "Morocco", growth: "+28%", reason: "Desert experiences", price: "$495" },
    { name: "Costa Rica", growth: "+25%", reason: "Eco-tourism boom", price: "$320" },
    { name: "Georgia", growth: "+42%", reason: "Emerging destination", price: "$450" }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Choose Your Destination",
      description: "Research destinations that match your interests, budget, and travel style",
      tips: ["Consider season and weather", "Check visa requirements", "Research local customs"]
    },
    {
      step: 2,
      title: "Set Your Budget",
      description: "Determine your total budget including flights, accommodation, and activities",
      tips: ["Account for hidden costs", "Compare destination costs", "Set aside emergency funds"]
    },
    {
      step: 3,
      title: "Book Your Flights",
      description: "Find the best flight deals and book your transportation",
      tips: ["Be flexible with dates", "Compare airlines", "Consider layovers vs direct flights"]
    },
    {
      step: 4,
      title: "Plan Your Itinerary",
      description: "Create a balanced itinerary with must-see attractions and free time",
      tips: ["Don't overpack your schedule", "Book popular attractions early", "Leave room for spontaneity"]
    },
    {
      step: 5,
      title: "Prepare for Travel",
      description: "Handle documentation, packing, and final preparations",
      tips: ["Check passport validity", "Get travel insurance", "Notify banks of travel"]
    }
  ];

  return json({ tripTypes, featuredTrips, trendingDestinations, planningSteps });
}

export default function Trips() {
  const { tripTypes, featuredTrips, trendingDestinations, planningSteps } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Plan Your Perfect Trip
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              From business travel to exotic adventures, discover destinations and plan 
              unforgettable journeys with our comprehensive travel planning tools.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>500+ Destinations</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Expert Travel Planning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Type of Trip Are You Planning?
          </h2>
          <p className="text-gray-600 text-lg">
            Choose your travel style and discover tailored recommendations for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripTypes.map((trip, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{trip.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {trip.name}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 text-center">
                {trip.description}
              </p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Key features:</p>
                <div className="space-y-1">
                  {trip.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-600">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Popular destinations:</p>
                <div className="flex flex-wrap gap-1">
                  {trip.destinations.map((dest, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm font-semibold text-blue-600">
                  From {trip.averagePrice}
                </div>
                <Link 
                  to="/g/flights" 
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Trips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Trip Packages
            </h2>
            <p className="text-gray-600 text-lg">
              Carefully curated multi-destination journeys for the ultimate travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredTrips.map((trip, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {trip.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {trip.duration}
                        </div>
                        <div className="flex items-center">
                          <Map className="h-4 w-4 mr-1" />
                          {trip.countries} countries
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${trip.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per person</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Cities included:</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.cities.map((city, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Highlights:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {trip.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-gray-500">Difficulty:</p>
                      <p className="font-medium">{trip.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Best time:</p>
                      <p className="font-medium">{trip.bestTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Includes:</p>
                      <p className="font-medium">{trip.includes.length} items</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Link 
                      to="/g/flights"
                      className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors inline-block"
                    >
                      View Trip Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 mr-2 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Trending Destinations
              </h2>
            </div>
            <p className="text-gray-600 text-lg text-center">
              See where everyone's traveling right now and join the trend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDestinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dest.name}
                  </h3>
                  <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {dest.growth}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {dest.reason}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-blue-600 font-semibold">
                    From {dest.price}
                  </div>
                  <Link 
                    to="/g/flights"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Book now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trip Planning Guide */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Plan Your Perfect Trip
            </h2>
            <p className="text-gray-600 text-lg">
              Follow our expert step-by-step guide to plan an unforgettable journey.
            </p>
          </div>

          <div className="space-y-8">
            {planningSteps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <div className="space-y-1">
                    {step.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Planning Your Trip?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Search for flights to any destination and begin your journey today. 
              Our travel experts are here to help you every step of the way.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/g/flights"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Search Flights
              </Link>
              <Link 
                to="/g/flight-deals-travel-tips"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Travel Tips
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Complete Trip Planning Resource
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Essential Trip Planning Tips</h3>
                <p className="text-gray-600 mb-4">
                  Planning a successful trip requires careful consideration of multiple factors 
                  from budgeting to documentation. Our comprehensive guide helps you navigate 
                  every aspect of travel planning.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Research visa requirements and processing times</li>
                  <li>• Compare flight prices across multiple airlines</li>
                  <li>• Book accommodations in advance for popular destinations</li>
                  <li>• Consider travel insurance for international trips</li>
                  <li>• Check health requirements and vaccinations needed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Smart Booking Strategies</h3>
                <p className="text-gray-600 mb-4">
                  Save money and ensure the best travel experience with these expert 
                  booking strategies and insider tips.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Book flights 6-8 weeks in advance for best deals</li>
                  <li>• Use flexible date searches to find cheaper options</li>
                  <li>• Consider alternative airports near your destination</li>
                  <li>• Sign up for price alerts on your preferred routes</li>
                  <li>• Book Tuesday to Thursday departures for lower fares</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Popular Trip Types by Season</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Spring (Mar-May)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cherry blossom trips to Japan</li>
                    <li>• Mediterranean cruises</li>
                    <li>• Cultural tours in Europe</li>
                    <li>• Wildlife viewing in Africa</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Summer (Jun-Aug)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Beach vacations</li>
                    <li>• Family adventures</li>
                    <li>• European city breaks</li>
                    <li>• Hiking and outdoor activities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fall (Sep-Nov)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Foliage tours</li>
                    <li>• Harvest experiences</li>
                    <li>• Cultural festivals</li>
                    <li>• Shoulder season travel</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Winter (Dec-Feb)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ski and snowboard trips</li>
                    <li>• Tropical escapes</li>
                    <li>• Holiday celebrations</li>
                    <li>• Northern lights viewing</li>
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