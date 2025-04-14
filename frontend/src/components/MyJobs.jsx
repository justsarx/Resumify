"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "antd";
import axios from "axios";

const Header = lazy(() => import("./header"));

const backendUrl = import.meta.env.VITE_API_URL;

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshingJobId, setRefreshingJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { message: "Please login to view your jobs." } });
      return;
    }

    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/jobs/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { message: "Your session has expired. Please login again." } });
      } else {
        setError("Failed to fetch jobs. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCandidates = async (jobId) => {
    try {
      setRefreshingJobId(jobId);
      const response = await axios.get(`${backendUrl}/api/resumes/refresh_candidates/?job_id=${jobId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      
      // Update the candidates for the specific job
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, candidates: response.data } 
            : job
        )
      );
    } catch (err) {
      setError("Failed to refresh candidates. Please try again later.");
    } finally {
      setRefreshingJobId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/jobs/${jobId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError("Failed to delete job. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
          <Header />
        </Suspense>
        <div className="relative isolate px-6 pt-14 lg:px-120">
          <div className="text-center">Loading your jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
        <Header />
      </Suspense>

      <div className="relative isolate px-6 pt-24 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Job Postings</h2>
            <Link
              to="/jobpost"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Post New Job
            </Link>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">You haven't posted any jobs yet.</p>
              <Link
                to="/jobpost"
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.company_name} • {job.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.job_type} • Posted on{" "}
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRefreshCandidates(job.id)}
                          disabled={refreshingJobId === job.id}
                          className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                            refreshingJobId === job.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-500"
                          }`}
                        >
                          {job.candidates && job.candidates.length > 0
                            ? refreshingJobId === job.id
                              ? "Refreshing..."
                              : "Refresh Candidates"
                            : refreshingJobId === job.id
                            ? "Finding Candidates..."
                            : "Find Candidates"}
                        </button>
                        <Link to={`/edit-job/${job.id}`}>
                          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="rounded-md px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        Matching Candidates
                      </h4>
                      {job.candidates && job.candidates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {job.candidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {candidate.candidate_name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {candidate.email}
                                    </p>
                                    <div className="mt-3">
                                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                                        Matching Score: {Math.round(candidate.matching_score * 100)}%
                                      </span>
                                    </div>
                                    {candidate.exact_matches && candidate.exact_matches.length > 0 && (
                                      <div className="mt-3">
                                        <span className="text-sm font-medium text-gray-900">Matching Skills:</span>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                          {candidate.exact_matches.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                              {skill}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Last Updated:{" "}
                                    {new Date(candidate.last_updated).toLocaleString()}
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button
                                    onClick={() => window.open(`mailto:${candidate.email}?subject=Regarding Your Application`)}
                                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                  >
                                    Contact Candidate
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No matching candidates found.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
