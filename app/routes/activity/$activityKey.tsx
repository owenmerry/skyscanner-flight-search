import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getPlaceFromIata, type Place } from "~/helpers/sdk/place";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
import { ActivityLocations } from "~/components/section/activities/activity-locations";
import { HeroExplore } from "~/components/section/hero/hero-explore";
import { getImages } from "~/helpers/sdk/query";
import { ImagesDefault } from "~/components/section/images/images-default";

export const loader: LoaderFunction = async ({ params }) => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const activityKey = params.activityKey || "";

  const activityImages = await getImages({
    apiUrl,
    query: activityKey,
  });

  return json({
    activityKey,
    apiUrl,
    googleApiKey,
    activityImages,
  });
};

export default function SEOAnytime() {
  const { activityKey, activityImages } = useLoaderData<{
    activityKey: string;
    activityImages: string[];
  }>();
  console.log(activityImages);
  const from = getFromPlaceLocalOrDefault() || getPlaceFromIata("LHR");
  if (!from) return;

  return (
    <Layout selectedUrl="/explore">
      <HeroExplore
        title={activityKey}
        backgroundImage={activityImages}
        showFlightControls={false}
      />
      <ActivityLocations name={activityKey} from={from} />
      <ImagesDefault images={activityImages} />
    </Layout>
  );
}
