import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { HeroDefault } from "~/components/section/hero/hero-default";
import { NavigationWebsite } from "~/components/ui/navigation/navigation-website";
import { Layout } from "~/components/ui/layout/layout";
import { getImages } from "~/helpers/sdk/query";
import { getRandomNumber } from "~/helpers/utils";
import { GameJackpot } from "~/components/section/game/jackpot/game-jackpot";
import { HeroSimple } from "~/components/section/hero/hero-simple";
import { ImagesDefault } from "~/components/section/images/images-default";
import { Place, getPlaceFromSlug } from "~/helpers/sdk/place";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { useState } from "react";

export const loader: LoaderFunction = async () => {
  const apiUrl = process.env.SKYSCANNER_APP_API_URL || "";
  const placesSDK = skyscanner().geo();

  const backgroundImage = await getImages({
    apiUrl,
    query: "valentines",
  });

  return {
    countries: placesSDK.countries,
    apiUrl,
    backgroundImage,
  };
};

export const Overlay = () => {
  return (
    <div className="opacity-0 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
  );
};
export const Gradient = () => {
  return (
    <div className="bg-gradient-to-t from-gray-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[20%] z-0"></div>
  );
};
export const Text = ({ title, text }: { title?: string; text?: string }) => {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
        {title}
      </h1>
      <p className="mb-8 text-lg font-extrabold lg:text-2xl sm:px-16 xl:px-48 text-pink-300">
        {text}
      </p>
    </div>
  );
};

export default function Index() {
  const { apiUrl, backgroundImage, countries } = useLoaderData<{
    countries: Place[];
    apiUrl: string;
    backgroundImage: string[];
  }>();
  const randomHeroImage = backgroundImage[1];
  const randomCountry =
    countries[getRandomNumber(countries.length)] || countries[0];
  const [showValentine, setShowValentine] = useState(false);

  const handleShowValentine = () => {
    setShowValentine(true);
  };

  return (
    <Layout>
      <section className="relative bg-top bg-cover bg-no-repeat min-h-screen bg-pink-700">
        <Overlay />
        <Gradient />
        <div className="relative z-10 py-16 pb-0 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
          {!showValentine ? (
            <Text
              title={"💖💖 Skyscanner Valentines 💖💖"}
              text={"What country is your secret admirer?"}
            />
          ) : (
            ""
          )}
          {!showValentine ? (
            <div
              onClick={handleShowValentine}
              className="inline-block p-8 m-5 px-10 bg-pink-800 text-white font-extrabold rounded-2xl cursor-pointer"
            >
              See Who Your Valentine is
            </div>
          ) : (
            ""
          )}
          {showValentine ? (
            <>
              <div className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
                <div>Your Valentine is </div>
                <div className="text-8xl my-5 text-pink-300">
                  {randomCountry.name}
                </div>
                <div>You beautiful person</div>
                <div>😘😘</div>
              </div>
              <ImagesDefault
                images={randomCountry.images}
                title={`Photos of ${randomCountry.name}`}
              />
              <a
                href={`/explore/${randomCountry.slug}`}
                className="inline-block p-8 m-5 px-10 bg-pink-800 text-white font-extrabold rounded-2xl cursor-pointer"
              >
                See more on {randomCountry.name} your valentine 💖
              </a>
            </>
          ) : (
            ""
          )}
        </div>
      </section>
    </Layout>
  );
}
