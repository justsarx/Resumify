"use client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import EditJobPost from "./components/EditJobPost";

// Dynamically import pages
const Home = lazy(() => import("./components/Home"));
const Upload = lazy(() => import("./components/Upload"));
const Ranks = lazy(() => import("./components/Ranks"));
const JobPost = lazy(() => import("./components/JobPost")); // ✅ NEW
const Register = lazy(() => import("./components/Register")); // ✅ NEW
const Login = lazy(() => import("./components/Login")); // ✅ NEW
const MyJobs = lazy(() => import("./components/MyJobs")); // ✅ NEW

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
            <Route
              path="/jobpost"
              element={
                <AnimatedPage>
                  <JobPost />
                </AnimatedPage>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />
            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              }
            />
            <Route
              path="/myjobs"
              element={
                <AnimatedPage>
                  <MyJobs />
                </AnimatedPage>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <AnimatedPage>
                  <EditJobPost />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
