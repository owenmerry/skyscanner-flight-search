import { useState } from "react";

interface PanelTopProps {
  title: string;
  detailsTitle: string;
  children: React.ReactNode;
  childrenTop: React.ReactNode;
  icon?: React.ReactNode;
  open?: boolean;
}

export const PanelTop: React.FC<PanelTopProps> = ({ title, children, open = false, childrenTop, detailsTitle, icon }) => {
  const [show, setShow] = useState(open);
  return (
    <div className="mb-4 border border-slate-100 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm hover:drop-shadow-md">
      <h2>
        <div
          className="font-bold items-center text-xl justify-between w-full p-5 text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
        >
          {icon} {title}
        </div>
      </h2>
      {childrenTop ? (
        <div className="border-t dark:border-gray-700 border-slate-100">{childrenTop}</div>
      ) : ''}
      <div>
        <div
          className="flex cursor-pointer font-bold items-center justify-between w-full p-5 text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 border-t dark:border-gray-700 border-slate-100"
          onClick={() => setShow(!show)}
        >
          <span>{detailsTitle}</span>
          <svg
            data-accordion-icon=""
            className={`w-3 h-3 ${!show ? `rotate-180` : ''} shrink-0 transition`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5 5 1 1 5"
            />
          </svg>
        </div>
      </div>
      {show ? (
        <div className="border-t dark:border-gray-700 border-slate-100">{children}</div>
      ) : ''}
    </div>
  );
};
