import { getAllParents } from "~/helpers/sdk/data";
import { getPlaceType, type Place } from "~/helpers/sdk/place";

interface MarketingHeroProps {
  place: Place;
}
export const MarketingHero = ({ place }: MarketingHeroProps) => {
  const parents = getAllParents(place.parentId);
  return (
    <div className="py-12 sm:py-8">
      <div className="text-[1.5rem]">Explore</div>
      <h1 className="mb-4 text-6xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-8xl xl:text-[10rem] dark:text-white">
        {place.name}
      </h1>
      <div>
            <a
              href={`/explore`}
              className="underline hover:no-underline"
            >
              Explore
            </a>
        {parents.reverse().map((parent, key) => (
          <>
              <span> / </span>
            <a
              href={`/${getPlaceType(parent)}/${parent.slug}`}
              key={parent.entityId}
              className="underline hover:no-underline"
              >
              {parent.name}
            </a>
          </>
        ))}
        <span> / </span>
        <span>{place.name}</span>
      </div>
    </div>
  );
};
