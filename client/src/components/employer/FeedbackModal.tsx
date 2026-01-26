import React, { useState } from "react";
import { interviewFeedbackApi } from "../../features/interviewRound/interviewRoundApi";
import { toast } from "react-toastify";
import { Close as CloseIcon, Star, StarBorder } from "@mui/icons-material";

interface Props {
  roundId: string;
  applicationId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const FeedbackModal: React.FC<Props> = ({
  roundId,
  applicationId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    rating: 3,
    strengths: "",
    weaknesses: "",
    comments: "",
    recommendation: "proceed",
    technicalSkills: 3,
    communication: 3,
    problemSolving: 3,
    culturalFit: 3,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comments.trim()) {
      toast.error("Please provide comments");
      return;
    }

    setSubmitting(true);

    try {
      await interviewFeedbackApi.submitFeedback(roundId, {
        ...formData,
        applicationId,
      });

      toast.success("Feedback submitted successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (
    value: number,
    onChange: (value: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-yellow-400 hover:scale-110 transition-transform"
          >
            {star <= value ? <Star /> : <StarBorder />}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold">Submit Interview Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Overall Assessment
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              {renderStarRating(formData.rating, (value) =>
                setFormData({ ...formData, rating: value }),
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recommendation *
              </label>
              <select
                value={formData.recommendation}
                onChange={(e) =>
                  setFormData({ ...formData, recommendation: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="proceed">Proceed to Next Round</option>
                <option value="hold">Hold Decision</option>
                <option value="reject">Reject</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Detailed Ratings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Skills
              </label>
              {renderStarRating(formData.technicalSkills, (value) =>
                setFormData({ ...formData, technicalSkills: value }),
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication
              </label>
              {renderStarRating(formData.communication, (value) =>
                setFormData({ ...formData, communication: value }),
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Solving
              </label>
              {renderStarRating(formData.problemSolving, (value) =>
                setFormData({ ...formData, problemSolving: value }),
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultural Fit
              </label>
              {renderStarRating(formData.culturalFit, (value) =>
                setFormData({ ...formData, culturalFit: value }),
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Written Feedback
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strengths
              </label>
              <textarea
                value={formData.strengths}
                onChange={(e) =>
                  setFormData({ ...formData, strengths: e.target.value })
                }
                placeholder="What did the candidate do well?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Areas for Improvement
              </label>
              <textarea
                value={formData.weaknesses}
                onChange={(e) =>
                  setFormData({ ...formData, weaknesses: e.target.value })
                }
                placeholder="What could be improved?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments *
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Overall assessment and any other observations..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
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
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
