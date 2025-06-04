import { Link, useSearchParams } from "@remix-run/react";
import { MapPin, Clock, Plane, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";

interface Airport {
  code: string;
  city: string;
  country: string;
  continent: string;
}

interface Route {
  id: string;
  from: Airport;
  to: Airport;
  priceFrom: number;
  currency: string;
  popularity: number;
  airlines: string[];
  flightTime: string;
  frequency: string;
}

interface PopularRoutesProps {
  routes: Route[];
  showFilters?: boolean;
  currentContinent?: string | null;
}

export function PopularRoutes({ routes, showFilters = false, currentContinent }: PopularRoutesProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'popularity' | 'price' | 'alphabetical'>('popularity');
  
  const continents = ['Europe', 'North America', 'Asia', 'South America', 'Africa', 'Oceania'];

  const handleContinentFilter = (continent: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (continent) {
      newParams.set('continent', continent);
    } else {
      newParams.delete('continent');
    }
    setSearchParams(newParams);
  };

  const sortedRoutes = [...routes].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.priceFrom - b.priceFrom;
      case 'alphabetical':
        return a.from.city.localeCompare(b.from.city);
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Popular Flight Routes
          </h2>
          <p className="text-gray-600">
            {routes.length} routes found
            {currentContinent && ` in ${currentContinent}`}
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">Most Popular</option>
                <option value="price">Lowest Price</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>

            {/* Continent Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={currentContinent || ''}
                onChange={(e) => handleContinentFilter(e.target.value || null)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Continents</option>
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRoutes.map((route) => (
          <Link
            key={route.id}
            to={`/flights/${route.from.code.toLowerCase()}/to/${route.to.code.toLowerCase()}`}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-300"
          >
            <div className="p-6">
              {/* Route Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {route.from.city} → {route.to.city}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    {route.popularity}%
                  </span>
                </div>
              </div>

              {/* Airport Codes */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{route.from.code}</div>
                  <div className="text-sm text-gray-600">{route.from.country}</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-500 transform rotate-90" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{route.to.code}</div>
                  <div className="text-sm text-gray-600">{route.to.country}</div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Flight time:</span>
                  </div>
                  <span className="font-medium">{route.flightTime}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{route.frequency}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Airlines:</span>
                  <span className="font-medium text-right">
                    {route.airlines.slice(0, 2).join(', ')}
                    {route.airlines.length > 2 && ` +${route.airlines.length - 2} more`}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-600">From</span>
                  <div className="text-2xl font-bold text-green-600">
                    ${route.priceFrom}
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-50 group-hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    View Flights
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all routes.
          </p>
        </div>
      )}
    </div>
  );
}