import { getFullPrice } from "~/helpers/meetup";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import type { PersonLocation } from "~/routes/meet-up";

interface MeetUpLocationProps {
  quote: IndicativeQuotesSDK;
  key: number;
  locations: PersonLocation[];
  month: number;
}

export const MeetUpLocation = ({
  quote,
  key,
  locations = [],
  month,
}: MeetUpLocationProps) => {
  return (
    <div key={quote.id} className="">
      <div className="group/link relative block rounded-lg shadow md:flex-row md:max-w-xl border border-slate-700 bg-slate-800 hover:border-slate-600 transition">
        <div
          className="absolute top-0 left-0 bg-cover bg-no-repeat w-full h-full z-0 rounded-lg"
          style={{
            backgroundImage: `url(${
              quote.country.images[key % quote.country.images.length]
            }&w=500)`,
          }}
        ></div>
        <div className="opacity-80 group-hover/link:opacity-60 transition ease-in bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0 rounded-lg"></div>
        <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[80%] z-0 rounded-lg"></div>
        <div className="relative z-10 p-4 leading-normal">
          <div className="flex gap-2 justify-between mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
            <div className="truncate">
              {quote.city?.name || quote.query.to.name}, {quote.country.name}
            </div>
            <div className="whitespace-nowrap">{quote.tripDays}</div>
          </div>
          {/* ---------- */}
          {locations
            .filter((person) => person.quotes !== undefined)
            .map((person) => {
              const quotePerson = person.quotes?.find(
                (item) => item.city?.name === quote.city?.name
              );
              if (!quotePerson) return "";

              return (
                <div key={`${person.place?.entityId}`}>
                  <div className="grid grid-cols-3 mb-6">
                    <div className="col-span-2 text-left">
                      <div className="text-[1.1rem] text-white font-bold">
                        <a
                          className=""
                          target="_blank"
                          rel="noreferrer"
                          href={`/search/${quotePerson.query.from.iata}/${quotePerson.query.to.iata}/2025-0${month}-15/2025-0${month}-25`}
                        >
                          {person.place?.name}
                        </a>
                      </div>
                      <div className="text-xs mt-2 truncate">
                        {quotePerson.isDirect ? "Direct" : "1 Stop"} -{" "}
                        {quotePerson.legs.depart.carrier.name} -{" "}
                      </div>
                    </div>
                    <div className="text-center">
                      {quotePerson.price.display}
                    </div>
                  </div>
                </div>
              );
            })}
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-right">
            £
            {Math.floor(
              getFullPrice(locations, quote.city?.name) / locations.length
            )}{" "}
            <span className="text-sm">Per Person</span>
          </h5>
        </div>
      </div>
    </div>
  );
};
