import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  employerName: string;
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  reason,
  employerName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Rejection Reason – {employerName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Body */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 mb-6 border-l-4 border-red-500 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
