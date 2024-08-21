import { useEffect } from "react";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MarketingNearbyProps {
  search: IndicativeQuotesSDK[];
  to: Place;
}
export const MarketingNearby = ({ search, to }: MarketingNearbyProps) => {
  
const runNearBy = async () => {
  const res = await fetch('https://api.content.tripadvisor.com/api/v1/location/search?key=51E86DB2EC7940CD8B8AAF2A48B1836B&searchQuery=London&category=attractions&language=en');
  const data = res.json();

  console.log(data);
}

  useEffect(() => {
    runNearBy();
  },[]);

  return (
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        What to do in {to.name}
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        We are strategists, designers and developers. Innovators and problem
        solvers. Small enough to be simple and quick, but big enough to deliver
        the scope you want at the pace you need.
      </p>
      <div className="m-6 grid grid-cols-1 gap-2">
        
      </div>
    </div>
  );
};
