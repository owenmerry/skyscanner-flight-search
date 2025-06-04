import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { FlightSearchForm } from "~/components/g/FlightSearchForm";
import { FlightResults } from "~/components/g/FlightResults";
import { SearchFilters } from "~/components/g/SearchFilters";
import { FlightSkeleton } from "~/components/g/FlightSkeleton";
import { BreadcrumbNavigation } from "~/components/g/BreadcrumbNavigation";

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
  const { from, to } = params;
  const fromCity = data?.fromAirport?.city || from?.toUpperCase();
  const toCity = data?.toAirport?.city || to?.toUpperCase();
  
  return [
    { title: `Flights from ${fromCity} to ${toCity} - Find Cheap Flight Deals` },
    { 
      name: "description", 
      content: `Compare flight prices from ${fromCity} to ${toCity}. Find the best deals on flights with our flight search engine. Book cheap flights today.` 
    },
    { name: "keywords", content: `flights, ${fromCity}, ${toCity}, cheap flights, flight deals, airline tickets` },
    { property: "og:title", content: `Flights from ${fromCity} to ${toCity} - Find Cheap Flight Deals` },
    { property: "og:type", content: "website" },
    { property: "og:description", content: `Compare flight prices from ${fromCity} to ${toCity}. Find the best deals on flights.` },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const { from, to } = params;
  const departDate = searchParams.get("departDate") || new Date().toISOString().split('T')[0];
  const returnDate = searchParams.get("returnDate");
  const passengers = parseInt(searchParams.get("passengers") || "1");
  const sortBy = searchParams.get("sortBy") || "price";
  const maxPrice = searchParams.get("maxPrice");
  const airlines = searchParams.getAll("airlines");
  const stops = searchParams.get("stops");

  if (!from || !to) {
    throw new Response("Missing route parameters", { status: 400 });
  }

  try {
    // Get airport information
    const [fromAirport, toAirport] = await Promise.all([
      getAirportInfo(from.toUpperCase()),
      getAirportInfo(to.toUpperCase())
    ]);

    // Search for flights
    const flights = await searchFlights({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      departDate,
      returnDate,
      passengers,
      sortBy,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      airlines,
      stops: stops ? parseInt(stops) : undefined,
    });

    return json({
      flights,
      fromAirport,
      toAirport,
      searchParams: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        departDate,
        returnDate,
        passengers,
        sortBy,
        maxPrice,
        airlines,
        stops,
      },
      error: undefined,
    });
  } catch (error) {
    console.error("Flight search error:", error);
    return json({
      flights: [],
      fromAirport: { code: from.toUpperCase(), city: from.toUpperCase(), country: "" },
      toAirport: { code: to.toUpperCase(), city: to.toUpperCase(), country: "" },
      searchParams: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        departDate,
        returnDate,
        passengers,
        sortBy,
        maxPrice,
        airlines,
        stops,
      },
      error: "Failed to fetch flight data",
    });
  }
}

// Mock functions - replace with your actual API calls
async function getAirportInfo(code: string) {
  // Replace with actual airport API
  const airportMap: Record<string, { code: string; city: string; country: string }> = {
    LHR: { code: "LHR", city: "London", country: "United Kingdom" },
    JFK: { code: "JFK", city: "New York", country: "United States" },
    LAX: { code: "LAX", city: "Los Angeles", country: "United States" },
    // Add more airports as needed
  };
  
  return airportMap[code] || { code, city: code, country: "" };
}

async function searchFlights(params: any) {
  // Replace with actual flight search API
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  return [
    {
      id: "1",
      airline: "British Airways",
      price: 299,
      currency: "USD",
      departTime: "08:00",
      arriveTime: "10:30",
      duration: "2h 30m",
      stops: 0,
      aircraft: "Boeing 777",
      class: "Economy",
    },
    {
      id: "2",
      airline: "Virgin Atlantic",
      price: 325,
      currency: "USD",
      departTime: "14:15",
      arriveTime: "17:00",
      duration: "2h 45m",
      stops: 1,
      aircraft: "Airbus A350",
      class: "Economy",
    },
  ];
}

export default function FlightsRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Flights", href: "/flights" },
    { 
      label: `${data.fromAirport.city} to ${data.toAirport.city}`, 
      href: `/flights/${data.searchParams.from.toLowerCase()}/to/${data.searchParams.to.toLowerCase()}`,
      current: true 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Flights from {data.fromAirport.city} to {data.toAirport.city}
            </h1>
            <p className="mt-2 text-gray-600">
              Compare prices and find the best flight deals from {data.fromAirport.city} ({data.fromAirport.code}) 
              to {data.toAirport.city} ({data.toAirport.code})
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-6">
            <FlightSearchForm 
              initialValues={data.searchParams}
              fromAirport={data.fromAirport}
              toAirport={data.toAirport}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters 
              flights={data.flights}
              currentFilters={data.searchParams}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <FlightSkeleton />
            ) : (
              <FlightResults 
                flights={data.flights}
                fromAirport={data.fromAirport}
                toAirport={data.toAirport}
              />
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About Flights from {data.fromAirport.city} to {data.toAirport.city}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Flight Information</h3>
                <p className="text-gray-600 mb-4">
                  Find the best flight deals from {data.fromAirport.city} to {data.toAirport.city}. 
                  We compare prices from hundreds of airlines to help you find the cheapest flights available.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Multiple airline options</li>
                  <li>• Direct and connecting flights</li>
                  <li>• Flexible date options</li>
                  <li>• Best price guarantee</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Popular Airlines</h3>
                <p className="text-gray-600 mb-4">
                  Popular airlines serving the {data.fromAirport.city} to {data.toAirport.city} route include:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• British Airways</li>
                  <li>• Virgin Atlantic</li>
                  <li>• American Airlines</li>
                  <li>• Delta Airlines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}