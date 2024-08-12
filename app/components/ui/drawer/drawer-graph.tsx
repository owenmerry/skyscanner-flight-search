import { Drawer } from "@mui/material";
import { ReactNode, useState } from "react";
import { Button } from "../button/button";

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
      <a
        className="text-primary-700 font-bold cursor-pointer"
        onClick={toggleDrawer(true)}
      >
        Price Trends
      </a>
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
            <div className="dark:bg-gray-900">
              <div className="pb-16">{children}</div>
            </div>
            <div className="fixed bottom-0 left-0 w-full p-4 shadow-t-sm z-10">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  secondary
                  text="Clear filters"
                  onClick={() => {
                    onClear && onClear();
                    setOpen(false);
                  }}
                />
                <Button text="Show results" onClick={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
