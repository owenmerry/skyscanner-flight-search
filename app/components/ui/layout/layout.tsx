import { useState } from 'react';
import { HeaderDefault } from '~/components/ui/header/header-default';
import { FooterDefault } from '~/components/ui/footer/footer-default';
import { setDarkModeToLocalStorage, getDarkModeFromLocalStorage } from '~/helpers/local-storage';

interface LayoutProps {
    children: React.ReactNode,
    selectedUrl?: string
}
export const Layout = ({ children, selectedUrl }: LayoutProps) => {
    const [darkMode, setDarkMode] = useState(getDarkModeFromLocalStorage());
    const handleDarkModeChange = () => {
        const darkModeUpdated = !darkMode;
        setDarkMode(darkModeUpdated);
        setDarkModeToLocalStorage(darkModeUpdated);
    }
    return (
        <div className={`${darkMode ? 'dark' : ''}`}>
            <HeaderDefault
                selectedUrl={selectedUrl}
                isDarkMode={darkMode}
                onDarkModeClick={handleDarkModeChange}
            />
            {children}
            <FooterDefault />
        </div>
    );
}