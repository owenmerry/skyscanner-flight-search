import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { json } from "@remix-run/node";
import { Components } from "~/components/section/components/components";
import { SkyscannerAPIContentPageResponse } from "~/helpers/sdk/content/content-response";
import { replacePlaceholders } from "~/helpers/sdk/placeholders/placeholders";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);

  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";
  const preview = url.searchParams.get("preview");

  const content = await skyscanner().content({
    apiUrl,
    slug: params["*"] ? encodeURIComponent(params["*"]) : "",
    preview: preview !== null ? true : false,
  });
  if ("error" in content.page) {
    return redirect("/not-found");
  }

  const pageContent = replacePlaceholders(content.page, {
    slug: params["*"],
  });

  return json({
    apiUrl,
    page: pageContent,
    slug: params["*"],
    googleApiKey,
    googleMapId,
  });
};

export default function Index() {
  const { page, apiUrl, googleApiKey, googleMapId, slug } = useLoaderData<{
    page: SkyscannerAPIContentPageResponse;
    apiUrl: string;
    slug: string;
    googleApiKey: string;
    googleMapId: string;
  }>();

  return (
    <Layout apiUrl={apiUrl}>
      <Components
        apiUrl={apiUrl}
        list={page.fields.components}
        googleApiKey={googleApiKey}
        googleMapId={googleMapId}
        slug={slug}
      />
    </Layout>
  );
}
