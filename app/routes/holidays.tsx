import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { json } from "@remix-run/node";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import {
  Place,
  getIataFromEntityId,
  getPlaceFromIata,
} from "~/helpers/sdk/place";
import { SearchSDK } from "~/helpers/sdk/flight/flight-functions";
import { FlightResultsDefault } from "~/components/section/flight-results/flight-results-default";
import { Query, QueryPlace, QueryPlaceString } from "~/types/search";
import { useEffect, useRef, useState } from "react";
import { Loading } from "~/components/ui/loading";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "beach",
  });

  return json({
    apiUrl,
    backgroundImage,
  });
};

interface Holiday {
  query: QueryPlace;
  search: SearchSDK;
}

export default function Index() {
  const { backgroundImage, apiUrl } = useLoaderData<{
    backgroundImage: string[];
    apiUrl: string;
  }>();
  const randomHeroImage = backgroundImage[1];
  const [searches, setSearches] = useState<Holiday[]>([]);
  const holidays: QueryPlaceString[] = [
    {
      from: "LHR",
      to: "DUB",
      depart: "2024-04-05",
      return: "2024-04-07",
    },
    {
      from: "LHR",
      to: "MEX",
      depart: "2024-12-01",
      return: "2024-12-14",
    },
  ];

  useEffect(() => {
    runSearches();
  }, []);

  const runSearches = async () => {
    holidays.map(async (holiday) => {
      const from = getPlaceFromIata(holiday.from);
      const to = getPlaceFromIata(holiday.to);
      if (!from || !to) return;
      const query = {
        from,
        to,
        depart: holiday.depart,
        return: holiday.return,
      };

      const data = await skyscanner().flight().create({
        apiUrl,
        query,
      });

      if ("error" in data) return;

      setSearches([...searchesRef.current, { query, search: data }]);
      runPoll({ sessionToken: data.sessionToken });
    });
  };

  const runPoll = async ({ sessionToken }: { sessionToken: string }) => {
    const res = await skyscanner().flight().poll({
      apiUrl,
      token: sessionToken,
      wait: 5,
    });

    if ("error" in res) {
      //setError(res.error);
      runPoll({ sessionToken });

      return;
    }

    if (res.status === "RESULT_STATUS_INCOMPLETE") {
      if (res.action !== "RESULT_ACTION_NOT_MODIFIED") {
        const searchAdded = searchesRef.current.map((search) => {
          if (search.search.sessionToken !== sessionToken) return search;
          return {
            query: search.query,
            search: { ...res, sessionToken: sessionToken },
          };
        });
        setSearches(searchAdded);
      }
      runPoll({ sessionToken });
    } else {
      const searchAdded = searchesRef.current.map((search) => {
        if (search.search.sessionToken !== sessionToken) return search;
        return {
          query: search.query,
          search: res,
        };
      });
      setSearches(searchAdded);
    }
  };

  const searchesRef = useRef<Holiday[]>([]);

  useEffect(() => {
    searchesRef.current = searches;
  }, [searches]);

  return (
    <Layout>
      <HeroSimple
        title={"Holidays"}
        text="See holidays"
        backgroundImage={randomHeroImage}
      />
      <div>
        <div className="justify-between mx-4 max-w-screen-xl bg-white dark:bg-gray-900 xl:p-9 xl:mx-auto">
          {searches.map((search, key) => (
            <div className="relative" key={`${search.search.sessionToken}`}>
              <div className="sticky top-0 bg-white dark:bg-gray-900 py-4">
                <h2 className=" mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white ">
                  {search.query.from.name} to {search.query.to.name}
                </h2>
                <p>
                  {search.query.depart}{" "}
                  {search.query.return ? `to ${search.query.return}` : ""}{" "}
                  {search.search.status === "RESULT_STATUS_COMPLETE" ? (
                    ""
                  ) : (
                    <div className="inline-block">
                      <Loading />
                    </div>
                  )}{" "}
                  {search.search.stats.total} Results
                </p>
              </div>
              <FlightResultsDefault
                filters={{}}
                flights={search.search}
                query={search.query}
                headerSticky={false}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
