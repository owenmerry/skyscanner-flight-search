import { useEffect, RefObject } from "react";

const useStickyScroll = (
  sidebarRef: RefObject<HTMLElement>,
  sidebarContentRef: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleScroll = () => {
      const sidebar = sidebarRef.current;
      const sidebarContent = sidebarContentRef.current;
      if (!sidebar || !sidebarContent) return;

      const sidebarHeight = sidebarContent.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sidebarTop = sidebar.offsetTop;

      if (sidebarHeight < windowHeight) {
        sidebar.classList.add("sticky-top");
        sidebar.classList.remove("sticky-bottom");
      } else {
        if (scrollTop + windowHeight >= sidebarHeight + sidebarTop) {
          sidebar.classList.add("sticky-bottom");
          sidebar.classList.remove("sticky-top");
        } else if (scrollTop <= sidebarTop) {
          sidebar.classList.add("sticky-top");
          sidebar.classList.remove("sticky-bottom");
        } else {
          sidebar.classList.remove("sticky-top", "sticky-bottom");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sidebarRef, sidebarContentRef]);
};

export default useStickyScroll;
