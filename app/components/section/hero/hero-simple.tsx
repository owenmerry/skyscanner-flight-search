import { Link } from "@remix-run/react";
import { Query } from "~/types/search";
import { FlightControls } from "../../ui/flight-controls/flight-controls-default";

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

interface HeroNewsProps {
  title?: string;
  text?: string;
  backgroundImage?: string;
}

export const HeroSimple = ({ text, title, backgroundImage }: HeroNewsProps) => {
  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage}&w=1500)` }}
      className="relative bg-top bg-cover bg-no-repeat"
    >
      <Overlay />
      <Gradient />
      <div className="relative z-10 py-16 pb-0 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <Text title={title} text={text} />
      </div>
    </section>
  );
};
