import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "woods",
  });

  return json({
    apiUrl,
    backgroundImage,
  });
};

export default function Index() {
  const { apiUrl, backgroundImage, page } = useLoaderData<typeof loader>();
  const randomHeroImage = backgroundImage[1];

  return (
    <Layout>
      <HeroSimple
        title={"Page Not Found"}
        text="We cant find the page you are looking for, maybe try a different link"
        backgroundImage={randomHeroImage}
      />
    </Layout>
  );
}
