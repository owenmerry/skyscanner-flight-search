import { Link } from "@remix-run/react";
import { MapPin, Globe, ArrowRight } from "lucide-react";

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

interface RoutesByContinentProps {
  routesByContinent: Record<string, Route[]>;
  selectedContinent?: string | null;
}

const continentInfo = {
  "Europe": {
    description: "Explore Europe's diverse destinations with flights connecting major cities across the continent.",
    color: "blue",
    icon: "🏰"
  },
  "North America": {
    description: "Discover popular routes across North America, from coast to coast.",
    color: "green", 
    icon: "🗽"
  },
  "Asia": {
    description: "Connect to Asia's bustling cities and exotic destinations.",
    color: "red",
    icon: "🏮"
  },
  "South America": {
    description: "Explore the vibrant cultures and landscapes of South America.",
    color: "yellow",
    icon: "🌎"
  },
  "Africa": {
    description: "Experience the diverse destinations across the African continent.",
    color: "orange",
    icon: "🦁"
  },
  "Oceania": {
    description: "Discover routes to Australia, New Zealand and Pacific islands.",
    color: "teal",
    icon: "🏄‍♂️"
  }
};

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
    accent: "bg-blue-600"
  },
  green: {
    bg: "bg-green-50", 
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:bg-green-100",
    accent: "bg-green-600"
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200", 
    text: "text-red-700",
    hover: "hover:bg-red-100",
    accent: "bg-red-600"
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700", 
    hover: "hover:bg-yellow-100",
    accent: "bg-yellow-600"
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    hover: "hover:bg-orange-100", 
    accent: "bg-orange-600"
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    hover: "hover:bg-teal-100",
    accent: "bg-teal-600"
  }
};

export function RoutesByContinent({ routesByContinent, selectedContinent }: RoutesByContinentProps) {
  if (selectedContinent) {
    const routes = routesByContinent[selectedContinent] || [];
    const info = continentInfo[selectedContinent as keyof typeof continentInfo];
    
    return (
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {info?.icon} {selectedContinent} Routes
            </h2>
            <p className="text-gray-600 mt-1">{info?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <Link
              key={route.id}
              to={`/flights/${route.from.code.toLowerCase()}/to/${route.to.code.toLowerCase()}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {route.from.city} → {route.to.city}
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{route.from.code} - {route.to.code}</span>
                <span className="font-semibold text-green-600">
                  From ${route.priceFrom}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Routes by Continent
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse popular flight routes organized by continent. Find flights to your 
          favorite destinations or discover new places to explore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(routesByContinent).map(([continent, routes]) => {
          const info = continentInfo[continent as keyof typeof continentInfo];
          const colors = colorClasses[info?.color as keyof typeof colorClasses] || colorClasses.blue;
          
          return (
            <div key={continent} className={`${colors.bg} ${colors.border} border rounded-lg p-6 transition-all hover:shadow-md`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`${colors.accent} text-white rounded-full w-10 h-10 flex items-center justify-center text-lg`}>
                  {info?.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${colors.text}`}>
                    {continent}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {routes.length} popular routes
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {info?.description}
              </p>

              {/* Top 3 Routes Preview */}
              <div className="space-y-3 mb-6">
                {routes.slice(0, 3).map((route) => (
                  <Link
                    key={route.id}
                    to={`/flights/${route.from.code.toLowerCase()}/to/${route.to.code.toLowerCase()}`}
                    className="group flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        {route.from.city} → {route.to.city}
                      </div>
                      <div className="text-xs text-gray-500">
                        {route.from.code} - {route.to.code}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        ${route.priceFrom}
                      </div>
                      <div className="text-xs text-gray-500">
                        from
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Link */}
              <Link
                to={`/routes?continent=${encodeURIComponent(continent)}`}
                className={`block w-full text-center py-3 ${colors.text} ${colors.hover} font-semibold rounded-lg transition-colors border border-transparent hover:border-current`}
              >
                View All {continent} Routes
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}