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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<IndicativeQuotesSDK[]>();
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

  const runSearch = async () => {
    const indicativeSearch = await skyscanner().indicative({
      apiUrl,
      query: {
        from: from.entityId,
        to: "anywhere",
        tripType: "return",
      },
      groupType: "month",
      month: Number(moment().format("MM")),
      year: Number(moment().format("YYYY")),
      endMonth: Number(moment().add(10, "months").format("MM")),
      endYear: Number(moment().add(10, "months").format("YYYY")),
    });

    if ("error" in indicativeSearch.search) return;

    setSearch(indicativeSearch.quotes);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    runSearch();
  }, []);

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
      {search ? (
        <MapPlanner
          level="everywhere"
          from={from}
          googleApiKey={googleApiKey}
          googleMapId={googleMapId}
          search={search}
        />
      ) : (
        ""
      )}
    </Layout>
  );
}
