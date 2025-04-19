"use client";

import { useState, lazy, Suspense, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert } from "antd";
import axios from "axios";

const Header = lazy(() => import("./Header"));

const backendUrl = import.meta.env.VITE_API_URL;

const JobPost = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [salary, setSalary] = useState("");

  const [status, setStatus] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { message: "Please login to post a job." } });
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!title.trim()) {
      errors.title = "Job title is required";
    }
    
    if (!company.trim()) {
      errors.company = "Company name is required";
    }
    
    if (!location.trim()) {
      errors.location = "Location is required";
    }
    
    if (!description.trim()) {
      errors.description = "Job description is required";
    } else if (description.length < 50) {
      errors.description = "Job description should be at least 50 characters long";
    }
    
    if (!skills.trim()) {
      errors.skills = "Required skills are required";
    } else {
      const skillsList = skills.split(',').map(skill => skill.trim());
      if (skillsList.some(skill => !skill)) {
        errors.skills = "Invalid skills format. Please use comma-separated values";
      }
    }
    
    if (salary.trim()) {
      const salaryRegex = /^\d+$/;
      if (!salaryRegex.test(salary)) {
        errors.salary = "Please enter a valid salary amount (numbers only)";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'company':
        setCompany(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'jobType':
        setJobType(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'skills':
        setSkills(value);
        break;
      case 'salary':
        setSalary(value);
        break;
      default:
        break;
    }
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please fix the validation errors before submitting.");
      return;
    }

    // Map frontend jobType selection to backend codes
    const jobTypeMapping = {
      "Full-time": "FT",
      "Part-time": "PT",
      Contract: "CT",
      Freelance: "FL",
      Internship: "IN",
    };
    const backendJobType = jobTypeMapping[jobType] || "FT";

    const jobData = {
      title,
      company_name: company,
      location,
      job_type: backendJobType,
      description,
      skills_required: skills,
      salary_range: salary,
    };

    try {
      setIsPosting(true);
      await axios.post(`${backendUrl}/api/jobs/`, jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      // Navigate to myjobs page after successful posting
      navigate("/myjobs");
      
    } catch (error) {
      let errorMessage = "Failed to post job.";
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === "object") {
          errorMessage = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ");
        } else if (typeof errors === "string") {
          errorMessage = errors;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      setStatus(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white">
      <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
        <Header />
      </Suspense>

      <div className="relative isolate px-6 pt-14 lg:px-120">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold text-gray-900 pt-8">
                Post a New Job
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the job details to post a new opportunity.
              </p>

              {status && (
                <Alert
                  message={status.includes("success") ? "Success" : "Error"}
                  description={status}
                  type={status.includes("success") ? "success" : "error"}
                  showIcon
                  className="mt-4"
                />
              )}

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Title */}
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                    Job Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={title}
                      onChange={handleChange('title')}
                      placeholder="e.g., Software Engineer"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.title ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div className="sm:col-span-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-900">
                    Company
                  </label>
                  <div className="mt-2">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={company}
                      onChange={handleChange('company')}
                      placeholder="e.g., Infosys"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.company ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.company && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.company}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="sm:col-span-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={location}
                      onChange={handleChange('location')}
                      placeholder="e.g., Mumbai"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.location ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.location && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.location}</p>
                    )}
                  </div>
                </div>

                {/* Job Type */}
                <div className="sm:col-span-4">
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-900">
                    Job Type
                  </label>
                  <div className="mt-2">
                    <select
                      id="jobType"
                      name="jobType"
                      value={jobType}
                      onChange={handleChange('jobType')}
                      className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                      <option>Freelance</option>
                    </select>
                  </div>
                </div>

                {/* Salary */}
                <div className="sm:col-span-4">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-900">
                    Salary (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      id="salary"
                      name="salary"
                      type="text"
                      value={salary}
                      onChange={handleChange('salary')}
                      placeholder="e.g., 600000"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.salary ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.salary && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.salary}</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="col-span-full">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-900">
                    Required Skills (comma-separated)
                  </label>
                  <div className="mt-2">
                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      value={skills}
                      onChange={handleChange('skills')}
                      placeholder="e.g., React, Python, SQL"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                        validationErrors.skills ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.skills && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.skills}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-full">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Job Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={description}
                      onChange={handleChange('description')}
                      placeholder="Describe the job role, responsibilities, and perks..."
                      className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 ${
                        validationErrors.description ? 'outline-red-500' : 'outline-gray-300'
                      } placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm`}
                    />
                    {validationErrors.description && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Link to="/">
              <button
                type="button"
                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPosting}
              className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isPosting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isPosting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPost;
