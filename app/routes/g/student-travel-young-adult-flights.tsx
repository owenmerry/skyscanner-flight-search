import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { GraduationCap, DollarSign, Calendar, MapPin, Backpack, Users } from "lucide-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Student Travel 2025 - Cheap Student Flights & Young Adult Travel Deals" },
    { 
      name: "description", 
      content: "Find cheap student flights and young adult travel deals for 2025. Student discounts, budget travel tips, gap year travel, study abroad flights, and backpacking guides." 
    },
    { name: "keywords", content: "student flights, student travel, young adult travel, student discounts, cheap flights students, study abroad flights, gap year travel, backpacking flights" },
    { property: "og:title", content: "Student Travel 2025 - Cheap Flights for Students & Young Adults" },
    { property: "og:description", content: "Discover student flight discounts, budget travel tips, and affordable destinations perfect for young travelers." },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  // Hardcoded student travel data
  const studentDiscounts = [
    {
      provider: "StudentUniverse",
      discountRange: "Up to $150 off flights",
      specialFeatures: ["Exclusive student fares", "Flexible booking", "24/7 student support"],
      eligibility: "Students 18-25, valid student ID required",
      destinations: "Worldwide",
      additionalPerks: ["Hotel discounts", "Car rental deals", "Travel insurance discounts"],
      howToUse: "Sign up with student email, verify enrollment status"
    },
    {
      provider: "STA Travel (now Student Universe)",
      discountRange: "Student-only fares",
      specialFeatures: ["Group booking discounts", "Study abroad packages", "Gap year planning"],
      eligibility: "Full-time students, under 26",
      destinations: "200+ countries",
      additionalPerks: ["Youth hostels", "Eurail passes", "Travel gear discounts"],
      howToUse: "Upload enrollment verification document"
    },
    {
      provider: "ISIC (International Student Identity Card)",
      discountRange: "Varies by airline (5-15%)",
      specialFeatures: ["Global recognition", "Offline discounts too", "Valid for 1 year"],
      eligibility: "Full-time students 12+",
      destinations: "Worldwide acceptance",
      additionalPerks: ["Museum discounts", "Transport discounts", "Emergency assistance"],
      howToUse: "Purchase ISIC card ($25), show at booking"
    },
    {
      provider: "Youth Airline Programs",
      discountRange: "10-25% off regular fares",
      specialFeatures: ["Age-based discounts", "Flexible tickets", "Last-minute availability"],
      eligibility: "Usually 18-25 or under 26",
      destinations: "Varies by airline",
      additionalPerks: ["Extra baggage allowance", "Change fee waivers", "Standby privileges"],
      howToUse: "Join airline youth programs directly"
    }
  ];

  const budgetDestinations = [
    {
      destination: "Southeast Asia",
      averageCost: "$800-1200 flight + $20-30/day",
      topCountries: ["Thailand", "Vietnam", "Cambodia", "Laos", "Philippines"],
      whyPopular: "Incredible value for money, backpacker infrastructure, amazing food",
      bestDuration: "2-6 months",
      peakSeason: "November-March (dry season)",
      budgetTips: [
        "Start in Bangkok for best flight connections",
        "Use local buses and trains for transport",
        "Stay in hostels or guesthouses ($5-15/night)",
        "Eat street food and local restaurants"
      ],
      studentPerks: ["Teaching English opportunities", "Volunteer programs", "Cultural exchanges"]
    },
    {
      destination: "Eastern Europe",
      averageCost: "$400-800 flight + $25-40/day",
      topCountries: ["Czech Republic", "Hungary", "Poland", "Slovakia", "Romania"],
      whyPopular: "Rich history, beautiful cities, affordable prices, great beer",
      bestDuration: "1-3 months",
      peakSeason: "May-September",
      budgetTips: [
        "Use budget airlines within Europe",
        "Stay in hostels in city centers",
        "Take advantage of free walking tours",
        "Cook your own meals occasionally"
      ],
      studentPerks: ["Extensive student discounts", "Language exchange programs", "Study abroad options"]
    },
    {
      destination: "Central America",
      averageCost: "$300-600 flight + $30-50/day",
      topCountries: ["Guatemala", "Costa Rica", "Nicaragua", "Honduras", "Belize"],
      whyPopular: "Adventure activities, Spanish immersion, natural beauty",
      bestDuration: "1-4 months",
      peakSeason: "December-April (dry season)",
      budgetTips: [
        "Overland travel between countries",
        "Learn Spanish for better prices",
        "Mix of hostels and local guesthouses",
        "Take local buses (chicken buses)"
      ],
      studentPerks: ["Spanish language schools", "Volunteer opportunities", "Eco-tourism programs"]
    },
    {
      destination: "South America",
      averageCost: "$600-1000 flight + $25-45/day",
      topCountries: ["Peru", "Bolivia", "Ecuador", "Colombia", "Argentina"],
      whyPopular: "Diverse cultures, stunning landscapes, adventure travel",
      bestDuration: "2-6 months",
      peakSeason: "May-September (dry season in Andes)",
      budgetTips: [
        "Fly into Lima or Bogota for best prices",
        "Use overnight buses to save on accommodation",
        "Eat at markets and local comedores",
        "Consider working holiday visas"
      ],
      studentPerks: ["Spanish immersion programs", "Archaeological sites student discounts", "Research opportunities"]
    },
    {
      destination: "India & Nepal",
      averageCost: "$700-1100 flight + $15-25/day",
      topCountries: ["India", "Nepal", "Bhutan", "Sri Lanka"],
      whyPopular: "Spiritual experiences, incredible diversity, ultra-budget friendly",
      bestDuration: "1-6 months",
      peakSeason: "October-March (cooler weather)",
      budgetTips: [
        "Book flights to Delhi or Mumbai",
        "Use trains for long-distance travel",
        "Negotiate everything (except trains)",
        "Eat vegetarian local food"
      ],
      studentPerks: ["Yoga teacher training", "Meditation retreats", "Cultural study programs"]
    },
    {
      destination: "Morocco & North Africa",
      averageCost: "$400-700 flight + $20-35/day",
      topCountries: ["Morocco", "Tunisia", "Egypt"],
      whyPopular: "Exotic culture, great food, desert adventures, proximity to Europe",
      bestDuration: "2 weeks-3 months",
      peakSeason: "March-May, September-November",
      budgetTips: [
        "Fly into Casablanca or Marrakech",
        "Stay in riads or hostels",
        "Haggle in souks and for transport",
        "Take CTM buses between cities"
      ],
      studentPerks: ["Arabic language programs", "Islamic studies", "Archaeological sites access"]
    }
  ];

  const travelTips = [
    {
      category: "Booking Strategy",
      tips: [
        "Use student travel agencies for exclusive deals",
        "Book flights 2-3 months in advance for best student fares",
        "Consider one-way tickets for flexibility",
        "Look into open-jaw tickets (fly into one city, out of another)",
        "Use flexible date searches - saving $100+ is worth adjusting plans",
        "Follow budget airline social media for flash sales"
      ]
    },
    {
      category: "Money Management",
      tips: [
        "Open a no-foreign-fee debit/credit card before traveling",
        "Notify banks of travel plans to avoid card blocks",
        "Keep emergency cash in multiple currencies",
        "Use apps like Revolut or Wise for better exchange rates",
        "Set up automatic savings for travel fund",
        "Track spending with apps like Trail Wallet or Trabee Pocket"
      ]
    },
    {
      category: "Safety & Health",
      tips: [
        "Get comprehensive travel insurance (under $50/month)",
        "Register with your embassy in countries with safety concerns",
        "Get required vaccinations 4-6 weeks before travel",
        "Keep digital and physical copies of important documents",
        "Share itinerary with family/friends regularly",
        "Research local scams and safety issues"
      ]
    },
    {
      category: "Packing & Logistics",
      tips: [
        "Pack light - aim for carry-on only if possible",
        "Invest in quality backpack and comfortable walking shoes",
        "Bring universal adapter and portable charger",
        "Pack first aid kit with prescription medications",
        "Leave room in luggage for souvenirs",
        "Consider shipping items home if overweight"
      ]
    }
  ];

  const workTravelPrograms = [
    {
      program: "Working Holiday Visas",
      countries: ["Australia", "New Zealand", "Canada", "UK", "Ireland"],
      ageLimit: "18-30 (varies by country)",
      duration: "1-2 years",
      benefits: ["Work legally", "Extended stay", "Cultural immersion", "Earn while traveling"],
      requirements: ["Valid passport", "Proof of funds", "Health insurance", "Clean criminal record"],
      popularJobs: ["Hospitality", "Farm work", "Retail", "Teaching English", "Office work"],
      applicationTips: "Apply early as spots are limited; some countries have quotas"
    },
    {
      program: "Teaching English Abroad",
      countries: ["China", "Japan", "South Korea", "Vietnam", "Thailand"],
      ageLimit: "Usually 21+",
      duration: "6 months - 2 years",
      benefits: ["Steady income", "Housing provided", "Cultural exchange", "Resume builder"],
      requirements: ["Bachelor's degree", "TEFL certification", "Native English speaker", "Clean background"],
      popularJobs: ["Private schools", "Language centers", "Public schools", "Online tutoring"],
      applicationTips: "Get TEFL certified before applying; research visa requirements carefully"
    },
    {
      program: "Au Pair Programs",
      countries: ["USA", "Germany", "France", "Netherlands", "Australia"],
      ageLimit: "18-26 (varies)",
      duration: "6-12 months",
      benefits: ["Free room and board", "Weekly stipend", "Language immersion", "Family experience"],
      requirements: ["Childcare experience", "Driver's license", "First aid training", "Background check"],
      popularJobs: ["Childcare", "Light housework", "English tutoring", "Cultural exchange"],
      applicationTips: "Start application 3-6 months early; be honest about experience level"
    },
    {
      program: "Volunteer Programs",
      countries: ["Worldwide - focus on developing countries"],
      ageLimit: "18+ (no upper limit)",
      duration: "2 weeks - 2 years",
      benefits: ["Meaningful impact", "Cultural immersion", "Skill development", "Network building"],
      requirements: ["Varies by program", "Background check", "Health clearance", "Program fees"],
      popularJobs: ["Education", "Healthcare", "Conservation", "Community development"],
      applicationTips: "Research organizations carefully; beware of 'voluntourism' programs"
    }
  ];

  const packingGuide = [
    {
      category: "Essential Documents",
      items: [
        "Passport (valid 6+ months)",
        "Visa documents and copies",
        "Travel insurance policy",
        "Student ID and ISIC card",
        "Driver's license (international permit if needed)",
        "Emergency contact information"
      ],
      tips: "Keep digital copies in cloud storage and physical copies separate from originals"
    },
    {
      category: "Technology",
      items: [
        "Smartphone with international plan or local SIM",
        "Universal power adapter",
        "Portable charger/power bank",
        "Laptop/tablet if needed for work/study",
        "Headphones for long flights",
        "Camera (or rely on smartphone)"
      ],
      tips: "Download offline maps, translation apps, and entertainment before traveling"
    },
    {
      category: "Clothing Essentials",
      items: [
        "Versatile layers for different climates",
        "Comfortable walking shoes + sandals",
        "Quick-dry underwear and socks",
        "One nice outfit for special occasions",
        "Rain jacket/poncho",
        "Hat and sunglasses"
      ],
      tips: "Pack for laundry every 1-2 weeks; choose colors that don't show dirt easily"
    },
    {
      category: "Health & Safety",
      items: [
        "Prescription medications (extra supply)",
        "Basic first aid kit",
        "Sunscreen and insect repellent",
        "Water purification tablets/filter",
        "Personal hygiene items",
        "Contact lenses/glasses + backup"
      ],
      tips: "Pack medications in original bottles; bring doctor's note for prescriptions"
    }
  ];

  const budgetBreakdown = [
    {
      destination: "Southeast Asia Backpacking (3 months)",
      totalCost: "$3,500-5,000",
      breakdown: {
        "Flights": "$800-1,200",
        "Accommodation": "$450-900 ($5-10/night)",
        "Food": "$540-900 ($6-10/day)",
        "Transport": "$300-600",
        "Activities": "$450-750",
        "Miscellaneous": "$400-650"
      },
      savingTips: ["Stay in dorm rooms", "Eat street food", "Use local transport", "Book activities through hostels"]
    },
    {
      destination: "Europe Interrail (2 months)",
      totalCost: "$4,000-6,500",
      breakdown: {
        "Flights": "$400-800",
        "Rail Pass": "$500-800",
        "Accommodation": "$1,200-2,400 ($20-40/night)",
        "Food": "$1,200-1,800 ($20-30/day)",
        "Activities": "$600-1,200",
        "Miscellaneous": "$500-800"
      },
      savingTips: ["Cook in hostel kitchens", "Free walking tours", "Student discounts everywhere", "Travel shoulder season"]
    },
    {
      destination: "Central America Adventure (6 weeks)",
      totalCost: "$2,200-3,500",
      breakdown: {
        "Flights": "$400-600",
        "Accommodation": "$420-630 ($10-15/night)",
        "Food": "$420-630 ($10-15/day)",
        "Transport": "$300-500",
        "Activities": "$400-700",
        "Miscellaneous": "$260-435"
      },
      savingTips: ["Take chicken buses", "Stay in local guesthouses", "Learn Spanish", "Group tours for activities"]
    }
  ];

  return json({ 
    studentDiscounts, 
    budgetDestinations, 
    travelTips, 
    workTravelPrograms, 
    packingGuide, 
    budgetBreakdown 
  });
}

