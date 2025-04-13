"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "antd";
import axios from "axios";

const Header = lazy(() => import("./Header"));

const backendUrl = import.meta.env.VITE_API_URL;

const EditJobPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    company_name: "",
    location: "",
    job_type: "FT",
    description: "",
    skills_required: "",
    salary_range: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        setJob(response.data);
      } catch (err) {
        setError("Failed to fetch job details. Please try again.");
      }
    };

    fetchJob();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    
    if (!job.title.trim()) {
      errors.title = "Job title is required";
    }
    
    if (!job.company_name.trim()) {
      errors.company_name = "Company name is required";
    }
    
    if (!job.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (!job.description.trim()) {
      errors.description = "Job description is required";
    } else if (job.description.length < 50) {
      errors.description = "Job description should be at least 50 characters long";
    }
    
    if (!job.skills_required.trim()) {
      errors.skills_required = "Required skills are required";
    } else {
      const skillsList = job.skills_required.split(',').map(skill => skill.trim());
      if (skillsList.some(skill => !skill)) {
        errors.skills_required = "Invalid skills format. Please use comma-separated values";
      }
    }
    
    if (job.salary_range.trim()) {
      const salaryRegex = /^\d+$/;
      if (!salaryRegex.test(job.salary_range)) {
        errors.salary_range = "Please enter a valid salary amount (numbers only)";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
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
      await axios.put(`${backendUrl}/api/jobs/${id}/`, job, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      navigate("/myjobs");
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        if (typeof errors === "object") {
          setError(Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; "));
        } else if (typeof errors === "string") {
          setError(errors);
        }
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
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
        <div className="mx-auto max-w-2xl">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold text-gray-900">Edit Job Post</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update the job details below.
              </p>

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
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                    Job Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={job.title}
                      onChange={handleChange}
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.title ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-900">
                    Company Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="company_name"
                      id="company_name"
                      value={job.company_name}
                      onChange={handleChange}
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.company_name ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.company_name && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.company_name}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={job.location}
                      onChange={handleChange}
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.location ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.location && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.location}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-900">
                    Job Type
                  </label>
                  <div className="mt-2">
                    <select
                      name="job_type"
                      id="job_type"
                      value={job.job_type}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    >
                      <option value="FT">Full-time</option>
                      <option value="PT">Part-time</option>
                      <option value="CT">Contract</option>
                      <option value="FL">Freelance</option>
                      <option value="IN">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-900">
                    Salary (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      id="salary"
                      name="salary"
                      type="text"
                      value={job.salary_range}
                      onChange={handleChange}
                      placeholder="e.g., 600000"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.salary_range ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.salary_range && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.salary_range}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="skills_required" className="block text-sm font-medium text-gray-900">
                    Required Skills (comma-separated)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="skills_required"
                      id="skills_required"
                      value={job.skills_required}
                      onChange={handleChange}
                      placeholder="e.g., React, Python, SQL"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.skills_required ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.skills_required && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.skills_required}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Job Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="description"
                      id="description"
                      rows={5}
                      value={job.description}
                      onChange={handleChange}
                      className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 ${
                        validationErrors.description ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.description && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={() => navigate("/myjobs")}
                    className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500"
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
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

export default EditJobPost; 