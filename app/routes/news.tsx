import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/ui/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  return {
    apiUrl,
  };
};

export default function Index() {
  const { apiUrl } = useLoaderData();

  return (
    <Layout selectedUrl="/">
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-12">
        <h2 className="text-2xl mb-6">Updates and new features</h2>
        <p className="mb-10">
          This is a list of all the latest updates and features added to the
          website.
        </p>
        <div className="border-slate-200 dark:border-slate-800 p-4 my-4 border-b-2">
          <h2 className="text-xl">
            Added Check Price Feature for Cached prices
          </h2>
          <img
            className="object-scale-down my-4"
            src="/images/news/public/images/news/Screenshot 2023-07-28 at 19.01.42.png"
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
