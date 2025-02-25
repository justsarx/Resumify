'use client'

import PropTypes from 'prop-types'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
export default function Modal({ score, review, onClose }) {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all max-w-md w-full">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
              <DialogTitle as="h3" className="ml-2 text-lg font-medium text-gray-900">
                Resume Analysis
              </DialogTitle>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                <strong>Score:</strong> {score}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <strong>Review:</strong> {review}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none"
              >
                <Link to="/ranks" >Check your rank
                </Link>
                
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

Modal.propTypes = {
  score: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
