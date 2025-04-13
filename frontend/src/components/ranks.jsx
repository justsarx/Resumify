"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";

const Header = lazy(() => import("./Header"));

const backendUrl = import.meta.env.VITE_API_URL;

const Ranks = () => {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchResumes = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/resumes/`, {
          cancelToken: source.token,
        });
        // Sort data in descending order by score
        const sortedResumes = [...response.data].sort((a, b) => b.score - a.score);
        setResumes(sortedResumes);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Error fetching resumes.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();

    return () => {
      source.cancel("Component unmounted, request cancelled");
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
        <Header />
      </Suspense>

      {/* The wrapping container provides horizontal scrolling on smaller screens */}
      <div className="max-w-7xl mx-auto px-6 pt-24 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading resumes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : resumes.length === 0 ? (
          <p className="text-center text-gray-500">No resumes available.</p>
        ) : (
          <div className="min-w-full">
            {/* Header Row */}
            <div className="flex flex-row items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
              <div className="flex items-center gap-4">
                <span className="w-12" aria-hidden="true" />
                <span>Candidate</span>
              </div>
              <div className="flex flex-row items-center gap-6">
                <span>Score</span>
                <span>Uploaded On</span>
              </div>
            </div>

            {/* Data Rows */}
            <ul role="list" className="divide-y divide-gray-100">
              {resumes.map((resume) => (
                <li
                  key={resume.id || resume.email} // Unique identifier
                  className="flex flex-row items-center justify-between gap-4 py-4 px-4 hover:bg-gray-50 transition-colors duration-200 min-w-full"
                >
                  <div className="flex flex-row items-center gap-x-4 flex-shrink-0">
                    <img
                      alt={`${resume.candidate_name || "Candidate"}'s avatar`}
                      src="https://img.icons8.com/3d-fluency/94/user-shield.png"
                      className="h-12 w-12 rounded-full bg-gray-50"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {resume.candidate_name || "Unnamed Candidate"}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {resume.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-6 flex-grow justify-end">
                    <p className="text-sm font-bold text-gray-900">{resume.score}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(resume.upload_date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}{" "}
                      |{" "}
                      {new Date(resume.upload_date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ranks;
