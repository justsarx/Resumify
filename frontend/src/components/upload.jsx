"use client";

import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Alert } from "antd";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const Header = lazy(() => import("./header"));
const Modal = lazy(() => import("./modal"));

const backendUrl = import.meta.env.VITE_API_URL;

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [uploadStatus, setUploadStatus] = useState("");
  const [resumeScore, setResumeScore] = useState(null);
  const [resumeReview, setResumeReview] = useState(null);
  const [relevanceScore, setRelevanceScore] = useState(null);
  const [relevanceTips, setRelevanceTips] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !candidateName || !email || !jobTitle) {
      setUploadStatus("All fields are required!");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("resume_file", file);
    formData.append("candidate_name", candidateName);
    formData.append("email", email);
    formData.append("job_title", jobTitle); // ✅ new field

    setIsUploading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/resumes/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("Upload successful!");
      setResumeScore(response.data.score);
      setResumeReview(response.data.review);
      setRelevanceScore(response.data.relevance_score);
      setRelevanceTips(response.data.relevance_tips);

      setTimeout(() => setUploadStatus(""), 3000);
      setIsModalOpen(true);
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error:", error);
      setTimeout(() => setUploadStatus(""), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                {/* Username */}
                <div className="sm:col-span-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="janesmith"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="sm:col-span-4">
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-900">
                    Job Title You’re Applying For
                  </label>
                  <div className="mt-2">
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Data Analyst"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Upload */}
                <div className="col-span-full">
                  <Alert
                    message="Security & Privacy"
                    description="The content uploaded here is processed and deleted immediately. We do not store any data."
                    type="info"
                    closable
                  />
                  <br />
                  <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
                    Upload your Resume
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    {file ? (
                      <div className="text-center">
                        <PhotoIcon aria-hidden="true" className="mx-auto h-10 w-10 text-green-500" />
                        <p className="mt-4 text-sm text-gray-700">
                          File Uploaded: <span className="font-medium">{file.name}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                        <div className="mt-4 flex justify-center text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">PDF files only</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Email Field */}
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Link to="/">
              <button type="button" className="text-sm font-semibold text-gray-900">Cancel</button>
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isUploading ? "Uploading..." : uploadStatus || "Upload"}
            </button>
          </div>

          {/* Modal Result */}
          {isModalOpen && (
            <Suspense fallback={<div className="p-4 text-center">Loading modal...</div>}>
              <Modal
                onClose={closeModal}
                score={resumeScore}
                review={resumeReview}
                relevanceScore={relevanceScore}
                relevanceTips={relevanceTips}
              />
            </Suspense>
          )}
        </form>
        <br />
      </div>
    </div>
  );
};

export default ResumeUpload;
