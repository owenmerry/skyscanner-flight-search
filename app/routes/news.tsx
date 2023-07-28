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
        <div className="border-slate-700 pb-4 border-b-2">
          <h2 className="text-lg">
            Added Map of location on search and Deals panel for Flight and Hotel
          </h2>
          <img
            className="object-scale-down"
            src="/images/news/Screenshot%202023-07-27%20at%2000.46.50.png"
          />
        </div>
      </div>
    </Layout>
  );
}
