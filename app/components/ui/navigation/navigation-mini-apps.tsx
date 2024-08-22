import { Link } from "@remix-run/react";

interface ArticleProps {
  image?: string;
  label?: string;
  title?: string;
  description?: string;
  to: string;
  labelBg?: string;
}
export const Article = ({
  image,
  label = "page",
  title = "title",
  description = "description",
  labelBg = "purple",
  to,
}: ArticleProps) => {
  return (
    <article className="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {image ? (
        <Link to={to}>
          <img
            className="mb-5 rounded-lg"
            src={image}
            alt={`${label} navigation image`}
          />
        </Link>
      ) : (
        ``
      )}
      <span
        className={` bg-${labelBg}-100 text-${labelBg}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-${labelBg}-200 dark:text-${labelBg}-900`}
      >
        {label}
      </span>
      <h2 className="my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link to={to}>{title}</Link>
      </h2>
      <p className="mb-4 font-light text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div>
        <Button to={to} />
      </div>
    </article>
  );
};

interface ButtonProps {
  to: string;
}
export const Button = ({ to }: ButtonProps) => {
  return (
    <Link
      to={to}
      className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
    >
      View
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
  );
};
export const NavigationMiniApps = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="flex justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-blue-600"
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
              d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"
            />
          </svg>
        </div>
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Games and Mini Apps
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Collection of Games and Mini apps to make search for holidays fun.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Article
            label="Game"
            title="Jackpot"
            description="Try to guess if a Explore Price is still accurate by guessing higher, lower or the same."
            to="/jackpot"
          />
          <Article
            label="App"
            labelBg="yellow"
            title="Valentines App"
            description="Find out who your valentine with this app"
            to="/valentines"
          />
        </div>
      </div>
    </section>
  );
};
