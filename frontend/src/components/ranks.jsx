"use client";

import Header from "./Header";
import { useState, useEffect } from "react";
import axios from "axios";

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
        const sortedResumes = [...response.data].sort(
          (a, b) => b.score - a.score
        );
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
    <div className="bg-white">
      <Header />

      <div className="relative isolate px-6 pt-24 lg:px-120">
        {loading ? (
          <p className="text-center text-gray-500">Loading resumes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {resumes.map((resume) => (
              <li
                key={resume.id || resume.email} // Use a unique identifier
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    alt="Candidate"
                    src="https://img.icons8.com/3d-fluency/94/user-shield.png"
                    className="size-12 flex-none rounded-full bg-gray-50"
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold text-gray-900">
                      {resume.candidate_name}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {resume.email}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm text-gray-900">{resume.score}</p>
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <p className="text-xs text-gray-500">
                      {new Date(resume.upload_date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                      {" | "}
                      {new Date(resume.upload_date).toLocaleTimeString(
                        "en-GB",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                    <p></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Ranks;