export default function StudentTravel() {
  const { 
    studentDiscounts, 
    budgetDestinations, 
    travelTips, 
    workTravelPrograms, 
    packingGuide, 
    budgetBreakdown 
  } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Student Travel Guide 2025
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Your complete guide to affordable student travel. Find student flight discounts, 
              budget destinations, gap year planning, and everything you need for amazing adventures on a student budget.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>Student Discounts</span>
              </div>
              <div className="flex items-center">
                <Backpack className="h-5 w-5 mr-2" />
                <span>Budget Travel Tips</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Top Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Flight Discounts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Student Flight Discounts & Programs
          </h2>
          <p className="text-gray-600 text-lg">
            Save money on flights with these exclusive student travel programs and discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {studentDiscounts.map((discount, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {discount.provider}
                  </h3>
                  <div className="text-lg font-bold text-green-600">
                    {discount.discountRange}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {discount.specialFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 bg-purple-500 rounded-full mr-2 mt-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Eligibility:</strong> {discount.eligibility}
                  </div>
                  <div>
                    <strong>Coverage:</strong> {discount.destinations}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Additional Perks</h4>
                  <div className="flex flex-wrap gap-1">
                    {discount.additionalPerks.map((perk, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-blue-800 mb-1">How to Use</div>
                  <div className="text-sm text-blue-700">{discount.howToUse}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Destinations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Budget Destinations for Students
            </h2>
            <p className="text-gray-600 text-lg">
              Amazing destinations where your student budget goes far and adventures await.
            </p>
          </div>

          <div className="space-y-8">
            {budgetDestinations.map((dest, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {dest.destination}
                        </h3>
                        <div className="text-lg font-bold text-green-600">
                          {dest.averageCost}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div><strong>Best duration:</strong> {dest.bestDuration}</div>
                      <div><strong>Peak season:</strong> {dest.peakSeason}</div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Top Countries</h4>
                      <div className="flex flex-wrap gap-1">
                        {dest.topCountries.map((country, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Why It's Perfect for Students</h4>
                        <p className="text-gray-600 text-sm mb-4">{dest.whyPopular}</p>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">Budget Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {dest.budgetTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="text-green-600 mr-2">💡</div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Student Opportunities</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {dest.studentPerks.map((perk, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mr-2 mt-2"></div>
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Travel Tips */}
      <div className="bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Student Travel Tips
            </h2>
            <p className="text-gray-600 text-lg">
              Expert advice to help students travel safely, smartly, and affordably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work & Travel Programs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Work & Travel Programs for Students
            </h2>
            <p className="text-gray-600 text-lg">
              Fund your travels by working abroad with these popular programs.
            </p>
          </div>

          <div className="space-y-8">
            {workTravelPrograms.map((program, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <Users className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {program.program}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Age: {program.ageLimit}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {program.duration}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Available Countries</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.countries.slice(0, 3).map((country, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {country}
                          </span>
                        ))}
                        {program.countries.length > 3 && (
                          <span className="text-xs text-gray-500">+{program.countries.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                          {program.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-semibold text-gray-900 mb-2">Popular Jobs</h4>
                        <div className="flex flex-wrap gap-1">
                          {program.popularJobs.map((job, idx) => (
                            <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                          {program.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mr-2 mt-2"></div>
                              {req}
                            </li>
                          ))}
                        </ul>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-semibold text-blue-800 mb-1">Application Tip</div>
                          <div className="text-sm text-blue-700">{program.applicationTips}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Breakdown Examples */}
      <div className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Student Travel Budgets
            </h2>
            <p className="text-gray-600 text-lg">
              Detailed budget breakdowns for popular student travel destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {budgetBreakdown.map((budget, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {budget.destination}
                </h3>
                
                <div className="text-2xl font-bold text-green-600 mb-6">
                  {budget.totalCost}
                </div>

                <div className="space-y-3 mb-6">
                  {Object.entries(budget.breakdown).map(([category, cost], idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{category}:</span>
                      <span className="font-medium">{cost}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Money-Saving Tips</h4>
                  <ul className="space-y-1">
                    {budget.savingTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <div className="text-green-600 mr-2">💡</div>
                        {tip}
                      </li>
                    ))}
                  </ul>
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
              Complete Student Travel Planning Guide 2025
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Student Travel Timeline</h3>
                <p className="text-gray-600 mb-4">
                  Plan your student adventure with this essential timeline:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>6-12 months before:</strong> Research destinations, save money, apply for programs</li>
                  <li>• <strong>3-6 months before:</strong> Book flights, get travel insurance, apply for visas</li>
                  <li>• <strong>1-3 months before:</strong> Get vaccinations, book initial accommodation</li>
                  <li>• <strong>2-4 weeks before:</strong> Notify banks, download apps, pack smart</li>
                  <li>• <strong>1 week before:</strong> Check in for flights, confirm bookings, final preparations</li>
                  <li>• <strong>Day of departure:</strong> Arrive early, have documents ready, stay calm</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Building Your Travel Fund</h3>
                <p className="text-gray-600 mb-4">
                  Creative ways students can save money for travel:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Set up automatic transfers to savings account</li>
                  <li>• Work part-time jobs or freelance gigs</li>
                  <li>• Sell items you no longer need</li>
                  <li>• Cut unnecessary expenses (subscriptions, eating out)</li>
                  <li>• Use cashback apps and student discounts</li>
                  <li>• Consider crowdfunding for volunteer trips</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Student Travel Safety Tips</h3>
              <p className="text-gray-600 mb-4">
                Stay safe while exploring the world as a student traveler:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Before You Go</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Research your destination thoroughly</li>
                    <li>• Get comprehensive travel insurance</li>
                    <li>• Register with your embassy/consulate</li>
                    <li>• Share itinerary with family/friends</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">While Traveling</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Stay in touch with home regularly</li>
                    <li>• Keep copies of important documents</li>
                    <li>• Trust your instincts about people/situations</li>
                    <li>• Don't flash expensive items or large amounts of cash</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emergency Preparedness</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Have emergency contacts readily available</li>
                    <li>• Know location of nearest embassy/consulate</li>
                    <li>• Keep emergency cash in multiple locations</li>
                    <li>• Have backup plans for transportation/accommodation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Student Travel FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Do I need to be enrolled in school to get student discounts?</h4>
                  <p className="text-gray-600">Most programs require current enrollment, but some extend to recent graduates. Age limits (typically under 26) may also apply.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">How much should I budget for a semester abroad?</h4>
                  <p className="text-gray-600">Costs vary widely by destination, but budget $3,000-8,000 for a semester including flights, accommodation, food, and activities.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Is travel insurance worth it for students?</h4>
                  <p className="text-gray-600">Absolutely. Medical emergencies abroad can cost thousands. Student travel insurance typically costs $30-80/month and provides essential protection.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Can I work while traveling on a tourist visa?</h4>
                  <p className="text-gray-600">Generally no. You need specific work visas or working holiday visas to work legally abroad. Research visa requirements carefully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}