import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { json } from "@remix-run/node";
import { ContentSDK } from "~/helpers/sdk/content/content-sdk";
import { Components } from "~/components/section/components/components";
import { SkyscannerAPIContentPageResponse } from "~/helpers/sdk/content/content-response";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: params.slug?.split("-")[0] || "",
  });

  const content = await skyscanner().content({
    apiUrl,
    slug: params.slug,
  });
  if ("error" in content.page) {
    return redirect("/not-found");
  }

  return json({
    apiUrl,
    backgroundImage,
    page: content.page,
  });
};

export default function Index() {
  const { backgroundImage, page } = useLoaderData<{
    backgroundImage: string[];
    page: SkyscannerAPIContentPageResponse;
  }>();
  const randomHeroImage = backgroundImage[0];

  return (
    <Layout>
      <Components list={page.fields.components} />
    </Layout>
  );
}
