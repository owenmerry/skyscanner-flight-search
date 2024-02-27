import { useEffect, useState } from "react";
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
}

export const HeroDynamic = ({
  apiUrl,
  text,
  title,
  imageSearchTerm,
  showGradient = true,
  showOverlay = true,
}: HeroProps) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    runGetBackgroundImage(imageSearchTerm);
  }, []);

  const runGetBackgroundImage = async (imageSearchTerm?: string) => {
    if (!apiUrl || !imageSearchTerm) return;
    const backgroundImage = await getImages({
      apiUrl,
      query: imageSearchTerm,
    });

    setImageUrl(backgroundImage[0]);
  };

  return (
    <section
      style={{ backgroundImage: `url(${imageUrl}&w=1500)` }}
      className="relative bg-top bg-cover bg-no-repeat"
    >
      {showOverlay ? <Overlay /> : ""}
      {showGradient ? <Gradient /> : ""}
      <div className="relative z-10 py-16 pb-0 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <Text title={title} text={text} />
      </div>
    </section>
  );
};
