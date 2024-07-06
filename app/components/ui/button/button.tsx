export interface ButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
}

export const Button = ({ text, link, onClick }: ButtonProps) => {
  return (
    <a
      className="cursor-pointer lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
      href={link}
      onClick={onClick}
    >
      {text}
    </a>
  );
};
