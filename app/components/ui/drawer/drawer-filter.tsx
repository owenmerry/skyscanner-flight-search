import { Drawer } from "@mui/material";
import { ReactNode, useState } from "react";
import { Button } from "../button/button";

export const FiltersDrawer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
        Filters
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
        ModalProps={{ keepMounted: false }} // Better open performance on mobile
      >
        <div className="max-h-[90vh]">
          <div className="pb-16">{children}</div>
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-t-lg">
            <div className="grid grid-cols-2 gap-2">
              <Button text="Clear filters" onClick={() => setOpen(false)} />
              <Button text="Show results" onClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
