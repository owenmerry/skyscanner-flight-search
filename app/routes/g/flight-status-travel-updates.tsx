import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { AlertTriangle, Clock, CloudRain, Plane, Info, Shield } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Flight Status & Travel Updates 2025 - Real-Time Flight Information" },
    { 
      name: "description", 
      content: "Check real-time flight status, delays, cancellations, and travel updates. Get weather alerts, airport information, and know your passenger rights for disrupted flights." 
    },
    { name: "keywords", content: "flight status, flight delays, flight cancellations, travel updates, weather delays, passenger rights, flight tracking, airport delays" },
    { property: "og:title", content: "Flight Status & Travel Updates - Stay Informed" },
    { property: "og:description", content: "Real-time flight information, delay alerts, and essential travel updates to keep your journey on track." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded flight status and travel update data
  const commonDelayReasons = [
    {
      reason: "Weather",
      percentage: "35%",
      description: "Thunderstorms, snow, fog, and severe weather conditions",
      prevention: "Book early morning flights, avoid storm-prone seasons",
      passengerRights: "No compensation required, but airline should provide accommodation for overnight delays",
      seasonalPattern: "Summer thunderstorms, winter snow/ice"
    },
    {
      reason: "Air Traffic Control",
      percentage: "25%", 
      description: "Airport congestion, air traffic management, runway restrictions",
      prevention: "Choose less congested airports, avoid peak travel times",
      passengerRights: "Generally no compensation, considered extraordinary circumstances",
      seasonalPattern: "Higher during summer travel season"
    },
    {
      reason: "Aircraft/Equipment Issues",
      percentage: "20%",
      description: "Mechanical problems, maintenance requirements, aircraft availability",
      prevention: "Fly with airlines that have newer fleets, book direct flights",
      passengerRights: "EU261 compensation for EU flights, varies by airline for US domestic",
      seasonalPattern: "More common with older aircraft in extreme weather"
    },
    {
      reason: "Crew Issues",
      percentage: "12%",
      description: "Crew scheduling, flight time limits, crew illness or unavailability",
      prevention: "Avoid last flights of the day, book with well-staffed airlines",
      passengerRights: "Airline responsibility, may be eligible for compensation",
      seasonalPattern: "Peak during holidays when crew scheduling is strained"
    },
    {
      reason: "Airport Operations",
      percentage: "8%",
      description: "Ground equipment failures, gate availability, baggage system issues",
      prevention: "Allow extra connection time, choose airports with good operations",
      passengerRights: "Airline should provide updates and assistance",
      seasonalPattern: "Higher during peak travel periods"
    }
  ];

  const passengerRights = [
    {
      region: "United States",
      regulations: "No federal law requiring compensation for delays",
      compensationRules: [
        "Tarmac delays over 3 hours (domestic) or 4 hours (international): Right to deplane",
        "Involuntary bumping: 200-400% of ticket price up to $1,550",
        "Baggage delays: Airlines set their own policies",
        "Flight cancellations: No guaranteed compensation, but airlines often provide vouchers"
      ],
      tips: [
        "Check airline's Customer Service Plan",
        "Document all expenses during delays",
        "Ask for meal vouchers and hotel accommodation",
        "Know the difference between controllable and uncontrollable delays"
      ]
    },
    {
      region: "European Union (EU261)",
      regulations: "Strong passenger protection under EU Regulation 261/2004",
      compensationRules: [
        "Short flights (<1,500km): €250 for delays over 3 hours",
        "Medium flights (1,500-3,500km): €400 for delays over 3 hours", 
        "Long flights (>3,500km): €600 for delays over 4 hours",
        "Cancellations: Same compensation plus full refund or rebooking",
        "Denied boarding: Same compensation plus full refund or rebooking"
      ],
      tips: [
        "Applies to flights departing EU or arriving EU on EU airline",
        "No compensation for extraordinary circumstances (weather, strikes)",
        "Keep all receipts for meals and accommodation",
        "Airlines must provide care regardless of compensation eligibility"
      ]
    },
    {
      region: "Canada",
      regulations: "Air Passenger Protection Regulations (APPR)",
      compensationRules: [
        "Small airlines: $125-1,000 CAD depending on delay length",
        "Large airlines: $400-1,000 CAD for delays within airline control",
        "Flight cancellations: Rebooking or refunds plus compensation",
        "Denied boarding: Up to $2,400 CAD compensation"
      ],
      tips: [
        "Compensation varies by airline size and delay cause",
        "Airlines must provide meals, accommodation, and transportation",
        "File complaints with Canadian Transportation Agency if needed",
        "Different rules for within-airline-control vs outside-airline-control"
      ]
    }
  ];

  const weatherImpactGuide = [
    {
      weatherType: "Thunderstorms",
      impactLevel: "High",
      affectedRegions: "Southeast US, Midwest, Texas",
      peakSeason: "April-September",
      typicalDuration: "2-6 hours",
      prevention: [
        "Book morning flights before afternoon storms",
        "Avoid connecting through storm-prone hubs",
        "Monitor weather forecasts 24-48 hours ahead",
        "Consider flexible tickets during storm season"
      ],
      hubsAffected: ["Atlanta", "Dallas", "Chicago", "Houston", "Miami"]
    },
    {
      weatherType: "Winter Storms",
      impactLevel: "Very High",
      affectedRegions: "Northeast, Midwest, Mountain West",
      peakSeason: "December-March",
      typicalDuration: "6-24 hours",
      prevention: [
        "Build extra buffer time for winter travel",
        "Consider southern routing during winter",
        "Pack essentials in carry-on",
        "Book first flights of the day"
      ],
      hubsAffected: ["New York", "Boston", "Chicago", "Denver", "Minneapolis"]
    },
    {
      weatherType: "Fog",
      impactLevel: "Medium-High", 
      affectedRegions: "San Francisco, Pacific Northwest, Northeast",
      peakSeason: "Fall, Winter, Early Spring",
      typicalDuration: "2-8 hours",
      prevention: [
        "Avoid early morning arrivals in fog-prone areas",
        "Book later afternoon flights",
        "Consider alternate airports",
        "Monitor local weather patterns"
      ],
      hubsAffected: ["San Francisco", "Seattle", "Boston", "Portland"]
    },
    {
      weatherType: "High Winds",
      impactLevel: "Medium",
      affectedRegions: "Mountain areas, coastal regions",
      peakSeason: "Spring, Fall",
      typicalDuration: "3-12 hours",
      prevention: [
        "Larger aircraft handle wind better",
        "Avoid small regional airports in windy conditions",
        "Check crosswind limits for your aircraft type",
        "Consider ground transportation alternatives"
      ],
      hubsAffected: ["Denver", "Salt Lake City", "Las Vegas", "Phoenix"]
    }
  ];

  const flightTrackingTips = [
    {
      category: "Best Flight Tracking Apps",
      recommendations: [
        "FlightAware: Comprehensive tracking with weather overlays",
        "Flightradar24: Real-time aircraft positions and routes",
        "FlightStats: Historical data and delay predictions",
        "Airline apps: Push notifications and rebooking options",
        "Google Flights: Basic tracking with price alerts",
        "TripIt: Itinerary management with automatic updates"
      ]
    },
    {
      category: "What to Monitor",
      recommendations: [
        "Departure and arrival times (updated in real-time)",
        "Gate changes and terminal information",
        "Aircraft type and registration",
        "Weather conditions at origin and destination",
        "Air traffic control delays",
        "Previous flight performance on same route"
      ]
    },
    {
      category: "When to Start Tracking",
      recommendations: [
        "24 hours before: Check for schedule changes",
        "6 hours before: Monitor weather developments",  
        "2 hours before: Final status check and gate info",
        "During travel: Track connecting flights",
        "For others: Family/friends picking you up",
        "Seasonal: During storm season or holidays"
      ]
    },
    {
      category: "Pro Tracking Tips",
      recommendations: [
        "Set up multiple alerts for important flights",
        "Track the inbound aircraft's journey",
        "Monitor alternate flights on same route",
        "Check historical on-time performance",
        "Follow airline social media for mass disruptions",
        "Have backup flight options ready"
      ]
    }
  ];

  const airportStatusInfo = [
    {
      airport: "Hartsfield-Jackson Atlanta (ATL)",
      commonIssues: ["Thunderstorms", "Heavy traffic", "Ground stops"],
      busySeason: "Summer thunderstorm season",
      bestTimes: "Early morning (before 7 AM)",
      alternatives: "Limited - consider Birmingham (BHM) for some destinations",
      statusSources: ["@ATLairport", "FAA System Operations Center"]
    },
    {
      airport: "Los Angeles (LAX)",
      commonIssues: ["Marine layer fog", "High traffic volume", "Terminal delays"],
      busySeason: "Year-round high volume",
      bestTimes: "Mid-morning (9-11 AM)",
      alternatives: "Burbank (BUR), Long Beach (LGB), Orange County (SNA)",
      statusSources: ["@flyLAXairport", "SoCal TRACON"]
    },
    {
      airport: "Chicago O'Hare (ORD)",
      commonIssues: ["Winter weather", "Wind delays", "Traffic management"],
      busySeason: "November-March (winter weather)",
      bestTimes: "Early morning, avoid 3-7 PM rush",
      alternatives: "Midway (MDW), Milwaukee (MKE) for some routes",
      statusSources: ["@fly2ohare", "Chicago TRACON"]
    },
    {
      airport: "New York Area (JFK/LGA/EWR)",
      commonIssues: ["Air traffic control", "Weather", "Slot restrictions"],
      busySeason: "Summer (thunderstorms), Winter (snow/ice)",
      bestTimes: "Early morning before ATC restrictions",
      alternatives: "Consider all three airports, Westchester (HPN)",
      statusSources: ["@JFKairport", "@LGAairport", "@EWRairport"]
    },
    {
      airport: "Denver (DEN)",
      commonIssues: ["Winter storms", "Wind", "High altitude weather"],
      busySeason: "October-April (winter weather)",
      bestTimes: "Afternoon after morning weather clears",
      alternatives: "Colorado Springs (COS) for southern Colorado",
      statusSources: ["@DENairport", "Denver TRACON"]
    },
    {
      airport: "San Francisco (SFO)",
      commonIssues: ["Marine fog", "Runway restrictions", "Pacific weather"],
      busySeason: "July-October (fog season)",
      bestTimes: "Late morning after fog lifts (11 AM-2 PM)",
      alternatives: "Oakland (OAK), San Jose (SJC)",
      statusSources: ["@flySFO", "NorCal TRACON"]
    }
  ];

  return json({ 
    commonDelayReasons, 
    passengerRights, 
    weatherImpactGuide, 
    flightTrackingTips, 
    airportStatusInfo 
  });
}

