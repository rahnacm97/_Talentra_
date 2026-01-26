import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createInterviewRound } from "../../thunks/interviewRound.thunk";
import type { AppDispatch } from "../../app/store";
import { toast } from "react-toastify";
import { Close as CloseIcon } from "@mui/icons-material";

interface Props {
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  nextRoundNumber: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRoundModal: React.FC<Props> = ({
  applicationId,
  jobId,
  candidateId,
  employerId,
  nextRoundNumber,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    roundType: "technical",
    customRoundName: "",
    scheduledDate: "",
    duration: 60,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.scheduledDate) {
      toast.error("Please select a date and time");
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        createInterviewRound({
          applicationId,
          jobId,
          candidateId,
          employerId,
          roundNumber: nextRoundNumber,
          roundType: formData.roundType,
          customRoundName: formData.customRoundName || undefined,
          scheduledDate: formData.scheduledDate,
          duration: formData.duration,
          notes: formData.notes || undefined,
        }),
      ).unwrap();

      toast.success("Interview round created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create round");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">
            Schedule Interview Round {nextRoundNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Round Type *
            </label>
            <select
              value={formData.roundType}
              onChange={(e) =>
                setFormData({ ...formData, roundType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="technical">Technical Round</option>
              <option value="managerial">Managerial Round</option>
              <option value="hr">HR Round</option>
              <option value="behavioral">Behavioral Round</option>
              <option value="cultural">Cultural Fit</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {formData.roundType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Round Name *
              </label>
              <input
                type="text"
                value={formData.customRoundName}
                onChange={(e) =>
                  setFormData({ ...formData, customRoundName: e.target.value })
                }
                placeholder="e.g., System Design Round"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              min="15"
              max="180"
              step="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any special instructions or topics to cover..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Round"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoundModal;
