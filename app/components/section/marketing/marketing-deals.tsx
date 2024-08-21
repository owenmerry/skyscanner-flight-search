import moment from "moment";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MarketingDealsProps {
  to?: Place;
  from: Place;
  search: IndicativeQuotesSDK[];
  level?: 'city';
}
export const MarketingDeals = ({ search, to, from, level }: MarketingDealsProps) => {
  return (
    <div className="dark:bg-slate-950">
    <div className="py-12 sm:py-8 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center lg:py-16">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Cheap flights to {to ? to.name : "Everywhere"}
      </h2>
      <p className="font-light text-gray-500 sm:text-lg md:px-20 lg:px-38 xl:px-48 dark:text-gray-400">
        We are strategists, designers and developers. Innovators and problem
        solvers. Small enough to be simple and quick, but big enough to deliver
        the scope you want at the pace you need {search.length}.
      </p>
      <div className="flex overflow-y-scroll scrollbar-hide m-6 sm:grid sm:grid-cols-1 gap-4 md:grid-cols-3">
        {search
          .filter((item) =>
            to ? item.parentsString.includes(to.entityId) : true
          )
          .splice(0, 9)
          .map((deal, key) => {
            return (
              <div key={deal.id} className="min-w-96 sm:min-w-0">
                <a
                  href={`/search/${deal.from.iata}/${deal.to.iata}/${deal.legs.depart.dateString}/${deal.legs.return.dateString}`}
                  className="relative block bg-white border border-gray-200  rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:dark:border-gray-500"
                >
                  <div
                    className="absolute top-0 left-0 bg-cover bg-no-repeat w-full h-full z-0 rounded-lg"
                    style={{
                      backgroundImage: `url(${deal.country.images[key]}&w=500)`,
                    }}
                  ></div>
                  <div className="opacity-80 bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0 rounded-lg"></div>
                  <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[80%] z-0 rounded-lg"></div>
                  <div className="relative z-10 p-4 leading-normal">
                    <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {deal.tripDays} in {level === 'city' ? deal.city.name : deal.country.name }
                    </h5>
                    {/* ---------- */}
                    <div className="grid grid-cols-3 mb-6 place-items-center">
                      <div className="col-span-2">
                        <div className="text-[1.1rem] text-white font-bold">
                          {moment(deal.legs.depart.dateString).format(
                            "ddd, MMM Do"
                          )}
                        </div>
                        <div className="text-xs mt-2 truncate">
                          {deal.from.iata} - {deal.to.iata} with{" "}
                          {deal.legs.depart.carrier.name}
                        </div>
                      </div>
                      <div>{deal.isDirect ? "Direct" : "1 Stop"}</div>
                    </div>
                    {/* ---------- */}
                    {/* ---------- */}
                    <div className="grid grid-cols-3 place-items-center mb-4">
                      <div className="col-span-2">
                        <div className="text--[1.1rem] text-white font-bold">
                          {moment(deal.legs.return.dateString).format(
                            "ddd, MMM Do"
                          )}
                        </div>
                        <div className="text-xs mt-2 truncate">
                          {deal.to.iata} - {deal.from.iata} with{" "}
                          {deal.legs.return.carrier.name}
                        </div>
                      </div>
                      <div>{deal.isDirect ? "Direct" : "1 Stop"}</div>
                    </div>
                    {/* ---------- */}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-right">
                      {deal.price.display.split(".")[0]}{" "}
                      <span className="text-sm">Return</span>
                    </h5>
                  </div>
                </a>
              </div>
            );
          })}
      </div>
    </div>
    </div>
  );
};
