import type { LoaderFunction, ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { json, redirect } from "@remix-run/node";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import type { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import type { QueryPlace, QueryPlaceString } from "~/types/search";
import { useEffect, useRef, useState } from "react";
import { Loading } from "~/components/ui/loading";
import {
  getDateYYYYMMDDToDisplay,
  getTripDaysLengthFromYYYYMMDD,
  getNextXMonthsStartDayAndEndDay,
} from "~/helpers/date";
import { FlightControls } from "~/components/ui/flight-controls/flight-controls-default";
import { getQueryPlaceFromQuery } from "~/helpers/sdk/flight";
import { userPrefs } from "~/helpers/cookies";
import { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { IndicativeSDK } from "~/helpers/sdk/indicative/indicative-sdk";
import moment from "moment";

interface Holiday {
  query: QueryPlace;
  search?: SearchSDK;
  selected?: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const backgroundImage = await getImages({
    apiUrl,
    query: "beach",
  });
  // const quote = {
  //   apiUrl,
  //   query: {
  //     from: "27544008",
  //     to: "anywhere",
  //     tripType: "return",
  //   },
  //   month: 3,
  //   year: 2025,
  //   endMonth: 3,
  //   endYear: 2025,
  // };

  const deals = await skyscanner().indicative({
    apiUrl,
    query: {
      from: "27544008",
      to: "anywhere",
      tripType: "return",
    },
    month: 3,
    year: 2025,
    endMonth: 3,
    endYear: 2025,
  });

  const holidays: QueryPlaceString[] = [];

  const holidaysPlace: Holiday[] = [];
  holidays.forEach((holiday) => {
    const holidayAdd = getQueryPlaceFromQuery(holiday);
    if (!holidayAdd) return;
    holidaysPlace.push({ query: holidayAdd });
  });

  return json({
    deals,
    apiUrl,
    googleApiKey,
    googleMapId,
    backgroundImage,
    holidaysPlace,
    cookieHolidays: cookie.holidays ? JSON.parse(cookie.holidays) : [],
  });
};

export async function action({ request }: ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("holidays")) {
    cookie.holidays = bodyParams.get("holidays");
  }

  return redirect("/trips", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function Index() {
  const {
    backgroundImage,
    apiUrl,
    holidaysPlace,
    cookieHolidays,
    googleApiKey,
    googleMapId,
    deals,
  } = useLoaderData<{
    backgroundImage: string[];
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    holidaysPlace: Holiday[];
    cookieHolidays?: Holiday[];
    deals: IndicativeSDK;
  }>();
  const randomHeroImage = backgroundImage[1];
  const [holidays, setHolidays] = useState<Holiday[]>(
    cookieHolidays ? cookieHolidays : holidaysPlace
  );

  useEffect(() => {
    runSearches();
  }, []);

  const runSearches = async () => {
    for (let index = 0; index < holidays.length; index++) {
      const holiday = holidays[index];
      if (holiday.search) return;
      await runSearch(holidays[index]);
    }
  };
  const runSearch = async (holiday: Holiday) => {
    const data = await skyscanner().flight().create({
      apiUrl,
      query: holiday.query,
    });

    if ("error" in data) return;

    const holidaysAdded = holidaysRef.current.map((holidayLoop) => {
      if (
        !(JSON.stringify(holiday.query) === JSON.stringify(holidayLoop.query))
      )
        return holidayLoop;
      return {
        ...holidayLoop,
        search: { ...data, sessionToken: data.sessionToken },
      };
    });
    setHolidays(holidaysAdded);
    if (data.status === "RESULT_STATUS_COMPLETE") return;

    runPoll({ sessionToken: data.sessionToken });

    return;
  };

  const runPoll = async ({ sessionToken }: { sessionToken: string }) => {
    console.log("run poll");
    const res = await skyscanner().flight().poll({
      apiUrl,
      token: sessionToken,
      wait: 5,
    });

    if ("error" in res) {
      console.log("here is an error");
      runPoll({ sessionToken });

      return;
    }

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      if (res.action !== "RESULT_ACTION_NOT_MODIFIED") {
        const holidaysAdded = holidaysRef.current.map((holiday) => {
          if (holiday.search && holiday.search.sessionToken !== sessionToken)
            return holiday;
          return {
            ...holiday,
            search: { ...res, sessionToken: sessionToken },
          };
        });
        setHolidays(holidaysAdded);
      }
      runPoll({ sessionToken });
    } else {
      const holidaysAdded = holidaysRef.current.map((holiday) => {
        if (holiday.search && holiday.search.sessionToken !== sessionToken)
          return holiday;
        return {
          ...holiday,
          search: { ...res, sessionToken: sessionToken },
        };
      });
      setHolidays(holidaysAdded);
    }
  };

  const handleAddHoliday = (query: QueryPlace) => {
    const holidaysPrevious = holidays;
    const holidayAdd = {
      query: {
        from: query.from,
        to: query.to,
        depart: query.depart,
        return: query.return,
      },
    };
    setHolidays([...holidaysPrevious, holidayAdd]);
    runSearch(holidayAdd);
  };

  const handleSelectedItem = (holidayUpdate: Holiday) => {
    setHolidays((prevHolidays) =>
      prevHolidays.map((holiday) =>
        JSON.stringify(holiday.query) === JSON.stringify(holidayUpdate.query)
          ? { ...holidayUpdate }
          : holiday
      )
    );
  };

  const holidaysRef = useRef<Holiday[]>([]);

  useEffect(() => {
    holidaysRef.current = holidays;
  }, [holidays]);

  const holidaysStatic = holidays.map((holidaysItem) => ({
    ...holidaysItem,
    search: undefined,
  }));

  return (
    <Layout apiUrl={apiUrl}>
      <HeroSimple
        title={"My Trips"}
        text="See all the trips for the year"
        backgroundImage={randomHeroImage}
      />
      <div>
        <div className="justify-between mx-4 max-w-screen-lg bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          <FlightControls
            apiUrl={apiUrl}
            showPreviousSearches={false}
            onSearch={handleAddHoliday}
            useForm={false}
          />

          <div className="my-4 py-10 px-4 rounded-lg bg-gray-800 border-2 border-gray-700">
            <h2 className="mb-4 my-4 text-4xl font-extrabold tracking-tight leading-none md:text-4xl lg:text-4xl text-white ">
              Your Trips
            </h2>
            {holidays.map((holiday, key) => (
              <div key={key} className="border-b-2 border-gray-700 py-4 ">
                {holiday.query.from.name} to {holiday.query.to.name} for{" "}
                {getTripDaysLengthFromYYYYMMDD(
                  holiday.query.depart,
                  holiday.query.return
                )}{" "}
                from{" "}
                {holiday?.search?.cheapest[0]
                  ? holiday?.search?.cheapest[0].price
                  : ""}
                {holiday?.search?.status !== "RESULT_STATUS_COMPLETE" ? (
                  <div className="ml-2 inline-block">
                    <Loading height="5" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
            <Form method="post" className="inline-block py-4 mr-2">
              <input
                type="hidden"
                name="holidays"
                value={JSON.stringify(holidaysStatic)}
              />
              <button
                className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
                type="submit"
              >
                Save
              </button>
            </Form>
            <Form method="post" className="inline-block">
              <input type="hidden" name="holidays" value={JSON.stringify([])} />
              <button
                className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
                type="submit"
              >
                Clear
              </button>
            </Form>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {deals.quotes.splice(0, 6).map((deal, key) => (
              <div key={deal.id} className="min-w-72 sm:min-w-0">
                <a
                  href={`/search/${deal.from.iata}/${deal.to.iata}/${deal.legs.depart.dateString}/${deal.legs.return.dateString}`}
                  className="group/link relative block bg-white border border-gray-200  rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:dark:border-gray-500"
                >
                  <div
                    className="absolute top-0 left-0 bg-cover bg-no-repeat w-full h-full z-0 rounded-lg"
                    style={{
                      backgroundImage: `url(${deal.country.images[0]}&w=500)`,
                    }}
                  ></div>
                  <div className="opacity-80 group-hover/link:opacity-60 transition ease-in bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0 rounded-lg"></div>
                  <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[80%] z-0 rounded-lg"></div>
                  <div className="relative z-10 p-4 leading-normal">
                    <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {deal.tripDays} in {deal.country.name}
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
                    <div className="text-xs mt-2 mb-2 text-gray-500 text-right italic">
                      Updated {deal.updated}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {getNextXMonthsStartDayAndEndDay(10).map((month) => (
            <div
              key={month.month}
              className="relative border-b-2 border-gray-800"
            >
              <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 py-2">
                <h2 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-4xl lg:text-4xl text-white ">
                  {month.displayMonthText}
                </h2>
              </div>
              {holidays
                .filter((holiday) => {
                  return holiday.query.depart.split("-")[1] === month.month;
                })
                .map((holiday, key) => (
                  <div
                    className="relative"
                    key={`${holiday.query.from.iata}${holiday.query.to.iata}${holiday.query.depart}${holiday.query.return}`}
                  >
                    <div className="sticky z-20 top-14 bg-white dark:bg-gray-900 py-4">
                      <h2 className=" mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-2xl lg:text-2xl text-white ">
                        {holiday.query.from.name} to {holiday.query.to.name}{" "}
                        {holiday.search ? (
                          <span className="text-md lg:text-md md:text-md">
                            (from{" "}
                            {holiday?.search?.cheapest[0] ? (
                              holiday?.search?.cheapest[0].price
                            ) : (
                              <Loading height="5" />
                            )}
                            )
                          </span>
                        ) : (
                          ""
                        )}
                      </h2>
                      <p>
                        {getDateYYYYMMDDToDisplay(
                          holiday.query.depart,
                          "ddd, Do MMMM"
                        )}{" "}
                        {holiday.query.return
                          ? `to ${getDateYYYYMMDDToDisplay(
                              holiday.query.return,
                              "ddd, Do MMMM"
                            )}`
                          : ""}{" "}
                        -{" "}
                        {getTripDaysLengthFromYYYYMMDD(
                          holiday.query.depart,
                          holiday.query.return
                        )}
                        {holiday.search &&
                        holiday.search.status === "RESULT_STATUS_COMPLETE" ? (
                          ""
                        ) : (
                          <div className="inline-block ml-2">
                            <Loading height="5" />
                          </div>
                        )}
                      </p>
                    </div>
                    <div className="">
                      <FlightResultsDefault
                        loading={false}
                        numberOfResultsToShow={3}
                        filters={{}}
                        flights={holiday.search}
                        query={holiday.query}
                        headerSticky={false}
                        apiUrl={apiUrl}
                        googleApiKey={googleApiKey}
                        googleMapId={googleMapId}
                        onSelect={(id) =>
                          handleSelectedItem({ ...holiday, selected: id })
                        }
                        selected={holiday.selected}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
