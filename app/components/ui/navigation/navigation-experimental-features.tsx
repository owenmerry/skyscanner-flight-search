import { Link } from "@remix-run/react";
import { AiOutlineExperiment } from "react-icons/ai";

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
    <article className="p-4 bg-blue-800 border-blue-700 rounded-lg border  shadow-md ">
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
      <h2 className="my-2 text-2xl font-bold tracking-tight text-white">
        <Link to={to}>{title}</Link>
      </h2>
      <p className="mb-4 font-light text-blue-200">
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
      className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
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
export const NavigationExperimentalFeatures = () => {
  return (
    <section className="bg-blue-600">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="flex justify-center mb-4 text-xl">
        <AiOutlineExperiment />
        </div>
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
            Experimental Features
          </h2>
          <p className="font-light text-blue-200 sm:text-xl ">
            Collection of features that are still in development and are not fully ready, but you can have a look.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Article
            label="Feature"
            title="Trips"
            description="Save your trips for the year and see how much you have spent."
            to="/trips"
          />
          <Article
            label="Feature"
            title="Trip"
            description="UI for a trip planner with multiple slides and steps."
            to="/trip"
          />
          <Article
            label="Feature"
            title="Meet Up"
            description="A feature for finding a good location when everyone is coming from different places."
            to="/meet-up"
          />
          <Article
            label="Feature"
            title="What To Do"
            description="A feature for finding things to do in a city."
            to="/what-to-do"
          />
          <Article
            label="Feature"
            title="HACK: What To Do"
            description="A feature for finding things to do in a city."
            to="hack/what-to-do"
          />
        </div>
      </div>
    </section>
  );
};
