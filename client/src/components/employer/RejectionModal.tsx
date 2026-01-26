import React, { useState } from "react";
import { toast } from "react-toastify";
import { Close as CloseIcon, Warning } from "@mui/icons-material";

interface Props {
  candidateName: string;
  onClose: () => void;
  onSuccess: () => void;
  updateApplicationStatus: (newStatus: string, data?: any) => Promise<void>;
}

const RejectionModal: React.FC<Props> = ({
  candidateName,
  onClose,
  onSuccess,
  updateApplicationStatus,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [shareFeedback, setShareFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    if (shareFeedback && !rejectionFeedback.trim()) {
      toast.error("Please provide feedback to share with the candidate");
      return;
    }

    setSubmitting(true);

    try {
      await updateApplicationStatus("rejected", {
        rejectionReason,
        rejectionFeedback: shareFeedback ? rejectionFeedback : undefined,
      });

      toast.success("Application rejected successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to reject application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Reject Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              You are about to reject{" "}
              <strong className="text-gray-900">{candidateName}</strong>'s
              application.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a reason</option>
              <option value="Qualifications do not match requirements">
                Qualifications do not match requirements
              </option>
              <option value="Selected another candidate">
                Selected another candidate
              </option>
              <option value="Position filled">Position filled</option>
              <option value="Insufficient experience">
                Insufficient experience
              </option>
              <option value="Skills mismatch">Skills mismatch</option>
              <option value="Cultural fit concerns">
                Cultural fit concerns
              </option>
              <option value="Salary expectations mismatch">
                Salary expectations mismatch
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="shareFeedback"
              checked={shareFeedback}
              onChange={(e) => setShareFeedback(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label
                htmlFor="shareFeedback"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Share constructive feedback with candidate
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Providing feedback helps candidates improve and shows
                professionalism
              </p>
            </div>
          </div>

          {shareFeedback && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Provide constructive, professional feedback that will help the candidate in their job search..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This feedback will be included in the rejection email sent to
                the candidate
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <Warning
              className="text-yellow-600 flex-shrink-0 mt-0.5"
              fontSize="small"
            />
            <div>
              <strong className="text-yellow-800 text-sm">Important:</strong>
              <p className="text-yellow-700 text-sm mt-1">
                This action cannot be undone. The candidate will receive an
                email notification about the rejection.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Rejecting..." : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
