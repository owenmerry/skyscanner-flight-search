import type { Place } from "~/helpers/sdk/place";

interface MarketingHeroProps {
  country: Place;
}
export const MarketingHero = ({ country }: MarketingHeroProps) => {
  return (
    <div>
      <div className="text-[1.5rem]">Explore</div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-8xl xl:text-[10rem] dark:text-white">
        {country.name}
      </h1>
    </div>
  );
};
