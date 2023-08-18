import { Place } from "~/helpers/sdk/place";
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
  backgroundImage?: string;
  title?: string;
  description?: string;
  apiUrl?: string;
  imagePlace?: Place;
}

export const HeroExplore = ({
  title,
  description,
  backgroundImage = "",
  apiUrl,
  imagePlace,
}: HeroPageProps) => {
  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage}&w=1500)` }}
      className={`relative bg-top md:bg-center bg-contain md:bg-cover bg-no-repeat`}
    >
      <Overlay />
      <Gradient />
      <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <div className="mb-10 lg:mb-16 text-white">
          <Text title={title} description={description} />
          {imagePlace ? <ImageDetails place={imagePlace} /> : ""}
        </div>
        <FlightControls apiUrl={apiUrl} />
      </div>
    </section>
  );
};
