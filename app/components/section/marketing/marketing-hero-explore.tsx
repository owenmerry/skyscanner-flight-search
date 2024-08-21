interface MarketingHeroExploreProps {}
export const MarketingHeroExplore = ({}: MarketingHeroExploreProps) => {
  return (
    <div className="py-12 sm:py-8">
      <div className="flex justify-center mb-2">
        <svg
          className="w-6 h-6 text-gray-800 dark:text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
          />
        </svg>
      </div>
      <div className="text-[1.5rem]">Explore</div>
      <h1 className="mb-4 text-6xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-8xl xl:text-[12rem] dark:text-white">
        Everywhere
      </h1>
      <div></div>
    </div>
  );
};
