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
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  const content = await skyscanner().content({
    apiUrl,
    slug: params.slug,
  });
  if ("error" in content.page) {
    return redirect("/not-found");
  }

  return json({
    apiUrl,
    page: content.page,
    googleApiKey,
    googleMapId,
  });
};

export default function Index() {
  const { page, apiUrl, googleApiKey, googleMapId } = useLoaderData<{
    page: SkyscannerAPIContentPageResponse;
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
  }>();

  return (
    <Layout>
      <Components
        apiUrl={apiUrl}
        list={page.fields.components}
        googleApiKey={googleApiKey}
        googleMapId={googleMapId}
      />
    </Layout>
  );
}
