import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getPlaceFromIata } from "~/helpers/sdk/place";
import type { Place } from "~/helpers/sdk/place";
import moment from "moment";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useEffect, useState } from "react";
import type { IndicativeQuotesSDK } from "~/helpers/sdk/indicative/indicative-functions";
import { Box, LinearProgress } from "@mui/material";
import { MapPlanner } from "~/components/section/map/map-planner";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleMapId = process.env.GOOGLE_MAP_ID || "";

  //query
  const from = getPlaceFromIata("LON");
  if (!from) return {};

  return {
    apiUrl,
    from,
    googleApiKey,
    googleMapId,
  };
};

export default function Index() {
  const [loading, setLoading] = useState(false);
  const {
    apiUrl,
    from,
    googleApiKey,
    googleMapId,
  }: {
    apiUrl: string;
    googleApiKey: string;
    googleMapId: string;
    from: Place;
  } = useLoaderData();

  return (
    <Layout selectedUrl="/planner" apiUrl={apiUrl}>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            sx={{
              backgroundColor: "rgba(0,0,0,0)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1b64f2",
              },
            }}
          />
        </Box>
      ) : (
        ""
      )}
        <MapPlanner
          level="everywhere"
          from={from}
          googleApiKey={googleApiKey}
          googleMapId={googleMapId}
          apiUrl={apiUrl}
        />
    </Layout>
  );
}
