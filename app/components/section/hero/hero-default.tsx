import { Link } from "@remix-run/react";
import type { Query } from "~/types/search";
import { FlightControlsApp } from "~/components/ui/flight-controls/flight-controls-app";

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
export const Text = () => {
  return (
    <div>
      {" "}
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-8xl text-white">
        Explore the World
      </h1>
      <p className="mb-8 text-lg font-normallg:text-xl sm:px-16 xl:px-48 text-white">
        Find your perfect flight or holiday package with our unique traveler
        first features.
      </p>
      <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <Link
          to="/explore"
          className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
        >
          Explore
          <svg
            className="ml-2 -mr-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

interface NewFeatureProps {
  text?: string;
  url?: string;
}
export const NewFeature = ({
  text = "See our new feature",
  url,
}: NewFeatureProps) => {
  return (
    <a
      href={url}
      className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-white hover:bg-gray-200  rounded-full dark:bg-gray-800 dark:text-white  dark:hover:bg-gray-700"
      role="alert"
    >
      <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
        New
      </span>{" "}
      <span className="text-sm font-medium">{text}</span>
      <svg
        className="ml-2 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
};

interface HeroDefaultProps {
  newFeature?: string;
  newFeatureURL?: string;
  apiUrl?: string;
  showText?: boolean;
  buttonLoading?: boolean;
  flightDefault?: Query;
}

export const HeroDefault = ({
  newFeature,
  newFeatureURL,
  apiUrl,
  showText = true,
  buttonLoading = false,
  flightDefault,
}: HeroDefaultProps) => {
  return (
    <section className="relative overflow-visible">
      <div className="bg-[url('/images/hero/landscape02.jpg')] bg-top md:bg-top bg-cover bg-no-repeat absolute top-0 left-0 w-[100%] h-[150%] z-0">
        <Overlay />
        <Gradient />
      </div>
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {newFeature ? <NewFeature text={newFeature} url={newFeatureURL} /> : ``}
        {showText ? <Text /> : ``}
        <FlightControlsApp
          apiUrl={apiUrl}
          buttonLoading={buttonLoading}
          flightDefault={flightDefault}
          useForm
          rounded
          hideFlightFormOnMobile={false}
          showFlightDetails={false}
        />
      </div>
    </section>
  );
};
