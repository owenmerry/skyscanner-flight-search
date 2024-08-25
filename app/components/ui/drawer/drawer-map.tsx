import { Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BsGrid3X3Gap } from "react-icons/bs";

interface MapDrawerProps {
  children: ReactNode;
  onClear?: () => void;
  onLoaded?: (value: (value: boolean) => void) => void;
}

export const MapDrawer: React.FC<MapDrawerProps> = ({ children, onClear, onLoaded }) => {
  const [open, setOpen] = useState(false);
  type ToggleDrawer = (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;

  const toggleDrawer: ToggleDrawer = (open) => () => {
    setOpen(open);
  };
  onLoaded && onLoaded(setOpen)
  

  return (
    <div className="dark">
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 z-50">
      <div
        className="text-white bg-blue-600 py-3 px-4 rounded-full font-bold text-sm whitespace-nowrap cursor-pointer flex items-center gap-2 hover:bg-blue-700 shadow-lg"
        onClick={toggleDrawer(true)}
        >
          <div className="">
            <FaMapMarkedAlt className="text-xl" />
          </div>
        View map
      </div>
            </div>

      <Drawer
        PaperProps={{
          sx: {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            backgroundColor: '',
          },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <div className="min-h-screen">
          <div className="pb-16">{children}</div>
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 z-50">
      <div
        className="text-white bg-blue-600 py-3 px-4 rounded-full font-bold text-sm whitespace-nowrap cursor-pointer flex items-center gap-2 hover:bg-blue-700 shadow-lg"
        onClick={toggleDrawer(false)}
        >
          <div>
            <BsGrid3X3Gap className="text-xl" />
          </div>
        Show List
      </div>
            </div>
        </div>
      </Drawer>
    </div>
  );
};
