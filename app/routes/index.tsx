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
      <HeroDefault
        apiUrl={apiUrl}
        newFeature="Added Check Price Feature With Calander. See New Features"
        newFeatureURL="/news"
      />
      <NavigationWebsite />
    </Layout>
  );
}
