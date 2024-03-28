import {
  getDateFormated,
  getDateYYYYMMDDToDisplay,
  getTripDaysLengthFromYYYYMMDD,
} from "~/helpers/date";
import { Query } from "~/types/search";
import { getFromPlaceLocalOrDefault } from "~/helpers/local-storage";
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
interface TextProps {
  flightDefault: Query;
}
export const Text = ({ flightDefault }: TextProps) => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight leading-none md:text-2xl lg:text-3xl text-white">
        {flightDefault.fromText} to {flightDefault.toText}
      </h1>
      <p className="mb-2 text-white">
        {getDateYYYYMMDDToDisplay(flightDefault.depart, "Do MMMM")}{" "}
        {flightDefault.return ? (
          <>
            to {getDateYYYYMMDDToDisplay(flightDefault.return, "Do MMMM")}{" "}
            <span className="italic text-sm">
              (
              {getTripDaysLengthFromYYYYMMDD(
                flightDefault.depart,
                flightDefault.return
              )}
              )
            </span>
          </>
        ) : (
          ""
        )}
      </p>
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

interface HeroPageProps {
  newFeature?: string;
  newFeatureURL?: string;
  apiUrl?: string;
  showText?: boolean;
  buttonLoading?: boolean;
  flightDefault?: Query;
  backgroundImage?: string;
  showFlightForm?: boolean;
}

export const HeroPage = ({
  newFeature,
  newFeatureURL,
  apiUrl,
  showText = true,
  showFlightForm = true,
  buttonLoading = false,
  flightDefault,
  backgroundImage = "",
}: HeroPageProps) => {
  const fromPlace = getFromPlaceLocalOrDefault();
  if (fromPlace === false) return <></>;

  const flightQuery = flightDefault
    ? flightDefault
    : {
        from: fromPlace.entityId,
        fromIata: fromPlace.iata,
        fromText: fromPlace.name,
        to: "95673529", //Dublin
        toIata: "DUB", //Dublin
        toText: "Dublin", //Dublin
        depart: getDateFormated(1),
        return: getDateFormated(3),
        tripType: "return",
      };

  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage}&w=1500)` }}
      className={`relative bg-top md:bg-center bg-cover bg-no-repeat`}
    >
      <Overlay />
      <Gradient />
      <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        {newFeature ? <NewFeature text={newFeature} url={newFeatureURL} /> : ``}
        {showText ? <Text flightDefault={flightQuery} /> : ``}
        {showFlightForm ? (
          <FlightControls
            apiUrl={apiUrl}
            buttonLoading={buttonLoading}
            flightDefault={flightDefault}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
