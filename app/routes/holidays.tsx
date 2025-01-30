import { LoaderFunction, redirect, ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { json } from "@remix-run/node";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { QueryPlace, QueryPlaceString } from "~/types/search";
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

  const holidays: QueryPlaceString[] = [];

  const holidaysPlace: Holiday[] = [];
  holidays.forEach((holiday) => {
    const holidayAdd = getQueryPlaceFromQuery(holiday);
    if (!holidayAdd) return;
    holidaysPlace.push({ query: holidayAdd });
  });

  return json({
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

  return redirect("/holidays", {
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
  } = useLoaderData<{
    backgroundImage: string[];
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    holidaysPlace: Holiday[];
    cookieHolidays?: Holiday[];
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

  const handleSelectedItem = (holidayUpdate : Holiday) => {
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
    <Layout>
      <HeroSimple
        title={"My Holidays"}
        text="See all the holidays for the year"
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
                {holiday?.search?.cheapest[0] &&
                  holiday?.search?.cheapest[0].price}
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
                      <h2 className=" mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-3xl text-white ">
                        {holiday.query.from.name} to {holiday.query.to.name}{" "}
                        {holiday.search ? (
                          <span className="text-md lg:text-md md:text-md">
                            (from{" "}
                            {holiday?.search?.cheapest[0] &&
                              holiday?.search?.cheapest[0].price}
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
                        onSelect={(id) => handleSelectedItem({...holiday, selected: id})}
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
