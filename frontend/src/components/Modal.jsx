"use client";

import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import JobRecommendations from "./JobRecommendations";

export default function Modal({ score, review, relevanceScore, relevanceTips, resumeId, onClose }) {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all max-w-4xl w-full">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
              <DialogTitle as="h3" className="ml-2 text-lg font-medium text-gray-900">
                Resume Analysis
              </DialogTitle>
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <p>
                <strong>Score:</strong> {score}
              </p>
              <p>
                <strong>Review:</strong> {review}
              </p>

              {relevanceScore !== null && (
                <>
                  <p>
                    <strong>Job Relevance Score:</strong> {relevanceScore}
                  </p>
                  <p>
                    <strong>Relevance Tips:</strong> {relevanceTips}
                  </p>
                </>
              )}
            </div>

            {resumeId && (
              <div className="mt-8">
                <JobRecommendations resumeId={resumeId} />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Link to="/ranks">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none"
                >
                  Check your rank
                </button>
              </Link>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  score: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  relevanceScore: PropTypes.number,
  relevanceTips: PropTypes.string,
  resumeId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};
