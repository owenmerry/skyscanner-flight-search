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
export const NavigationWebsite = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Explore
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Use are different search features to make a perfect search for your
            next holiday plans.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Article
            label="Live"
            title="Flight Search"
            description="Use our live search to make a your own search"
            to="/search"
          />
          <Article
            label="History"
            labelBg="yellow"
            title="Explore"
            description="Explore all the locations and be inspired"
            to="/explore"
          />
          <Article
            label="Live"
            labelBg="yellow"
            title="Holidays"
            description="Explore holidays for the year"
            to="/holidays"
          />
          {/* <Article label="Live" title="Weekend Flight Search" description="Use our live search to make a your own search" to='/weekend' />
                    <Article label="Live" title="Week Flight Search" description="Use our live search to make a your own search" to='/week' />
                    <Article label="Live" title="Year Flight Search" description="Use our live search to make a your own search" to='/year' />
                    <Article label="Saved" labelBg="yellow" title="Search by Location" description="Use our live search to make a your own search" to='/explore' /> */}
        </div>
      </div>
    </section>
  );
};
