export const FooterDefault = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          flights.owenmerry.com
        </a>
        <p className="my-6 text-gray-500 dark:text-gray-400">
          Explore and find your perfect flight or holiday package with our
          unique traveler first features.
        </p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="/" className="mr-4 hover:underline md:mr-6 ">
              Home
            </a>
          </li>
          <li>
            <a href="/explore" className="mr-4 hover:underline md:mr-6">
              Explore
            </a>
          </li>
          <li>
            <a href="/flight-search" className="mr-4 hover:underline md:mr-6 ">
              Flights
            </a>
          </li>
          <li>
            <a href="/news" className="mr-4 hover:underline md:mr-6">
              News
            </a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
         
        </span>
      </div>
    </footer>
  );
};
