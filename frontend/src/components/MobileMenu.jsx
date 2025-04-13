"use client";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rankings", href: "/ranks" },
  { name: "Check your Score", href: "/upload" },
];

export default function MobileMenu({ isOpen, onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-50" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Resumify</span>
            <img alt="Resumify Logo" src="applicant.png" className="h-8 w-auto" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
              {isLoggedIn ? (
                <a
                  href="/job-post"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-indigo-600 hover:bg-gray-50"
                >
                  Post Job
                </a>
              ) : (
                <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-indigo-600 hover:bg-gray-50"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