export default function FlightStatus() {
  const { 
    commonDelayReasons, 
    passengerRights, 
    weatherImpactGuide, 
    flightTrackingTips, 
    airportStatusInfo 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Flight Status & Travel Updates 2025
              </h1>
            </div>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Stay informed with real-time flight status, delay information, weather updates, 
              and know your passenger rights when flights are disrupted. Be prepared for every journey.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Real-Time Updates</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Passenger Rights</span>
              </div>
              <div className="flex items-center">
                <CloudRain className="h-5 w-5 mr-2" />
                <span>Weather Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Delay Reasons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Common Flight Delay Reasons & What You Can Do
          </h2>
          <p className="text-gray-600 text-lg">
            Understanding why flights get delayed helps you prepare and know your rights.
          </p>
        </div>

        <div className="space-y-6">
          {commonDelayReasons.map((delay, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 rounded-full p-3 mr-4">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {delay.reason}
                        </h3>
                        <div className="text-2xl font-bold text-orange-600">
                          {delay.percentage}
                        </div>
                        <div className="text-sm text-gray-500">of all delays</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 text-sm mb-4">{delay.description}</p>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">Prevention Tips</h4>
                        <p className="text-green-700 text-sm">{delay.prevention}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
                        <p className="text-blue-700 text-sm mb-4">{delay.passengerRights}</p>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">Seasonal Pattern</h4>
                        <p className="text-gray-600 text-sm">{delay.seasonalPattern}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passenger Rights */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Know Your Passenger Rights
            </h2>
            <p className="text-gray-600 text-lg">
              Passenger rights vary significantly by region. Know what you're entitled to when flights are disrupted.
            </p>
          </div>

          <div className="space-y-8">
            {passengerRights.map((region, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {region.region}
                    </h3>
                    <p className="text-gray-600">{region.regulations}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Compensation Rules</h4>
                    <ul className="space-y-2">
                      {region.compensationRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Expert Tips</h4>
                    <ul className="space-y-2">
                      {region.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <div className="text-green-600 mr-2">💡</div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Impact Guide */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Weather Impact on Flight Operations
            </h2>
            <p className="text-gray-600 text-lg">
              Understanding how different weather patterns affect flights helps you plan better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherImpactGuide.map((weather, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <CloudRain className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {weather.weatherType}
                    </h3>
                    <div className={`text-sm font-bold px-2 py-1 rounded-full inline-block mt-1 ${
                      weather.impactLevel === 'Very High' ? 'bg-red-100 text-red-800' :
                      weather.impactLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      weather.impactLevel === 'Medium-High' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {weather.impactLevel} Impact
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong>Affected Regions:</strong> {weather.affectedRegions}
                  </div>
                  <div>
                    <strong>Peak Season:</strong> {weather.peakSeason}
                  </div>
                  <div>
                    <strong>Typical Duration:</strong> {weather.typicalDuration}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Prevention Tips</h4>
                  <ul className="space-y-1">
                    {weather.prevention.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Major Hubs Affected</h4>
                  <div className="flex flex-wrap gap-1">
                    {weather.hubsAffected.slice(0, 3).map((hub, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flight Tracking Tips */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flight Tracking Pro Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Master flight tracking to stay ahead of delays and disruptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flightTrackingTips.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Airport Status Information */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Major Airport Status Guide
            </h2>
            <p className="text-gray-600 text-lg">
              Know the common issues and best strategies for major US airports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airportStatusInfo.map((airport, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Plane className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {airport.airport}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Common Issues</h4>
                    <div className="flex flex-wrap gap-1">
                      {airport.commonIssues.map((issue, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenging Season</h4>
                    <p className="text-sm text-gray-600">{airport.busySeason}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best Travel Times</h4>
                    <p className="text-sm text-green-700">{airport.bestTimes}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Alternatives</h4>
                    <p className="text-sm text-gray-600">{airport.alternatives}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Status Sources</h4>
                    <div className="flex flex-wrap gap-1">
                      {airport.statusSources.map((source, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {source}
                        </span>
                      ))}
                    </div>
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
              Complete Guide to Flight Status and Travel Disruptions 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">When to Check Flight Status</h3>
                <p className="text-gray-600 mb-4">
                  Timing is crucial when monitoring flight status for potential disruptions:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>24 hours before:</strong> Initial check for schedule changes</li>
                  <li>• <strong>12 hours before:</strong> Weather monitoring begins</li>
                  <li>• <strong>6 hours before:</strong> Serious disruption assessment</li>
                  <li>• <strong>3 hours before:</strong> Final status confirmation</li>
                  <li>• <strong>2 hours before:</strong> Gate and terminal verification</li>
                  <li>• <strong>During travel:</strong> Continuous monitoring for connecting flights</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">What Airlines Must Provide</h3>
                <p className="text-gray-600 mb-4">
                  While compensation varies by region, airlines generally must provide:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Timely and accurate information about delays/cancellations</li>
                  <li>• Rebooking on next available flight at no extra cost</li>
                  <li>• Meal vouchers for delays over 3-4 hours</li>
                  <li>• Hotel accommodation for overnight delays (when controllable)</li>
                  <li>• Ground transportation to/from hotel</li>
                  <li>• Refund option if you choose not to continue travel</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Emergency Preparedness for Flight Disruptions</h3>
              <p className="text-gray-600 mb-4">
                Be prepared for flight disruptions with these emergency strategies:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Before You Travel</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Download multiple airline and tracking apps</li>
                    <li>• Save customer service numbers to your phone</li>
                    <li>• Research alternate flights on same route</li>
                    <li>• Consider flexible tickets for important trips</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">During Disruptions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Call airline while standing in line</li>
                    <li>• Use social media for faster response</li>
                    <li>• Document all expenses and conversations</li>
                    <li>• Be polite but persistent with staff</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recovery Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep all receipts for reimbursement</li>
                    <li>• File complaints within time limits</li>
                    <li>• Know your credit card travel protections</li>
                    <li>• Follow up on compensation claims</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Flight Disruption FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">What's the difference between a delay and cancellation?</h4>
                  <p className="text-gray-600">A delay means the flight will still operate but later than scheduled. A cancellation means the flight won't operate at all and you'll need rebooking.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Am I entitled to compensation for weather delays?</h4>
                  <p className="text-gray-600">In most cases, no. Weather is considered an "extraordinary circumstance" and airlines aren't required to provide compensation, though they should still provide care (meals, accommodation).</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Should I buy travel insurance for flight disruptions?</h4>
                  <p className="text-gray-600">Travel insurance can help with non-refundable expenses when flights are cancelled, especially for expensive trips or during high-risk travel periods.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How do I file a complaint about airline service?</h4>
                  <p className="text-gray-600">Start with the airline's customer service. In the US, you can file with DOT if unsatisfied. EU passengers can contact national enforcement bodies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}