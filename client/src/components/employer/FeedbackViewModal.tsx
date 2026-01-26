import React, { useEffect, useState } from "react";
import { interviewFeedbackApi } from "../../features/interviewRound/interviewRoundApi";
import { toast } from "react-toastify";
import {
  Close as CloseIcon,
  Star,
  StarBorder,
  Person,
} from "@mui/icons-material";
import { format } from "date-fns";

interface Props {
  roundId: string;
  onClose: () => void;
  isEmployer?: boolean;
}

const FeedbackViewModal: React.FC<Props> = ({
  roundId,
  onClose,
  isEmployer = false,
}) => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = isEmployer
          ? await interviewFeedbackApi.getFeedbackForRound(roundId)
          : await interviewFeedbackApi.getSharedFeedbackForRound(roundId);

        setFeedbackList(response.data.feedback || []);
      } catch (error: any) {
        toast.error("Failed to fetch feedback");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [roundId, isEmployer]);

  const renderStarRating = (value: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            {star <= value ? (
              <Star fontSize="small" />
            ) : (
              <StarBorder fontSize="small" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Interview Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No feedback available for this round.</p>
            </div>
          ) : (
            feedbackList.map((feedback, index) => (
              <div
                key={feedback.id || index}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Person className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {isEmployer ? feedback.provider.name : "Interviewer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {feedback.createdAt &&
                          format(new Date(feedback.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">
                        Overall Rating
                      </span>
                      {renderStarRating(feedback.rating)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Technical Skills
                    </p>
                    {renderStarRating(feedback.technicalSkills || 0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Communication
                    </p>
                    {renderStarRating(feedback.communication || 0)}
                  </div>
                </div>

                <div className="space-y-4">
                  {feedback.strengths && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Strengths
                      </label>
                      <p className="text-sm text-gray-700 mt-1 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                        {feedback.strengths}
                      </p>
                    </div>
                  )}
                  {feedback.comments && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        General Comments
                      </label>
                      <p className="text-sm text-gray-700 mt-1 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                        {feedback.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackViewModal;
