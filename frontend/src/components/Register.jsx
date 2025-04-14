"use client";

import { useState, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "antd";
import axios from "axios";
import Header from "./header";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (form.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(form.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(form.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(form.password)) {
      errors.password = "Password must contain at least one number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;
        if (errorData.username) {
          setError("Username is already taken. Please choose another one.");
        } else if (errorData.email) {
          setError("Email is already registered. Please use a different email or login.");
        } else if (errorData.password) {
          setError("Password is too weak. Please use a stronger password.");
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          setError("Registration failed. Please check your input and try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
        <Header />
      </Suspense>
      <div className="relative isolate px-6 pt-24 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold text-gray-900">Create an Account</h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill in your details to create a new account.
              </p>
              <br />

              {error && (
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  className="mt-4"
                />
              )}

              <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.username ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.username && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.email ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.password ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.confirmPassword ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full flex items-center justify-between gap-x-6">
                  <Link to="/login">
                    <button
                      type="button"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Already have an account?
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500"
                    }`}
                  >
                    {isLoading ? "Creating account..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
