import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { HeroNews } from "~/components/section/hero/hero-news";
import { getRandomNumber } from "~/helpers/utils";
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
    <Layout selectedUrl="/news">
      <HeroSimple
        title="Skyscanner Jackpot"
        text="Can you beat the Skyscanner price accuracy"
        backgroundImage={randomHeroImage}
      />
      <GameJackpot apiUrl={apiUrl} />
    </Layout>
  );
}
