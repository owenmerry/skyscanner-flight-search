import { getPlaceFromIata } from "~/helpers/sdk/place";
import type { Query } from "~/types/search";

const LOCAL_STORAGE_FROM = "from";
const LOCAL_STORAGE_SEARCHES = "searches";
const LOCAL_STORAGE_DARK_MODE = "dark-mode";

export const setFromLocationLocalStorage = (value: string) => {
  localStorage.setItem(LOCAL_STORAGE_FROM, value);
};

export const getFromLocationLocalStorage = () => {
  return localStorage.getItem(LOCAL_STORAGE_FROM);
};

export const getFromPlaceLocalOrDefault = () => {
  let fromLocation = null;
  if (typeof window !== "undefined") {
    fromLocation = getFromLocationLocalStorage();
  }
  if (!fromLocation) {
    fromLocation = "LHR";
  }

  return getPlaceFromIata(fromLocation);
};

export const addSearchToLocalStorage = (value: Query) => {
  if (typeof window === "undefined") return;
  const previous = getSearchFromLocalStorage();
  previous.push(value);
  localStorage.setItem(LOCAL_STORAGE_SEARCHES, JSON.stringify(previous));
};

export const getSearchFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  const searches =
    localStorage.getItem(LOCAL_STORAGE_SEARCHES) || JSON.stringify([]);
  const json: Query[] = JSON.parse(searches);

  return json;
};

export const removeAllSearchFromLocalStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_SEARCHES, JSON.stringify([]));
};

export const setDarkModeToLocalStorage = (value: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_DARK_MODE, JSON.stringify(value));
};

export const getDarkModeFromLocalStorage = () => {
  if (typeof window === "undefined") return true;
  const darkModeRaw =
    localStorage.getItem(LOCAL_STORAGE_DARK_MODE) || JSON.stringify(true);
  const darkMode: boolean = JSON.parse(darkModeRaw);

  return darkMode;
};
