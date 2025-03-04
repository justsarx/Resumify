"use client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./components/home";
import Upload from "./components/upload";
import Ranks from "./components/ranks";

// A component to track route changes and trigger the loading bar
function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location]);

  return null;
}

// A wrapper component to add transitions to each page
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}    // starting state
      animate={{ opacity: 1, y: 0 }}     // animate to
      exit={{ opacity: 0, y: -20 }}      // exit state
      transition={{ duration: 0.5 }}     // adjust the duration as needed
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  
  return (
    <>
      <RouteChangeTracker />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
          <Route
            path="/ranks"
            element={
              <AnimatedPage>
                <Ranks />
              </AnimatedPage>
            }
          />
          <Route
            path="/upload"
            element={
              <AnimatedPage>
                <Upload />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

// Wrap the App with Router at a higher level if necessary
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
