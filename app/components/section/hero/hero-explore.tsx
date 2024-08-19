import type { Place } from "~/helpers/sdk/place";
import { FlightControls } from "../../ui/flight-controls/flight-controls-default";
import { useState } from "react";

export const Overlay = () => {
  return (
    <div className="opacity-50 bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
  );
};
export const Gradient = () => {
  return (
    <div className="bg-gradient-to-t from-gray-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
  );
};
interface TextProps {
  title?: string;
  description?: string;
}
export const Text = ({ title, description }: TextProps) => {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
        {title}
      </h1>
    </div>
  );
};
interface ImageDetailsProps {
  place: Place;
}
export const ImageDetails = ({ place }: ImageDetailsProps) => {
  return (
    <div>
      <p className="text-sm">
        Photo of{" "}
        <a className="underline" href={`/explore/${place.slug}`}>
          {place.name}
        </a>
      </p>
    </div>
  );
};

interface HeroPageProps {
  backgroundImage?: string | string[];
  title?: string;
  description?: string;
  apiUrl?: string;
  imagePlace?: Place;
  showFlightControls?: boolean;
}

export const HeroExplore = ({
  title,
  description,
  backgroundImage = [],
  apiUrl,
  imagePlace,
  showFlightControls = true,
}: HeroPageProps) => {
  const singleImage = typeof backgroundImage === "string";
  const multiImage = !singleImage;
  const [imageNum, setImageNum] = useState(0);

  const nextImage = () => {
    const newImageNum = imageNum + 1;
    const isReset = newImageNum >= backgroundImage.length - 1;

    setImageNum(isReset ? 0 : newImageNum);
  };
  const prevImage = () => {
    const newImageNum = imageNum - 1;
    const isReset = newImageNum <= 0;

    setImageNum(isReset ? backgroundImage.length - 1 : newImageNum);
  };

  return (
    <div className="relative">
      <section
        style={{
          backgroundImage: `url(${
            multiImage ? backgroundImage[imageNum] : backgroundImage
          }&w=1500)`,
        }}
        className={`relative bg-top md:bg-center bg-cover bg-no-repeat`}
      >
        <Overlay />
        <Gradient />
        <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
          <div className="mb-10 lg:mb-16 text-white">
            <Text title={title} description={description} />
            {imagePlace ? <ImageDetails place={imagePlace} /> : ""}
          </div>
          {showFlightControls ? <FlightControls apiUrl={apiUrl} /> : ""}
        </div>
        {multiImage ? (
          <div className="">
            <button
              type="button"
              className="sm:absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev=""
              ata-carousel-next=""
              onClick={prevImage}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white-800/30 group-hover:bg-white/50 dark:group-hover:bg-white-800/60 group-focus:ring-4 group-focus:ring-white/80 dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="sm:absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next=""
              onClick={nextImage}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white-800/30 group-hover:bg-white/50 dark:group-hover:bg-white-800/60 group-focus:ring-4 group-focus:ring-white/80 dark:group-focus:ring-white-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        ) : (
          ""
        )}
      </section>
    </div>
  );
};
