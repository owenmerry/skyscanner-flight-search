import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { Filter, X } from "lucide-react";

interface Flight {
  id: string;
  airline: string;
  price: number;
  currency: string;
  stops: number;
}

interface SearchFiltersProps {
  flights: Flight[];
  currentFilters: {
    maxPrice?: string | null;
    airlines?: string[];
    stops?: string | null;
    sortBy?: string;
  };
}

export function SearchFilters({ flights, currentFilters }: SearchFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract unique airlines from flights
  const airlines = Array.from(new Set(flights.map(f => f.airline))).sort();
  
  // Calculate price range
  const prices = flights.map(f => f.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const updateFilter = (key: string, value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value === null || value === "") {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    
    setSearchParams(newSearchParams);
  };

  const toggleAirlineFilter = (airline: string) => {
    const currentAirlines = searchParams.getAll("airlines");
    let newAirlines: string[];
    
    if (currentAirlines.includes(airline)) {
      newAirlines = currentAirlines.filter(a => a !== airline);
    } else {
      newAirlines = [...currentAirlines, airline];
    }
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("airlines");
    newAirlines.forEach(a => newSearchParams.append("airlines", a));
    
    setSearchParams(newSearchParams);
  };

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("maxPrice");
    newSearchParams.delete("airlines");
    newSearchParams.delete("stops");
    setSearchParams(newSearchParams);
  };

  const hasActiveFilters = currentFilters.maxPrice || 
                          (currentFilters.airlines && currentFilters.airlines.length > 0) || 
                          currentFilters.stops;

  if (flights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              {isCollapsed ? <Filter className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isCollapsed ? 'hidden' : 'block'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Maximum Price
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={currentFilters.maxPrice || maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${minPrice}</span>
                <span className="font-medium text-gray-900">
                  ${currentFilters.maxPrice || maxPrice}
                </span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Stops */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stops
            </label>
            <div className="space-y-2">
              {[
                { value: "", label: "Any number of stops" },
                { value: "0", label: "Direct flights only" },
                { value: "1", label: "1 stop or fewer" },
                { value: "2", label: "2 stops or fewer" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="stops"
                    value={option.value}
                    checked={currentFilters.stops === option.value || (!currentFilters.stops && option.value === "")}
                    onChange={(e) => updateFilter("stops", e.target.value || null)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Airlines */}
          {airlines.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Airlines
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {airlines.map((airline) => {
                  const flightCount = flights.filter(f => f.airline === airline).length;
                  const isChecked = currentFilters.airlines?.includes(airline) || false;
                  
                  return (
                    <label key={airline} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAirlineFilter(airline)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{airline}</span>
                      </div>
                      <span className="text-xs text-gray-500">({flightCount})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sort by
            </label>
            <select
              value={currentFilters.sortBy || "price"}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="departure">Departure Time</option>
              <option value="arrival">Arrival Time</option>
              <option value="airline">Airline</option>
            </select>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}