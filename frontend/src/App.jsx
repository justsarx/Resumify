"use client";
import React from "react";
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
const JobPost = lazy(() => import("./components/jobpost"));
const Register = lazy(() => import("./components/register"));
const Login = lazy(() => import("./components/login"));
const MyJobs = lazy(() => import("./components/myjobs"));
const EditJobPost = lazy(() => import("./components/editjobpost"));

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

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const location = useLocation();
  return (
    <>
      <RouteChangeTracker />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
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
      </ErrorBoundary>
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
