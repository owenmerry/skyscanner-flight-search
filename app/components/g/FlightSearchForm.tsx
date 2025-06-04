import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Calendar, MapPin, Users, ArrowLeftRight } from "lucide-react";

interface Airport {
  code: string;
  city: string;
  country: string;
}

interface FlightSearchFormProps {
  initialValues: {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string | null;
    passengers: number;
    sortBy?: string;
    maxPrice?: string | null;
    airlines?: string[];
    stops?: string | null;
  };
  fromAirport: Airport;
  toAirport: Airport;
}

export function FlightSearchForm({ initialValues, fromAirport, toAirport }: FlightSearchFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: initialValues.from,
    to: initialValues.to,
    departDate: initialValues.departDate,
    returnDate: initialValues.returnDate || "",
    passengers: initialValues.passengers,
    tripType: initialValues.returnDate ? "roundtrip" : "oneway",
  });

  const handleSwapAirports = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    searchParams.set("departDate", formData.departDate);
    if (formData.returnDate && formData.tripType === "roundtrip") {
      searchParams.set("returnDate", formData.returnDate);
    }
    searchParams.set("passengers", formData.passengers.toString());

    const url = `/flights/${formData.from.toLowerCase()}/to/${formData.to.toLowerCase()}?${searchParams.toString()}`;
    navigate(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="oneway"
              checked={formData.tripType === "oneway"}
              onChange={(e) => setFormData(prev => ({ ...prev, tripType: e.target.value, returnDate: "" }))}
              className="mr-2"
            />
            One way
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              checked={formData.tripType === "roundtrip"}
              onChange={(e) => setFormData(prev => ({ ...prev, tripType: e.target.value }))}
              className="mr-2"
            />
            Round trip
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* From */}
          <div className="lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={`${fromAirport.city} (${formData.from})`}
                onChange={(e) => {
                  // You can implement airport search autocomplete here
                  const value = e.target.value.match(/\(([^)]+)\)/)?.[1] || e.target.value;
                  setFormData(prev => ({ ...prev, from: value.toUpperCase() }));
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city or airport"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="hidden lg:flex xl:hidden items-end pb-3">
            <button
              type="button"
              onClick={handleSwapAirports}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Swap airports"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>

          {/* To */}
          <div className="lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={`${toAirport.city} (${formData.to})`}
                onChange={(e) => {
                  const value = e.target.value.match(/\(([^)]+)\)/)?.[1] || e.target.value;
                  setFormData(prev => ({ ...prev, to: value.toUpperCase() }));
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city or airport"
              />
            </div>
          </div>

          {/* Depart Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depart
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.departDate}
                onChange={(e) => setFormData(prev => ({ ...prev, departDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          {formData.tripType === "roundtrip" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                  min={formData.departDate}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={formData.passengers}
                onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Swap Button */}
        <div className="lg:hidden flex justify-center">
          <button
            type="button"
            onClick={handleSwapAirports}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Swap airports</span>
          </button>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search Flights
          </button>
        </div>
      </Form>
    </div>
  );
}