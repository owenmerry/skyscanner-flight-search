import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { GameJackpot } from "~/components/section/game/jackpot/game-jackpot";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { useEffect } from "react";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { waitSeconds } from "~/helpers/utils";
import {
  getFlightLiveCreate,
  getFlightLivePoll,
} from "~/helpers/sdk/flight/flight-sdk";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "Presentation",
  });

  return {
    apiUrl,
    backgroundImage,
  };
};

export default function Index() {
  const { apiUrl, backgroundImage } = useLoaderData();
  const randomHeroImage = backgroundImage[0];

  useEffect(() => {
    runData();
  });

  const runData = async () => {
    const data = await skyscanner().indicative({
      apiUrl,
      query: {
        from: "95565050",
        to: "95673529",
        tripType: "return",
      },
      month: 12,
      year: 2023,
      groupType: "date",
    });
    const fromPlace = getPlaceFromEntityId("95565050");
    const toPlace = getPlaceFromEntityId("95673529");

    if ("error" in data.search || !fromPlace || !toPlace) return;

    console.log(data);

    const flight = await getFlightLiveCreate({
      apiUrl,
      query: {
        from: fromPlace,
        to: toPlace,
        depart: "2023-12-01",
        return: "2023-12-25",
      },
    });

    if ("error" in flight) return;

    console.log(data, flight);

    await waitSeconds(5);

    const flightPoll = await getFlightLivePoll({
      apiUrl,
      token: flight.sessionToken,
    });

    if ("error" in flightPoll) return;

    console.log(data, flightPoll);
  };

  return (
    <Layout selectedUrl="/news">
      <HeroSimple
        title="Presentation"
        text="Presentation showcase of features"
        backgroundImage={randomHeroImage}
      />
      <div className="text-center py-5">
        <h2 className="text-5xl mb-5 font-extrabold tracking-tight leading-none">
          Intro
        </h2>
        <h2 className="text-5xl mb-5 font-extrabold tracking-tight leading-none">
          Walk Through
        </h2>
        <h2 className="text-5xl mb-5 font-extrabold tracking-tight leading-none">
          Coding
        </h2>
        <h2 className="text-5xl mb-5 font-extrabold tracking-tight leading-none">
          How you can do it
        </h2>
      </div>
    </Layout>
  );
}
