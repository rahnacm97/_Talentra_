import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { submitFeedback } from "../../../thunks/feedback.thunk";
import { type FeedbackModalProps } from "../../../types/feedback/feedback.types";
import type { RootState } from "../../../app/store";
import { toast } from "react-toastify";

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPublic] = useState(true);
  const [hover, setHover] = useState(0);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { loading } = useAppSelector((state: RootState) => state.feedback);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to provide feedback");
      return;
    }

    const result = await dispatch(
      submitFeedback({
        rating,
        comment,
        isPublic,
      }),
    );

    if (submitFeedback.fulfilled.match(result)) {
      toast.success("Feedback submitted successfully!");
      onClose();
      setRating(0);
      setComment("");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Share your Feedback
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium text-gray-700">
              How would you rate your experience with Talentra?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform active:scale-95"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    className={`${
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-32"
              placeholder="Tell us what you like or how we can improve..."
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"></div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg active:scale-[0.98] ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
              }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
