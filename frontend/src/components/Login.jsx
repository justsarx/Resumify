"use client";

import { useState, Suspense } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert } from "antd";
import axios from "axios";
import Header from "./Header";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message || "";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!form.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!form.password.trim()) {
      errors.password = "Password is required";
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login/`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/myjobs");
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;
        if (errorData.error === 'Invalid credentials') {
          setError("Invalid username or password. Please try again.");
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          setError("Login failed. Please check your credentials and try again.");
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
              <h2 className="text-base font-semibold text-gray-900">Login to Your Account</h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter your credentials to access your account.
              </p>
              <br />

              {redirectMessage && (
                <Alert
                  message="Notice"
                  description={redirectMessage}
                  type="info"
                  showIcon
                  className="mt-4"
                />
              )}

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

                <div className="col-span-full flex items-center justify-between gap-x-6">
                  <Link to="/register">
                    <button
                      type="button"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Create an account
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
                    {isLoading ? "Logging in..." : "Login"}
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

export default Login;
