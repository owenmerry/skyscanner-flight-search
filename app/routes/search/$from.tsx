import { useEffect, useState } from "react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPlaceFromIata, getPlaceFromSlug } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { Place } from "~/helpers/sdk/place";
import { FlightControlsApp } from "~/components/ui/flight-controls/flight-controls-app";
import { Box, LinearProgress, Skeleton } from "@mui/material";
import moment from "moment";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { actionsSearchForm } from "~/actions/search-form";

type Filters =
  | "depart 7 days"
  | "depart 1 month"
  | "short holiday"
  | "long holiday"
  | "in asia"
  | "in north america"
  | "in south america"
  | "in africa"
  | "in europe";

export const loader = async ({ params }: LoaderArgs) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  //exit
  if (!params.from) return;

  //query
  const from = getPlaceFromIata(params.from);
  if (!from) return {};

  return {
    apiUrl,
    googleApiKey,
    googleMapId,
    params,
    from,
  };
};

export async function action({ request }: ActionArgs) {
  let action;
  action = actionsSearchForm({request});

  return action;
}

export default function Search() {
  const {
    apiUrl,
    from,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    from: Place;
  } = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
  const [filters, setFilters] = useState<Filters[]>([]);
  const continentAsia = getPlaceFromSlug("asia" || "", "PLACE_TYPE_CONTINENT");
  const continentNorthAmerica = getPlaceFromSlug(
    "north-america" || "",
    "PLACE_TYPE_CONTINENT"
  );
  const continentSouthAmerica = getPlaceFromSlug(
    "south-america" || "",
    "PLACE_TYPE_CONTINENT"
  );
  const continentAfrica = getPlaceFromSlug(
    "africa" || "",
    "PLACE_TYPE_CONTINENT"
  );
  const continentEurope = getPlaceFromSlug(
    "europe" || "",
    "PLACE_TYPE_CONTINENT"
  );

  useEffect(() => {
    setLoading(true);
    runSearch();
  }, []);

  const runSearch = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from.entityId,
        to: "anywhere",
        tripType: "return",
      },
      groupType: "month",
      month: Number(moment().format("MM")),
      year: Number(moment().format("YYYY")),
      endMonth: Number(moment().add(10, "months").format("MM")),
      endYear: Number(moment().add(10, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    setSearch(indicativeSearch.quotes);
    setLoading(false);
  };

  const searchFiltered =
    search?.filter((deal) => {
      let check = true;
      if (filters.includes("depart 7 days")) {
        const targetDate = moment(deal.legs.depart.dateString);
        const currentDate = moment();
        const daysUntil = targetDate.diff(currentDate, "days");
        check = check && daysUntil < 7;
      }
      if (filters.includes("depart 1 month")) {
        const targetDate = moment(deal.legs.depart.dateString);
        const currentDate = moment();
        const daysUntil = targetDate.diff(currentDate, "days");
        check = check && daysUntil < 30;
      }
      if (filters.includes("short holiday")) {
        const departDate = moment(deal.legs.depart.dateString);
        const returnDate = moment(deal.legs.return.dateString);
        const days = returnDate.diff(departDate, "days");
        check = check && days < 5;
      }
      if (filters.includes("long holiday")) {
        const departDate = moment(deal.legs.depart.dateString);
        const returnDate = moment(deal.legs.return.dateString);
        const days = returnDate.diff(departDate, "days");
        check = check && days >= 7;
      }
      if (filters.includes("in asia")) {
        if (continentAsia) {
          check = check && deal.parentsString.includes(continentAsia.entityId);
        }
      }
      if (filters.includes("in north america")) {
        if (continentNorthAmerica) {
          check =
            check &&
            deal.parentsString.includes(continentNorthAmerica.entityId);
        }
      }
      if (filters.includes("in south america")) {
        if (continentSouthAmerica) {
          check =
            check &&
            deal.parentsString.includes(continentSouthAmerica.entityId);
        }
      }
      if (filters.includes("in africa")) {
        if (continentAfrica) {
          check =
            check && deal.parentsString.includes(continentAfrica.entityId);
        }
      }
      if (filters.includes("in europe")) {
        if (continentEurope) {
          check =
            check && deal.parentsString.includes(continentEurope.entityId);
        }
      }

      return check;
    }) || [];

  const addFilter = (filterName: Filters) => {
    const isFilterOn = filters.includes(filterName);
    if (isFilterOn) {
      setFilters([...filters.filter((item) => item !== filterName)]);
    } else {
      setFilters([...filters, filterName]);
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-30 mb-2">
        <FlightControlsApp apiUrl={apiUrl} selected="explore" from={from} />
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              sx={{
                backgroundColor: "rgba(0,0,0,0)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1b64f2",
                },
              }}
            />
          </Box>
        ) : (
          ""
        )}
      </div>
      <div className="py-12 sm:py-2 px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 lg:py-2">
      <div className="flex items-center mb-2 mt-4">
          <svg
            className="w-8 h-8 text-gray-800 dark:text-blue-600 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v6M9.5 9A2.5 2.5 0 0 1 12 6.5"
            />
          </svg>
        <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          {from.name} to Everywhere
        </h2>
        </div>
        <div className="flex overflow-y-scroll scrollbar-hide gap-2 py-3">
          {!loading ? (
            <>
              <div
                onClick={() => addFilter("depart 7 days")}
                className={`${
                  filters.includes("depart 7 days")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                Depart within 7 days
              </div>
              <div
                onClick={() => addFilter("depart 1 month")}
                className={`${
                  filters.includes("depart 1 month")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                Depart within 1 month
              </div>
              <div
                onClick={() => addFilter("short holiday")}
                className={`${
                  filters.includes("short holiday")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                Short holiday
              </div>
              <div
                onClick={() => addFilter("long holiday")}
                className={`${
                  filters.includes("long holiday")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                Long holiday
              </div>
              <div
                onClick={() => addFilter("in asia")}
                className={`${
                  filters.includes("in asia")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                🍜 In Asia
              </div>
              <div
                onClick={() => addFilter("in north america")}
                className={`${
                  filters.includes("in north america")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                In North America
              </div>
              <div
                onClick={() => addFilter("in south america")}
                className={`${
                  filters.includes("in south america")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                In South America
              </div>
              <div
                onClick={() => addFilter("in africa")}
                className={`${
                  filters.includes("in africa")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                In Africa
              </div>
              <div
                onClick={() => addFilter("in europe")}
                className={`${
                  filters.includes("in europe")
                    ? `border-blue-600 bg-blue-600 hover:border-blue-600`
                    : `border-slate-600 bg-slate-800 hover:border-slate-500`
                } border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
              >
                🇪🇺 In Europe
              </div>
            </>
          ) : (
            <>
              {Array.from(Array(8)).map((e, k) => (
                <div
                  key={k}
                  className={`border-slate-600 bg-slate-800 hover:border-slate-500
                           border py-3 px-3 rounded-lg cursor-pointer text-white font-bold text-sm whitespace-nowrap`}
                >
                  <Skeleton width="100px" />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {searchFiltered.map((deal, key) => {
            if(key + 1 > 21) return '';
            return (
              <div key={deal.id} className="">
                <a
                  href={`/search/${deal.from.iata}/${deal.to.iata}/${deal.legs.depart.dateString}/${deal.legs.return.dateString}`}
                  className="group/link relative block rounded-lg shadow md:flex-row md:max-w-xl border border-slate-700 bg-slate-800 hover:border-slate-600 transition"
                >
                  <div
                        className="absolute top-0 left-0 bg-cover bg-no-repeat w-full h-full z-0 rounded-lg"
                        style={{
                          backgroundImage: `url(${deal.country.images[key % deal.country.images.length]}&w=500)`,
                        }}
                      ></div>
                      <div className="opacity-80 group-hover/link:opacity-60 transition ease-in bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0 rounded-lg"></div>
                      <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[80%] z-0 rounded-lg"></div>
                  <div className="relative z-10 p-4 leading-normal">
                    <div className="flex gap-2 justify-between mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
                      <div className="truncate">
                        {deal.city?.name || deal.query.to.name}, {deal.country.name}
                      </div>
                      <div className="whitespace-nowrap">{deal.tripDays}</div>
                    </div>
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
          {loading ? (
            <>
              {Array.from(Array(21)).map((e, k) => (
                <div key={k} className="">
                  <div className="group/link relative block rounded-lg shadow md:flex-row md:max-w-xl border border-slate-700 bg-slate-800 hover:border-slate-600 transition">
                    <div className="relative z-10 p-4 leading-normal">
                      <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <Skeleton />
                      </h5>
                      {/* ---------- */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="">
                          <div className=" text-white font-bold">
                            <Skeleton />
                          </div>
                          <div className="mt-2">
                            <Skeleton />
                          </div>
                        </div>
                        <div>
                          <Skeleton />
                        </div>
                      </div>
                      {/* ---------- */}
                      {/* ---------- */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="">
                          <div className=" text-white font-bold">
                            <Skeleton />
                          </div>
                          <div className="mt-2">
                            <Skeleton />
                          </div>
                        </div>
                        <div>
                          <Skeleton />
                        </div>
                      </div>
                      {/* ---------- */}
                      <h5 className="mb-2 text-2xl text-right font-bold tracking-tight text-gray-900 dark:text-white">
                        <div className="flex justify-end">
                          <Skeleton width="40%" />
                        </div>
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
        {!loading && searchFiltered.length === 0 ? (
            <div className="border border-slate-700 bg-slate-800 rounded-lg p-6">
              <h5 className="text-2xl font-bold pb-4">No Results Found</h5>
              {filters.length > 0 ? (
                <div>
                  Try changing your filters as you didnt get any results with this trip <div className="underline cursor-pointer pt-4" onClick={() => setFilters([])}>Remove Filters</div>
              </div>
              ) : (
                <div>
                  Try a differnt location as there is'nt any results for this search.
              </div>)}
              <p></p>
            </div>
          ) : ''}
      </div>
    </div>
  );
}
