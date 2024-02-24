import { useState, useEffect } from "react";
import { HeaderDefault } from "~/components/ui/header/header-default";
import { FooterDefault } from "~/components/ui/footer/footer-default";
import {
  setDarkModeToLocalStorage,
  getDarkModeFromLocalStorage,
} from "~/helpers/local-storage";

interface LayoutProps {
  children: React.ReactNode;
  selectedUrl?: string;
}

export const Layout = ({ children, selectedUrl }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(getDarkModeFromLocalStorage());
  const localDarkMode = getDarkModeFromLocalStorage();

  const checkDarkMode = () => {
    if (localDarkMode === darkMode) return;

    setDarkMode(localDarkMode);
  };

  useEffect(() => {
    checkDarkMode();
  }, [darkMode, localDarkMode]);

  const handleDarkModeChange = () => {
    const darkModeUpdated = !darkMode;
    setDarkMode(darkModeUpdated);
    setDarkModeToLocalStorage(darkModeUpdated);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="hidden">{localDarkMode ? "dark" : "light"}</div>
      <HeaderDefault
        selectedUrl={selectedUrl}
        isDarkMode={darkMode}
        onDarkModeClick={handleDarkModeChange}
      />
      <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
        {children}
      </div>
      <FooterDefault />
    </div>
  );
};
