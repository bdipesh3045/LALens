import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import HomeNavbar from "./HomeNavbar";
import HomeFooter from "./HomeFooter";

function ShellLayout() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  return (
    <div className="home-layout home-layout--app-shell">
      <HomeNavbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="home-app-main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <HomeFooter />
    </div>
  );
}

export default ShellLayout;
