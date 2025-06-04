import { Link } from "@remix-run/react";
import { MapPin, Clock, DollarSign, TrendingUp, Globe, Shield } from "lucide-react";

export function SEOContent() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Guide to Flight Routes
        </h2>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-6 w-6 text-blue-600 mr-2" />
              Popular Destinations
            </h3>
            <p className="text-gray-600 mb-4">
              Discover the most popular flight routes connecting major cities worldwide. 
              Our comprehensive route guide helps you find flights to top destinations 
              across all continents, from bustling metropolises to exotic getaways.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Over 1,000 popular routes worldwide</li>
              <li>• Direct and connecting flight options</li>
              <li>• Multiple airline partnerships</li>
              <li>• Real-time price comparisons</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-6 w-6 text-green-600 mr-2" />
              Best Price Guarantee
            </h3>
            <p className="text-gray-600 mb-4">
              We compare prices from hundreds of airlines and travel sites to ensure 
              you get the best deal on your flights. Our smart search technology 
              finds the cheapest flights for your chosen route.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Compare 500+ airlines</li>
              <li>• Price alerts and notifications</li>
              <li>• Flexible date options</li>
              <li>• Hidden city and error fare detection</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Flight Route Features
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h4>
              <p className="text-gray-600 text-sm">
                Live flight schedules, delays, and price changes updated every minute.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Price Trends</h4>
              <p className="text-gray-600 text-sm">
                Historical pricing data and predictions to help you book at the best time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Booking</h4>
              <p className="text-gray-600 text-sm">
                Safe and secure booking process with 24/7 customer support.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Flight Routes by Region
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                Transatlantic Routes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/flights/lhr/to/jfk" className="text-blue-600 hover:underline">
                    London to New York
                  </Link>
                  <span className="text-gray-500 ml-2">from $299</span>
                </li>
                <li>
                  <Link to="/flights/cdg/to/jfk" className="text-blue-600 hover:underline">
                    Paris to New York
                  </Link>
                  <span className="text-gray-500 ml-2">from $345</span>
                </li>
                <li>
                  <Link to="/flights/mad/to/mia" className="text-blue-600 hover:underline">
                    Madrid to Miami
                  </Link>
                  <span className="text-gray-500 ml-2">from $289</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="h-5 w-5 text-green-600 mr-2" />
                Asia-Pacific Routes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/flights/lax/to/nrt" className="text-blue-600 hover:underline">
                    Los Angeles to Tokyo
                  </Link>
                  <span className="text-gray-500 ml-2">from $456</span>
                </li>
                <li>
                  <Link to="/flights/syd/to/lhr" className="text-blue-600 hover:underline">
                    Sydney to London
                  </Link>
                  <span className="text-gray-500 ml-2">from $789</span>
                </li>
                <li>
                  <Link to="/flights/sin/to/dxb" className="text-blue-600 hover:underline">
                    Singapore to Dubai
                  </Link>
                  <span className="text-gray-500 ml-2">from $234</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="h-5 w-5 text-red-600 mr-2" />
                European Routes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/flights/lhr/to/cdg" className="text-blue-600 hover:underline">
                    London to Paris
                  </Link>
                  <span className="text-gray-500 ml-2">from $89</span>
                </li>
                <li>
                  <Link to="/flights/mad/to/bcn" className="text-blue-600 hover:underline">
                    Madrid to Barcelona
                  </Link>
                  <span className="text-gray-500 ml-2">from $65</span>
                </li>
                <li>
                  <Link to="/flights/fco/to/ath" className="text-blue-600 hover:underline">
                    Rome to Athens
                  </Link>
                  <span className="text-gray-500 ml-2">from $123</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Book Your Flight?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your journey by selecting a route above or search for flights 
              to your desired destination. Compare prices, find deals, and book 
              your perfect flight today.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Search All Flights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}