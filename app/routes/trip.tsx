import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { json } from "@remix-run/node";
import { Wrapper } from "~/components/ui/wrapper/wrapper.component";
import { TripTimeline } from "~/components/section/trip-timeline/trip-timeline.component";

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  return json({
    apiUrl,
    googleApiKey,
    googleMapId,
  });
};

export default function Index() {
  const { apiUrl } = useLoaderData<{
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
  }>();

  return (
    <Layout apiUrl={apiUrl}>
      <Wrapper>
        <TripTimeline />
      </Wrapper>
    </Layout>
  );
}
