import React, { useState } from "react";
import type { InterviewRound } from "../../types/interview/interview.types";
import {
  CalendarToday,
  Schedule,
  Comment,
  Link as LinkIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import FeedbackModal from "./FeedbackModal";
import FeedbackViewModal from "./FeedbackViewModal";
import { toast } from "react-toastify";
import { useVideoCall } from "../../contexts/VideoCallContext";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  VideoCall as VideoIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import {
  updateRoundStatus,
  rescheduleInterviewRound,
  cancelInterviewRound,
} from "../../thunks/interviewRound.thunk";
import { InterviewScheduleModal } from "./InterviewSchedule";
import { ConfirmationModal } from "../common/modals/ConfirmationModal";
import { RefreshCw, Trash2 } from "lucide-react";

interface Props {
  round: InterviewRound;
  isEmployer?: boolean;
  onUpdate?: () => void;
}

const RoundCard: React.FC<Props> = ({ round, isEmployer = true, onUpdate }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { startCall, requestJoin } = useVideoCall();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
      rescheduled: {
        label: "Rescheduled",
        className: "bg-yellow-100 text-yellow-800",
      },
      completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
      },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoundTypeLabel = (type: string, customName?: string) => {
    if (type === "custom" && customName) return customName;

    const typeLabels: Record<string, string> = {
      technical: "Technical Round",
      managerial: "Managerial Round",
      hr: "HR Round",
      cultural: "Cultural Fit",
    };

    return typeLabels[type] || type;
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(round.meetingLink);
    toast.success("Meeting link copied to clipboard!");
  };

  const handleStartCall = () => {
    if (!currentUser) return;
    startCall(
      round.id,
      round.candidateId,
      {
        name: currentUser.name,
        image: currentUser.profileImage,
      },
      {
        jobTitle: `Round ${round.roundNumber} - ${getRoundTypeLabel(round.roundType, round.customRoundName)}`,
        interviewDate: round.scheduledDate || new Date().toISOString(),
      },
    );
  };

  const handleJoinCall = () => {
    if (!currentUser) return;

    // Candidates must request to join (Waiting Room)
    requestJoin(
      round.id,
      {
        name: currentUser.name,
        image: currentUser.profileImage,
      },
      currentUser.role || "Candidate",
    );
  };

  const handleMarkCompleted = async () => {
    try {
      await dispatch(
        updateRoundStatus({ roundId: round.id, status: "completed" }),
      ).unwrap();
      toast.success("Round marked as completed");
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleReschedule = async (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      await dispatch(
        rescheduleInterviewRound({ roundId: round.id, newDate: dateTime }),
      ).unwrap();
      toast.success("Round rescheduled successfully");
      setShowRescheduleModal(false);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to reschedule round");
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelInterviewRound({ roundId: round.id })).unwrap();
      toast.success("Round cancelled successfully");
      setShowCancelModal(false);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel round");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold">Round {round.roundNumber}</h4>
          <span className="text-sm text-gray-600">
            {getRoundTypeLabel(round.roundType, round.customRoundName)}
          </span>
        </div>
        {getStatusBadge(round.status)}
      </div>

      <div className="space-y-2 mb-3">
        {round.scheduledDate && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarToday className="text-gray-400" fontSize="small" />
            <span>
              {format(
                new Date(round.scheduledDate),
                "MMM dd, yyyy 'at' hh:mm a",
              )}
            </span>
          </div>
        )}

        {round.duration && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Schedule className="text-gray-400" fontSize="small" />
            <span>{round.duration} minutes</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Comment className="text-gray-400" fontSize="small" />
          <span>{round.feedbackCount || 0} feedback submitted</span>
        </div>
      </div>

      {round.notes && (
        <div className="bg-gray-50 rounded p-3 mb-3">
          <strong className="text-sm font-medium">Notes:</strong>
          <p className="text-sm text-gray-700 mt-1">{round.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(round.status === "scheduled" || round.status === "rescheduled") && (
          <>
            {isEmployer ? (
              <button
                onClick={handleStartCall}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <VideoIcon fontSize="small" /> Start Call
              </button>
            ) : (
              <button
                onClick={handleJoinCall}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm animate-pulse"
              >
                <VideoIcon fontSize="small" /> Join Call
              </button>
            )}

            {isEmployer && (
              <>
                <button
                  onClick={handleMarkCompleted}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Mark as Completed"
                >
                  <DoneIcon fontSize="small" /> Done
                </button>
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Reschedule Round"
                >
                  <RefreshCw className="w-4 h-4" /> Reschedule
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Cancel Round"
                >
                  <Trash2 className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </>
        )}

        {isEmployer && (
          <button
            onClick={copyMeetingLink}
            title="Copy meeting link"
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LinkIcon fontSize="small" /> Link
          </button>
        )}

        {isEmployer && round.status === "completed" && !round.feedbackCount && (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Comment fontSize="small" /> Add Feedback
          </button>
        )}

        {(round.feedbackCount || 0) > 0 && (
          <button
            onClick={() => setShowViewFeedbackModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Comment fontSize="small" /> View Feedback
          </button>
        )}
      </div>

      {showFeedbackModal && (
        <FeedbackModal
          roundId={round.id}
          applicationId={round.applicationId}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={() => {
            setShowFeedbackModal(false);
            if (onUpdate) onUpdate();
          }}
        />
      )}

      {showViewFeedbackModal && (
        <FeedbackViewModal
          roundId={round.id}
          isEmployer={isEmployer}
          onClose={() => setShowViewFeedbackModal(false)}
        />
      )}

      <InterviewScheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSchedule={handleReschedule}
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Interview Round"
        message="Are you sure you want to cancel this interview round? This action will notify the candidate."
        confirmText="Yes, Cancel Round"
        cancelText="No, Keep It"
        type="danger"
      />
    </div>
  );
};

export default RoundCard;
