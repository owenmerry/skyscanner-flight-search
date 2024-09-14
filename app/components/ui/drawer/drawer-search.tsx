import { Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";

interface JourneyDrawer {
  children: ReactNode[];
}

export const SearchDrawer: React.FC<JourneyDrawer> = ({ children }) => {
  const [open, setOpen] = useState(false);
  type ToggleDrawer = (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;

  const toggleDrawer: ToggleDrawer = (open) => () => {
    setOpen(open);
  };
  if (!children) return "";

  return (
    <div>
      <div className="cursor-pointer" onClick={toggleDrawer(true)}>{children[0]}</div>
      <Drawer
        PaperProps={{
          sx: {},
        }}
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <div className="dark">
          <div className="min-h-screen w-screen md:w-[80vw] dark:bg-gray-900">
            <Header onClose={() => setOpen(false)}>Search Details</Header>
            <div className="pb-16 dark:text-white">{children[1]}</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

const Header: React.FC<{ onClose: () => void; children: ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="flex items-center p-4 md:p-5 border-b rounded-t dark:border-gray-800 shadow-md dark:bg-slate-900 sticky w-full top-0 z-10">
    <button
      type="button"
      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
      data-modal-hide="static-modal"
      onClick={onClose}
    >
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12l4-4m-4 4 4 4"
        />
      </svg>
      <span className="sr-only">Close modal</span>
    </button>
    <h3 className="text-xl flex-1 font-semibold text-gray-900 dark:text-white text-center">
      {children}
    </h3>
  </div>
);
