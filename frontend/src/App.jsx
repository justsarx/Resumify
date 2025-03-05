"use client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

// Dynamically import pages
const Home = lazy(() => import("./components/home"));
const Upload = lazy(() => import("./components/upload"));
const Ranks = lazy(() => import("./components/ranks"));

// Component to track route changes and trigger the loading bar
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// Add PropTypes for AnimatedPage to validate the children prop
AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const location = useLocation();
  return (
    <>
      <RouteChangeTracker />
      <Suspense fallback={<div className="p-4 text-center">Loading page...</div>}>
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
      </Suspense>
    </>
  );
}

// Wrap the App with Router at a higher level
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
