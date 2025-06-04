import { useState } from "react";
import { Plane, Clock, Users, Wifi, Utensils } from "lucide-react";

interface Flight {
  id: string;
  airline: string;
  price: number;
  currency: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  aircraft: string;
  class: string;
}

interface Airport {
  code: string;
  city: string;
  country: string;
}

interface FlightResultsProps {
  flights: Flight[];
  fromAirport: Airport;
  toAirport: Airport;
  error?: string | undefined;
}

export function FlightResults({ flights, fromAirport, toAirport, error }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState("price");

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <Plane className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to fetch flight data
        </h3>
        <p className="text-gray-600">
          {error}. Please try again later or modify your search criteria.
        </p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Plane className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No flights found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or dates to find more options.
        </p>
      </div>
    );
  }

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      case "departure":
        return a.departTime.localeCompare(b.departTime);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {flights.length} flights found
            </h2>
            <p className="text-gray-600">
              {fromAirport.city} → {toAirport.city}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="departure">Departure Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            fromAirport={fromAirport}
            toAirport={toAirport}
          />
        ))}
      </div>
    </div>
  );
}

interface FlightCardProps {
  flight: Flight;
  fromAirport: Airport;
  toAirport: Airport;
}

function FlightCard({ flight, fromAirport, toAirport }: FlightCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Airline & Aircraft */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{flight.airline}</div>
              <div className="text-sm text-gray-500">{flight.aircraft}</div>
            </div>
          </div>

          {/* Flight Times */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {flight.departTime}
                </div>
                <div className="text-sm text-gray-500">
                  {fromAirport.code}
                </div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      {flight.duration}
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {flight.arriveTime}
                </div>
                <div className="text-sm text-gray-500">
                  {toAirport.code}
                </div>
              </div>
            </div>
          </div>

          {/* Price & Book */}
          <div className="text-center lg:text-right">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {flight.currency === 'USD' ? '$' : flight.currency}{flight.price}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              per person
            </div>
            <button className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Select Flight
            </button>
          </div>
        </div>

        {/* Details Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>

        {/* Flight Details */}
        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Flight Info</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Class: {flight.class}</div>
                  <div>Aircraft: {flight.aircraft}</div>
                  <div>Duration: {flight.duration}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    WiFi
                  </div>
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-1" />
                    Meal
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Baggage</h4>
                <div className="text-sm text-gray-600">
                  <div>Carry-on: Included</div>
                  <div>Checked: 1 × 23kg</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}