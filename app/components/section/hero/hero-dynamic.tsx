import { useEffect, useState } from "react";
import { FlightControls } from "~/components/ui/flight-controls/flight-controls-default";
import { getImages } from "~/helpers/sdk/query";

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
export const Text = ({ title, text }: { title?: string; text?: string }) => {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
        {title}
      </h1>
      <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-white">
        {text}
      </p>
    </div>
  );
};

interface HeroProps {
  apiUrl?: string;
  title?: string;
  text?: string;
  showGradient?: boolean;
  showOverlay?: boolean;
  imageSearchTerm?: string;
  showFlightControls?: boolean;
  showGallery?: boolean;
  fullHeight?: boolean;
}

export const HeroDynamic = ({
  apiUrl,
  text,
  title,
  imageSearchTerm,
  showGradient = true,
  showOverlay = true,
  showFlightControls = true,
  showGallery = true,
  fullHeight = false,
}: HeroProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string[]>([]);
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

  useEffect(() => {
    runGetBackgroundImage(imageSearchTerm);
  }, []);

  const runGetBackgroundImage = async (imageSearchTerm?: string) => {
    if (!apiUrl || !imageSearchTerm) return;
    const backgroundImage = await getImages({
      apiUrl,
      query: imageSearchTerm,
    });

    setBackgroundImage(backgroundImage);
  };

  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage[imageNum]}&w=1500)` }}
      className={`relative bg-top bg-cover bg-no-repeat ${
        fullHeight ? "min-h-screen" : ""
      }`}
    >
      {showOverlay ? <Overlay /> : ""}
      {showGradient ? <Gradient /> : ""}
      <div className="relative z-10 py-16 pb-0 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <Text title={title} text={text} />
        {showFlightControls ? <FlightControls apiUrl={apiUrl} /> : ""}
      </div>
      {showGallery ? (
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
  );
};
