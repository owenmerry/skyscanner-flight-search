import { Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { FlightControlsApp } from "../flight-controls/flight-controls-app";

interface SearchControlsDrawer {
  children: ReactNode;
  onClear?: () => void;
  apiUrl?: string;
  anchor?: "top" | "bottom";
}

export const SearchControlsDrawer: React.FC<SearchControlsDrawer> = ({ children, onClear, apiUrl = "", anchor="top" }) => {
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
        onClick={toggleDrawer(true)}
      >{children}
      </div>
      <Drawer
        PaperProps={{
          sx: {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          },
        }}
        anchor={anchor}
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <div className="dark">
          <div className="max-h-[80vh]">
            <div className="dark:bg-slate-900 dark:text-white">
              <div className="p-4 pb-6">
              <h2 className="text-2xl font-bold mb-4 mx-4">Search</h2>
              <FlightControlsApp
                apiUrl={apiUrl}
                hideFlightFormOnMobile={false}
                showFlightDetails={false}
                showBackground={false}
              />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
