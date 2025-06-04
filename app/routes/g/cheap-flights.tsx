import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { DollarSign, Percent, Calendar, AlertCircle, Star } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cheap Flights 2025 - Find the Best Flight Deals & Discounts" },
    { 
      name: "description", 
      content: "Find cheap flights and flight deals for 2025. Compare prices from 500+ airlines and save up to 60% on your next trip. Book budget flights today!" 
    },
    { name: "keywords", content: "cheap flights, flight deals, discount flights, budget airlines, low cost flights, flight discounts, airfare deals" },
    { property: "og:title", content: "Cheap Flights 2025 - Save Up to 60% on Flight Deals" },
    { property: "og:description", content: "Find the cheapest flights and best deals. Compare 500+ airlines and save money on your next trip." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded cheap flight deals data
  const todaysDeals = [
    {
      from: { code: "LAX", city: "Los Angeles" },
      to: { code: "LAS", city: "Las Vegas" },
      price: 45,
      originalPrice: 89,
      discount: 49,
      dates: "Mar 15-22",
      airline: "Southwest",
      slug: "lax/to/las"
    },
    {
      from: { code: "NYC", city: "New York" },
      to: { code: "MIA", city: "Miami" },
      price: 78,
      originalPrice: 156,
      discount: 50,
      dates: "Apr 10-17",
      airline: "JetBlue",
      slug: "lga/to/mia"
    },
    {
      from: { code: "CHI", city: "Chicago" },
      to: { code: "DEN", city: "Denver" },
      price: 89,
      originalPrice: 145,
      discount: 39,
      dates: "May 8-15",
      airline: "United",
      slug: "ord/to/den"
    },
    {
      from: { code: "LHR", city: "London" },
      to: { code: "BCN", city: "Barcelona" },
      price: 42,
      originalPrice: 98,
      discount: 57,
      dates: "Jun 12-19",
      airline: "Ryanair",
      slug: "lhr/to/bcn"
    },
    {
      from: { code: "BKK", city: "Bangkok" },
      to: { code: "SIN", city: "Singapore" },
      price: 65,
      originalPrice: 120,
      discount: 46,
      dates: "Jul 5-12",
      airline: "AirAsia",
      slug: "bkk/to/sin"
    },
    {
      from: { code: "SYD", city: "Sydney" },
      to: { code: "MEL", city: "Melbourne" },
      price: 55,
      originalPrice: 95,
      discount: 42,
      dates: "Aug 20-27",
      airline: "Jetstar",
      slug: "syd/to/mel"
    }
  ];

  const budgetAirlines = [
    { name: "Southwest Airlines", routes: "150+ US routes", savings: "Up to 40%" },
    { name: "Ryanair", routes: "200+ European routes", savings: "Up to 60%" },
    { name: "AirAsia", routes: "120+ Asian routes", savings: "Up to 50%" },
    { name: "EasyJet", routes: "180+ European routes", savings: "Up to 45%" },
    { name: "Spirit Airlines", routes: "75+ US routes", savings: "Up to 55%" },
    { name: "Jetstar", routes: "85+ Pacific routes", savings: "Up to 48%" },
  ];

  const savingsTips = [
    {
      title: "Book in Advance",
      description: "Book domestic flights 1-3 months ahead, international flights 2-8 months ahead",
      savings: "Up to 40%"
    },
    {
      title: "Flexible Dates",
      description: "Be flexible with your travel dates to find the cheapest fares",
      savings: "Up to 30%"
    },
    {
      title: "Midweek Travel",
      description: "Fly on Tuesday, Wednesday, or Saturday for lower prices",
      savings: "Up to 25%"
    },
    {
      title: "Budget Airlines",
      description: "Consider low-cost carriers for short to medium-haul flights",
      savings: "Up to 60%"
    }
  ];

  return json({ todaysDeals, budgetAirlines, savingsTips });
}

export default function CheapFlights() {
  const { todaysDeals, budgetAirlines, savingsTips } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cheap Flights & Best Flight Deals
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Find the cheapest flights and save up to 60% on your next trip. 
              Compare prices from over 500 airlines and booking sites instantly.
            </p>
            <div className="mt-8 flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                <span>Save up to 60%</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Flexible Dates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Flight Deals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">
              Today's Best Flight Deals
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Limited-time offers on popular routes. These deals won't last long!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysDeals.map((deal, index) => (
            <Link 
              key={index} 
              to={`/flights/${deal.slug}?departDate=${new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {deal.discount}% OFF
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${deal.price}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ${deal.originalPrice}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <div>
                      <div className="text-gray-900">{deal.from.city}</div>
                      <div className="text-sm text-gray-500">{deal.from.code}</div>
                    </div>
                    <div className="text-green-600">→</div>
                    <div className="text-right">
                      <div className="text-gray-900">{deal.to.city}</div>
                      <div className="text-sm text-gray-500">{deal.to.code}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>Travel dates: {deal.dates}</div>
                  <div>Airline: {deal.airline}</div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-green-600 font-medium hover:text-green-700">
                    Book this deal →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget Airlines Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Budget Airlines for Cheap Flights
            </h2>
            <p className="text-gray-600 text-lg">
              These low-cost carriers offer the best value for money on popular routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetAirlines.map((airline, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {airline.name}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>{airline.routes}</div>
                  <div className="font-semibold text-green-600">{airline.savings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Money-Saving Tips */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Find Cheap Flights: Money-Saving Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Follow these expert tips to save money on your next flight booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {savingsTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full mr-4 mt-1 flex-shrink-0">
                    {tip.savings}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600">
                      {tip.description}
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
              Your Complete Guide to Finding Cheap Flights in 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Time to Book Cheap Flights</h3>
                <p className="text-gray-600 mb-4">
                  The key to finding cheap flights is timing your booking correctly. 
                  For domestic flights, book 1-3 months in advance. For international flights, 
                  book 2-8 months ahead for the best deals.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tuesday and Wednesday are typically the cheapest days to fly</li>
                  <li>• Avoid booking during peak seasons and holidays</li>
                  <li>• Use flexible date searches to find better prices</li>
                  <li>• Clear your browser cookies before booking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Budget Airlines vs Full-Service Carriers</h3>
                <p className="text-gray-600 mb-4">
                  Budget airlines can offer significant savings, but it's important to understand 
                  what's included in the base fare and what costs extra.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Compare total costs including baggage fees</li>
                  <li>• Check seat selection and meal policies</li>
                  <li>• Consider airport locations and transfer costs</li>
                  <li>• Read cancellation and change policies carefully</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">What is the cheapest day to book flights?</h4>
                  <p className="text-gray-600">Tuesday is generally considered the cheapest day to book flights, as airlines often release deals on Monday evening.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How far in advance should I book to get cheap flights?</h4>
                  <p className="text-gray-600">For domestic flights, book 1-3 months ahead. For international flights, 2-8 months in advance typically offers the best prices.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Are budget airlines safe?</h4>
                  <p className="text-gray-600">Yes, budget airlines follow the same safety regulations as full-service carriers. They save money through operational efficiency, not safety compromises.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}