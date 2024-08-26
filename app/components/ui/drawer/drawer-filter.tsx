import { Drawer } from "@mui/material";
import { ReactNode, useState } from "react";
import { Button } from "../button/button";
import { IoFilterSharp } from "react-icons/io5";

interface FiltersDrawer {
  children: ReactNode;
  onClear?: () => void;
}

export const FiltersDrawer: React.FC<FiltersDrawer> = ({
  children,
  onClear,
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
      <div
        className="justify-center cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 inline-flex items-center"
        onClick={toggleDrawer(true)}
      ><IoFilterSharp className="mr-2" />
        Filters
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
        <div className="max-h-[80vh]">
          <div className="pb-16">{children}</div>
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-t-sm">
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
      </Drawer>
    </div>
  );
};
