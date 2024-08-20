import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MarketingGraphProps {
  place?: Place;
  from: Place;
  url: string;
  search: IndicativeQuotesSDK[];
}
export const MarketingGraph = ({
  place,
  url,
  search,
}: MarketingGraphProps) => {

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Top Months
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        We are strategists, designers and developers. Innovators and problem
        solvers. Small enough to be simple and quick, but big enough to deliver
        the scope you want at the pace you need.
      </p>
      <div className="m-6 grid sm:grid-cols-3 gap-4">
        
      </div>
    </div>
  );
};
