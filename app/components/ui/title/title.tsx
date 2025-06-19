interface TitleProps {
  text: string;
}

export const Title = ({ text }: TitleProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
          />
        </svg>
      </div>
      <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        {text}
      </h2>
    </div>
  );
};
