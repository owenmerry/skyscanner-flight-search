import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { GameJackpot } from "~/components/section/game/jackpot/game-jackpot";
import { HeroSimple } from "~/components/section/hero/hero-simple";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";

  const backgroundImage = await getImages({
    apiUrl,
    query: "Jackpot",
  });

  return {
    apiUrl,
    backgroundImage,
  };
};

export default function Index() {
  const { apiUrl, backgroundImage } = useLoaderData();
  const randomHeroImage = backgroundImage[1];

  return (
    <Layout apiUrl={apiUrl}>
      <HeroSimple
        title="Skyscanner Jackpot"
        text="Can you beat the Skyscanner price accuracy"
        backgroundImage={randomHeroImage}
      />
      <GameJackpot apiUrl={apiUrl} />
    </Layout>
  );
}
