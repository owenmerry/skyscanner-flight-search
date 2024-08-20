import { getNextXMonthsStartDayAndEndDay } from "~/helpers/date";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { Place } from "~/helpers/sdk/place";

interface MarketingGraphProps {
  place?: Place;
  from: Place;
  to: Place;
  search: IndicativeQuotesSDK[];
}
export const MarketingGraph = ({ place, search }: MarketingGraphProps) => {
  const months = getNextXMonthsStartDayAndEndDay(12);
  const monthsPrice = months.map((monthItem) => ({
    ...monthItem,
    price: search.filter(
      (item) => item.legs.depart.date.month === Number(monthItem.month)
    )[0]?.price?.display,
    priceRaw: search.filter(
      (item) => item.legs.depart.date.month === Number(monthItem.month)
    )[0]?.price?.raw,
  }));
  const cheapest = monthsPrice.slice().sort(
    (a, b) => Number(a.priceRaw) - Number(b.priceRaw)
  )[0];
  const highest = monthsPrice.slice().filter(item => item.priceRaw).sort(
    (a, b) => Number(b.priceRaw) - Number(a.priceRaw)
  )[0];
  const getPercentageBar = (number: number, numberPercentage: number) => {
    return (
      100 - Math.ceil(((numberPercentage - number) / numberPercentage) * 100)
    );
  };

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
      <div className="m-6">
        {monthsPrice.map((month) => {
          return (
            <div key={`${month.displayMonthText}`}>
              <div className="grid grid-cols-10 content-center justify-items-center">
                <div className="">{month.smallMonth}</div>
                <div className="bg-slate-800 w-full flex-1 rounded-lg col-span-9 mb-3">
                  {month.priceRaw ? (
                    <div
                      className={`${
                        cheapest.priceRaw === month.priceRaw
                          ? "bg-blue-600"
                          : "bg-slate-600"
                      } rounded-lg p-2 flex flex-row-reverse`}
                      style={{
                        width: `${
                          month.priceRaw
                            ? getPercentageBar(
                                Number(month.priceRaw),
                                Number(highest.priceRaw)
                              )
                            : "0"
                        }%`,
                      }}
                    >
                      <div className="bg-blue-950 text-white inline-block rounded-lg p-2 text-sm">
                        from {month?.price}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg p-2 flex`}
                    >
                      <div className="bg-slate-800 text-white inline-block rounded-lg p-2 text-sm">
                        Check Prices
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
