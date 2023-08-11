import { FlightControls } from "../flight-controls/flight-controls-default";

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
      <h1 className="mb-2 text-2xl font-bold tracking-tight leading-none md:text-2xl lg:text-4xl text-white">
        {title}
      </h1>
      <p className="mb-2">{description}</p>
    </div>
  );
};

interface HeroPageProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
  apiUrl?: string;
}

export const HeroExplore = ({
  title,
  description,
  backgroundImage = "",
  apiUrl,
}: HeroPageProps) => {
  return (
    <section
      style={{ backgroundImage: `url(${backgroundImage}&w=1500)` }}
      className={`relative bg-cover bg-center`}
    >
      <Overlay />
      <Gradient />
      <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12">
        <Text title={title} description={description} />
        <div className="mt-6">
          <FlightControls apiUrl={apiUrl} />
        </div>
      </div>
    </section>
  );
};
