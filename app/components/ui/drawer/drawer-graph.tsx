import { Drawer } from "@mui/material";
import { ReactNode, useState } from "react";
import { Button } from "../button/button";
import { SlGraph } from "react-icons/sl";

interface FiltersDrawer {
  children: ReactNode;
  onClear?: () => void;
}

export const GraphDrawer: React.FC<FiltersDrawer> = ({ children, onClear }) => {
  const [open, setOpen] = useState(false);
  type ToggleDrawer = (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;

  const toggleDrawer: ToggleDrawer = (open) => () => {
    setOpen(open);
  };

  return (
    <div>
      <div
        className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center whitespace-nowrap"
        onClick={toggleDrawer(true)}
      ><SlGraph className="mr-2" />
        Alternative Dates
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
            <div className="dark:bg-gray-900 dark:text-white">
              <div className="pb-16">{children}</div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
