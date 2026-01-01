import React from "react";
import { X, Star, User, MessageSquare, Calendar, Shield } from "lucide-react";
import type { FeedbackViewModalProps } from "../../types/feedback/feedback.types";

export interface Feedback {
  userId: any;
  userName: string;
  userAvatar?: string;
  userType: string;
  rating: number;
  status: string;
  isFeatured: boolean;
  comment: string;
  createdAt?: string;
}

const FeedbackViewModal: React.FC<FeedbackViewModalProps> = ({
  feedback,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !feedback) return null;

  const userName =
    typeof feedback.userId === "object"
      ? feedback.userId.name
      : feedback.userName;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 translate-y-0 opacity-100 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-800 p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <div className="flex items-center gap-1 mb-2">
            <MessageSquare className="text-white/90" size={20} />
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
              Customer Feedback
            </h3>
          </div>
          <h2 className="text-2xl font-bold text-white">Feedback Details</h2>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[65vh] overflow-y-auto">
          {/* User Info Card */}
          <div className="relative mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-indigo-100">
                <User className="text-white w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-xl mb-1">
                  {userName}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-semibold text-indigo-600 shadow-sm border border-indigo-100">
                    <Shield size={12} />
                    {feedback.userType}
                  </span>
                  {feedback.createdAt && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                      <Calendar size={12} />
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Card */}
          <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Rating
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < feedback.rating
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-1 text-2xl font-bold text-gray-900">
                  {feedback.rating}
                  <span className="text-lg text-gray-400">/5</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status & Featured Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                Status
              </span>
              <StatusBadge status={feedback.status} />
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                Featured
              </span>
              <FeaturedBadge isFeatured={feedback.isFeatured} />
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Feedback Message
              </span>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="absolute top-4 left-4 text-gray-300 text-5xl leading-none font-serif">
                "
              </div>
              <div className="relative z-10 pl-8 text-gray-700 leading-relaxed text-base">
                {feedback.comment}
              </div>
              <div className="absolute bottom-4 right-4 text-gray-300 text-5xl leading-none font-serif rotate-180">
                "
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    approved: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-600",
      text: "text-white",
      icon: "✓",
    },
    rejected: {
      bg: "bg-gradient-to-r from-red-500 to-rose-600",
      text: "text-white",
      icon: "✕",
    },
    pending: {
      bg: "bg-gradient-to-r from-amber-400 to-orange-500",
      text: "text-white",
      icon: "⏱",
    },
  }[status] || {
    bg: "bg-gradient-to-r from-gray-400 to-gray-500",
    text: "text-white",
    icon: "•",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-tight shadow-md ${config.bg} ${config.text}`}
    >
      <span className="text-base">{config.icon}</span>
      {status}
    </span>
  );
};

const FeaturedBadge = ({ isFeatured }: { isFeatured: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-tight shadow-md ${
      isFeatured
        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
    }`}
  >
    <span className="text-base">{isFeatured ? "★" : "☆"}</span>
    {isFeatured ? "Featured" : "Not Featured"}
  </span>
);

export default FeedbackViewModal;
