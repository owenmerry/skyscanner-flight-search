import React, { useRef, ReactNode } from "react";
import useStickyScroll from "./helpers/use-sticky-scroll";

import layoutStyles from "./three-column-layout.styles.css";

export function links() {
  return [{ rel: "stylesheet", href: layoutStyles }];
}

interface ThreeColumnLayoutProps {
  children: [ReactNode, ReactNode, ReactNode];
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContentRef = useRef<HTMLDivElement>(null);

  useStickyScroll(sidebarRef, sidebarContentRef);

  return (
    <div className="flex min-h-screen">
      <aside
        ref={sidebarRef}
        className="flex-shrink-0 w-1/4 bg-gray-200 p-4 max-h-screen overflow-auto"
      >
        <div ref={sidebarContentRef} className="sidebar-content">
          {children[0]}
        </div>
      </aside>
      <main className="flex-grow bg-gray-100 p-4 overflow-auto max-h-screen">
        {children[1]}
      </main>
      <aside className="flex-shrink-0 w-1/4 bg-gray-300 p-4">
        {children[2]}
      </aside>
    </div>
  );
};

export default ThreeColumnLayout;
