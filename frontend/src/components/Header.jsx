"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const MobileMenu = lazy(() => import("./mobilemenu"));

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rankings", href: "/ranks" },
  { name: "Check your Score", href: "/upload" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Or use a router to navigate
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Resumify</span>
            <img
              alt="Resumify Logo"
              src="/applicant.png"
              className="h-8 w-auto"
            />
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12 items-center">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
          {isLoggedIn ? (
            <>
              <a
                href="/jobPost"
                className="ml-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Post Job
              </a>
              {/* Uncomment below to enable logout button */}
              {isLoggedIn && (
                <a
                  href="/myjobs"
                  className="text-sm font-semibold text-gray-900"
                >
                  My Jobs
                </a>
              )}

              {
                <button
                  onClick={handleLogout}
                  className="ml-4 text-sm font-semibold text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              }
            </>
          ) : (
            <a
              href="/login"
              className="ml-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Login
            </a>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <Suspense
          fallback={<div className="p-6 text-center">Loading menu...</div>}
        >
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </Suspense>
      )}
    </header>
  );
}
