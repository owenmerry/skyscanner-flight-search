import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Clock, Zap, AlertTriangle, Plane } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Last Minute Flight Deals - Cheap Same Day & Next Day Flights" },
    { 
      name: "description", 
      content: "Find last-minute flight deals and same-day flights. Book cheap last-minute flights departing today, tomorrow, or within the next 7 days. Limited time offers!" 
    },
    { name: "keywords", content: "last minute flights, same day flights, urgent travel, emergency flights, last minute deals, next day flights, immediate departure" },
    { property: "og:title", content: "Last Minute Flight Deals - Book Today, Fly Today" },
    { property: "og:description", content: "Emergency travel? Find last-minute flight deals with immediate departure. Same day and next day flights available." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Hardcoded last-minute deals data
  const urgentDeals = [
    {
      from: { code: "JFK", city: "New York" },
      to: { code: "BOS", city: "Boston" },
      price: 89,
      originalPrice: 159,
      departure: "Today 6:45 PM",
      arrival: "Today 8:15 PM",
      airline: "JetBlue",
      seatsLeft: 3,
      timeLeft: "4 hours",
      slug: "jfk/to/bos"
    },
    {
      from: { code: "LAX", city: "Los Angeles" },
      to: { code: "SFO", city: "San Francisco" },
      price: 65,
      originalPrice: 125,
      departure: "Tomorrow 7:30 AM",
      arrival: "Tomorrow 9:00 AM",
      airline: "Southwest",
      seatsLeft: 7,
      timeLeft: "18 hours",
      slug: "lax/to/sfo"
    },
    {
      from: { code: "CHI", city: "Chicago" },
      to: { code: "ATL", city: "Atlanta" },
      price: 95,
      originalPrice: 180,
      departure: "Today 9:20 PM",
      arrival: "Today 11:45 PM",
      airline: "Delta",
      seatsLeft: 2,
      timeLeft: "6 hours",
      slug: "ord/to/atl"
    },
    {
      from: { code: "MIA", city: "Miami" },
      to: { code: "NYC", city: "New York" },
      price: 125,
      originalPrice: 220,
      departure: "Tomorrow 6:15 AM",
      arrival: "Tomorrow 9:30 AM",
      airline: "American",
      seatsLeft: 5,
      timeLeft: "16 hours",
      slug: "mia/to/lga"
    },
    {
      from: { code: "DEN", city: "Denver" },
      to: { code: "PHX", city: "Phoenix" },
      price: 78,
      originalPrice: 140,
      departure: "Today 11:30 PM",
      arrival: "Tomorrow 12:45 AM",
      airline: "Frontier",
      seatsLeft: 4,
      timeLeft: "8 hours",
      slug: "den/to/phx"
    },
    {
      from: { code: "SEA", city: "Seattle" },
      to: { code: "PDX", city: "Portland" },
      price: 45,
      originalPrice: 85,
      departure: "Tomorrow 2:15 PM",
      arrival: "Tomorrow 3:30 PM",
      airline: "Alaska",
      seatsLeft: 8,
      timeLeft: "22 hours",
      slug: "sea/to/pdx"
    }
  ];

  const tips = [
    {
      title: "Be Flexible with Airports",
      description: "Consider nearby airports to increase your options and potentially save money.",
      icon: "✈️"
    },
    {
      title: "Pack Light",
      description: "Avoid checked baggage fees by traveling with carry-on only for short trips.",
      icon: "🎒"
    },
    {
      title: "Check Multiple Airlines",
      description: "Budget airlines often have better last-minute availability.",
      icon: "🔍"
    },
    {
      title: "Book Immediately",
      description: "Last-minute deals disappear quickly. Book as soon as you find a good price.",
      icon: "⚡"
    }
  ];

  const reasons = [
    "Business emergencies and urgent meetings",
    "Family emergencies and unexpected events", 
    "Funeral attendance and bereavement travel",
    "Medical appointments and treatments",
    "Spontaneous weekend getaways",
    "Taking advantage of unexpected time off"
  ];

  return json({ urgentDeals, tips, reasons });
}

export default function LastMinuteDeals() {
  const { urgentDeals, tips, reasons } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Last-Minute Flight Deals
              </h1>
            </div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Need to fly today or tomorrow? Find same-day and next-day flight deals 
              with immediate departure. Emergency travel made easy.
            </p>
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-flex items-center font-bold">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Limited seats available - Book now!
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Deals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">
              Departing Today & Tomorrow
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            These flights are departing soon with limited seats available at discounted prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentDeals.map((deal, index) => (
            <Link 
              key={index} 
              to={`/flights/${deal.slug}?departDate=${new Date().toISOString().split('T')[0]}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500 relative overflow-hidden"
            >
              {/* Urgency Badge */}
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {deal.seatsLeft} seats left
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <div>
                      <div className="text-gray-900">{deal.from.city}</div>
                      <div className="text-sm text-gray-500">{deal.from.code}</div>
                    </div>
                    <div className="text-red-600">→</div>
                    <div className="text-right">
                      <div className="text-gray-900">{deal.to.city}</div>
                      <div className="text-sm text-gray-500">{deal.to.code}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${deal.price}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    was ${deal.originalPrice}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    {deal.airline}
                  </div>
                  <div>Depart: {deal.departure}</div>
                  <div>Arrive: {deal.arrival}</div>
                </div>

                <div className="bg-red-50 text-red-800 text-sm p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <strong>Booking closes in {deal.timeLeft}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="text-red-600 font-medium hover:text-red-700">
                    Book immediately →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Last-Minute Booking Tips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Last-Minute Flight Booking Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Make the most of your urgent travel needs with these expert strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Travel Scenarios */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              When Do People Need Last-Minute Flights?
            </h2>
            <p className="text-gray-600 text-lg">
              Life happens unexpectedly. We understand urgent travel needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{reason}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help Finding Emergency Flights?
              </h3>
              <p className="text-gray-600 mb-4">
                Our 24/7 customer service team can help you find available flights 
                for urgent travel situations.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                Get Urgent Travel Help
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Guide to Last-Minute Flight Booking
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">How to Find Last-Minute Flight Deals</h3>
                <p className="text-gray-600 mb-4">
                  Last-minute flights can be expensive, but deals do exist if you know where to look. 
                  Airlines sometimes offer discounted seats to fill planes close to departure.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check multiple booking sites and airline websites</li>
                  <li>• Be flexible with departure times and nearby airports</li>
                  <li>• Consider connecting flights instead of direct routes</li>
                  <li>• Sign up for last-minute deal alerts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">What to Expect with Same-Day Flights</h3>
                <p className="text-gray-600 mb-4">
                  Same-day flight booking requires quick decision-making and flexibility. 
                  Here's what you need to know:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Arrive at airport at least 2 hours early for domestic flights</li>
                  <li>• Have your ID ready and check airline requirements</li>
                  <li>• Pack only carry-on to avoid baggage delays</li>
                  <li>• Expect limited seat selection options</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Emergency Travel Documentation</h3>
              <p className="text-gray-600 mb-4">
                For urgent travel, make sure you have proper documentation ready:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Domestic Travel</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Valid government-issued photo ID</li>
                    <li>• Driver's license or state ID</li>
                    <li>• Passport (always accepted)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">International Travel</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Valid passport</li>
                    <li>• Visa if required for destination</li>
                    <li>• Return or onward ticket proof</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emergency Documents</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Death certificate (bereavement fares)</li>
                    <li>• Medical documentation</li>
                    <li>• Employer letter (business emergencies)</li>
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