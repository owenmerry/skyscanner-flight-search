import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroNews } from "~/components/section/hero/hero-news";
import { getRandomNumber } from "~/helpers/utils";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "flight",
  });

  return {
    apiUrl,
    backgroundImage,
  };
};

export default function Index() {
  const { apiUrl, backgroundImage } = useLoaderData();
  const randomHeroImage =
    backgroundImage[getRandomNumber(backgroundImage.length)];

  return (
    <Layout selectedUrl="/news">
      <HeroNews
        apiUrl={apiUrl}
        newFeatureURL="/news"
        backgroundImage={randomHeroImage}
      />
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-12">
        <h2 className="text-2xl mb-6">Updates and new features</h2>
        <p className="pb-16 border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          This is a list of all the latest updates and features added to the
          website.
        </p>

        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added stop over days (1 day, 2 days, 3 days and 5 days) for stop
            over's, which links to a multi city search on skyscanner
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-10-02 at 17.58.45.png"
          />
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-10-02 at 17.27.38.png"
          />
        </div>

        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added Graphs to Country pages and search pages to see options of
            flights
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-09-27 at 18.50.00.png"
          />
        </div>

        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added a swap button to quickly reverse the to and from location
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-09-27 at 18.39.10.png"
          />
        </div>

        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added Check Price Feature With calender for single flights on
            country page
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-07-29 at 20.10.54.png"
          />
        </div>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">Added search on countries</h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-07-29 at 20.12.18.png"
          />
        </div>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added Check Price Feature for Cached prices
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-07-28 at 19.01.42.png"
          />
        </div>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">Added Explore Everywhere</h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-07-28 at 18.03.48.png"
          />
        </div>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">Added Different options to search</h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot 2023-07-28 at 13.33.22.png"
          />
        </div>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added Map of location on search and Deals panel for Flight and Hotel
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/Screenshot%202023-07-27%20at%2000.46.50.png"
          />
        </div>
      </div>
    </Layout>
  );
}
