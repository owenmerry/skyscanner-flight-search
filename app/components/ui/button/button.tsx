export interface ButtonProps {
  text: string;
  link?: string;
  secondary?: boolean;
  onClick?: () => void;
}

export const Button = ({ text, link, onClick, secondary }: ButtonProps) => {
  return (
    <a
      className={`cursor-pointer lg:col-span-2 justify-center md:w-auto text-white ${
        secondary
          ? "bg-slate-500 hover:bg-slate-600 focus:ring-primary-300 dark:bg-slate-500 dark:hover:bg-slate-700 dark:focus:ring-primary-800"
          : "bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      } focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
      href={link}
      onClick={onClick}
    >
      {text}
    </a>
  );
};
