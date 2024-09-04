import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import type { LoaderFunction } from "@remix-run/node";
import { HeroFlight } from "~/components/section/hero/hero-flight";
import { getImages } from "~/helpers/sdk/query";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "travel",
  });

  return {
    apiUrl,
    backgroundImage,
  };
};

export default function SearchFlight() {
  const { apiUrl, backgroundImage } = useLoaderData<{
    apiUrl: string;
    backgroundImage: string[];
  }>();
  const randomHeroImage =
    backgroundImage[0];

  return (
    <div>
      <Layout selectedUrl="/search">
        <HeroFlight
          apiUrl={apiUrl}
          newFeatureURL="/news"
          backgroundImage={randomHeroImage}
        />
      </Layout>
    </div>
  );
}
