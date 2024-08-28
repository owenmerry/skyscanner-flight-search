import { Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";

interface DatesDrawer {
  children: ReactNode[];
}

export const DatesDrawer: React.FC<DatesDrawer> = ({ children }) => {
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
      <div className="cursor-pointer sm:hidden" onClick={toggleDrawer(true)}>
        {children[0]}
      </div>
      <Drawer
        PaperProps={{
          sx: {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <div className="dark">
          <div className="max-h-[80vh]">
            <div className="dark:bg-gray-900 dark:text-white p-8">
              <div className="dark:text-white">{children[1]}</div>
              <div className="py-5">
                <div
                  className="px-5 py-2.5 text-center text-white rounded-lg inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={toggleDrawer(false)}
                >
                  Set Dates
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
