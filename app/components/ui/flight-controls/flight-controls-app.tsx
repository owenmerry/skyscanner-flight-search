import { useState } from "react";
import type { ReactNode } from "react";
import type { Query, QueryPlace } from "~/types/search";
import type { Place } from "~/helpers/sdk/place";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import { Drawer } from "@mui/material";
import { getDateYYYYMMDDToDisplay, getTripDays } from "~/helpers/date";
import { ExploreSearchForm } from "./components/explore-search-form";
import { FlightsSearchForm } from "./components/flight-search-form";
import Dropdown from "../dropdown/dropdown-default";
import { DirectionsSearchForm } from "./components/directions-search-form";
import { EverywhereSearchForm } from "./components/everywhere-search-form";

const convertQuerytoQueryPlace = (query: Query): QueryPlace | null => {
  const fromPlace = getPlaceFromEntityId(query.from);
  const toPlace = getPlaceFromEntityId(query.to);
  if (!fromPlace || !toPlace) return null;
  const queryPlace: QueryPlace = {
    from: fromPlace,
    to: toPlace,
    depart: query.depart,
    return: query.return,
  };

  return queryPlace;
};

const FlightControlsDrawer: React.FC<{ children: ReactNode }> = ({
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
      <div
        className="text-primary-700 font-bold cursor-pointer"
        onClick={toggleDrawer(true)}
      >
        Modify
      </div>

      <Drawer
        PaperProps={{
          sx: { borderTopLeftRadius: "16px", borderTopRightRadius: "16px" },
        }}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <div className="dark">
          <div className="max-h-[80vh]">
            <div className="dark:bg-gray-900 dark:text-white">{children}</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

interface SearchLabelsProps {
  onChange: (form: SearchForm) => void;
  selected: SearchForm;
}
const SearchLabels = ({ onChange, selected }: SearchLabelsProps) => {
  const [buttonText, setButtonText] = useState("Flights");
  return (
    <div className="gap-2 mb-2 sm:mb-0">
      <Dropdown
        buttonText={buttonText}
        items={[
          {
            label: "Flights",
            onClick: () => {
              onChange("flights");
              setButtonText("Flights");
            },
          },
          {
            label: "Explore",
            onClick: () => {
              onChange("explore");
              setButtonText("Explore");
            },
          },
          {
            label: "Everywhere",
            onClick: () => {
              onChange("everywhere");
              setButtonText("Everywhere");
            },
          },
          {
            label: "Directions",
            onClick: () => {
              onChange("directions");
              setButtonText("Directions");
            },
          },
        ]}
      />
    </div>
  );
};

export type SearchForm = "flights" | "explore" | "directions" | "everywhere";
export interface FlightControlsAppProps {
  apiUrl?: string;
  buttonLoading?: boolean;
  flightDefault?: Query;
  showPreviousSearches?: boolean;
  onSearch?: (query: QueryPlace) => void;
  onChange?: (query: QueryPlace) => void;
  useForm?: boolean;
  selected?: SearchForm;
  rounded?: boolean;
  from?: Place;
  hideFlightFormOnMobile?: boolean;
  showFlightDetails?: boolean;
  showBackground?: boolean;
}
export const FlightControlsApp = ({
  apiUrl = "",
  buttonLoading = true,
  flightDefault,
  showPreviousSearches = true,
  onSearch,
  from,
  useForm,
  selected = "flights",
  rounded = false,
  hideFlightFormOnMobile = true,
  showFlightDetails = true,
  showBackground = true,
}: FlightControlsAppProps) => {
  const [form, setForm] = useState<SearchForm>(selected);
  const flightDefaultPlace =
    (flightDefault && convertQuerytoQueryPlace(flightDefault)) || null;
  return (
    <div
      className={`${
        showBackground
          ? "bg-white dark:bg-slate-800 border-slate-300 border-b dark:border-0"
          : ""
      } ${rounded ? "rounded-2xl" : ""}`}
    >
      <div className="mx-auto max-w-screen-xl lg:px-12 px-4 sm:py-4 sm:px-4">
        <div className={`${showBackground ? "p-4 sm:p-1" : ""} flex`}>
          {showFlightDetails ? (
            <div className="flex-1">
              {flightDefaultPlace ? (
                <div className="sm:flex gap-6">
                  <div>
                    <span className="font-bold">
                      {flightDefaultPlace?.from.name}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold">
                      {flightDefaultPlace?.to.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {getDateYYYYMMDDToDisplay(
                        flightDefaultPlace?.depart,
                        "ddd, D MMM"
                      )}{" "}
                    </span>
                    {flightDefaultPlace?.return ? (
                      <>
                        to{" "}
                        <span className="font-bold">
                          {getDateYYYYMMDDToDisplay(
                            flightDefaultPlace.return,
                            "ddd, D MMM"
                          )}
                        </span>{" "}
                        <span className="italic text-sm">
                          (
                          {getTripDays(
                            flightDefaultPlace.depart,
                            flightDefaultPlace.return
                          )}{" "}
                          day
                          {getTripDays(
                            flightDefaultPlace.depart,
                            flightDefaultPlace.return
                          ) === 1
                            ? ""
                            : "s"}
                          )
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                <div className="font-bold">{from?.name} to Everywhere</div>
              )}
            </div>
          ) : (
            ""
          )}
          <div className={`${showFlightDetails ? "sm:hidden" : "hidden"}`}>
            <FlightControlsDrawer>
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold mb-4">Change Search</h2>
                <SearchLabels
                  selected={form}
                  onChange={(form) => setForm(form)}
                />
                {form === "flights" ? (
                  <FlightsSearchForm
                    apiUrl={apiUrl}
                    buttonLoading={buttonLoading}
                    flightDefault={flightDefault}
                    showPreviousSearches={showPreviousSearches}
                    onSearch={onSearch}
                    onChange={onSearch}
                    from={from}
                    hasBackground={false}
                  />
                ) : (
                  ""
                )}
                {form === "explore" ? (
                  <ExploreSearchForm
                    apiUrl={apiUrl}
                    flightDefault={flightDefault}
                    from={from}
                    hasBackground={false}
                  />
                ) : (
                  ""
                )}
                {form === "everywhere" ? (
                  <EverywhereSearchForm
                    apiUrl={apiUrl}
                    flightDefault={flightDefault}
                    from={from}
                    hasBackground={false}
                  />
                ) : (
                  ""
                )}
                {form === "directions" ? (
                  <DirectionsSearchForm
                    apiUrl={apiUrl}
                    flightDefault={flightDefault}
                  />
                ) : (
                  ""
                )}
              </div>
            </FlightControlsDrawer>
          </div>
        </div>
        <div
          className={`py-2 ${hideFlightFormOnMobile ? "hidden sm:block" : ""}`}
        >
          <div className="lg:flex items-center gap-2">
            <div>
              <SearchLabels
                selected={form}
                onChange={(form) => setForm(form)}
              />
            </div>
            <div>
              {form === "flights" ? (
                <FlightsSearchForm
                  apiUrl={apiUrl}
                  buttonLoading={buttonLoading}
                  flightDefault={flightDefault}
                  showPreviousSearches={showPreviousSearches}
                  onSearch={onSearch}
                  onChange={onSearch}
                  from={from}
                />
              ) : (
                ""
              )}
              {form === "explore" ? (
                <ExploreSearchForm
                  apiUrl={apiUrl}
                  flightDefault={flightDefault}
                  from={from}
                  hasBackground={false}
                />
              ) : (
                ""
              )}
              {form === "everywhere" ? (
                <EverywhereSearchForm
                  apiUrl={apiUrl}
                  flightDefault={flightDefault}
                  from={from}
                  hasBackground={false}
                />
              ) : (
                ""
              )}
              {form === "directions" ? (
                <DirectionsSearchForm
                  apiUrl={apiUrl}
                  flightDefault={flightDefault}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
