import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import {
  Calendar,
  User,
  Briefcase,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import InterviewRoundManager from "../../components/employer/InterviewRoundManager";
import {
  fetchEmployerInterviews,
  updateInterviewStatus,
} from "../../thunks/interview.thunks";
import RejectionModal from "../../components/employer/RejectionModal";
import { updateApplicationStatusApi } from "../../features/employer/employerApi";
import { toast } from "react-toastify";

const EmployerInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { interviews, loading } = useSelector(
    (state: RootState) => state.interview,
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const employerId = currentUser?._id || "";

  const interview = interviews.find(
    (i) => i.id === id || i.applicationId === id,
  );

  useEffect(() => {
    if (!interview && !loading) {
      dispatch(fetchEmployerInterviews({ page: 1, limit: 100 }));
    }
  }, [dispatch, interview, loading]);

  const handleStatusChange = async (newStatus: string, data?: any) => {
    if (!interview) return;
    setIsUpdating(true);
    try {
      if (newStatus === "completed") {
        await dispatch(
          updateInterviewStatus({ id: interview.id, status: "completed" }),
        ).unwrap();
        toast.success("Interview marked as completed");
      } else {
        const payload = { status: newStatus, ...data };
        await updateApplicationStatusApi(interview.applicationId, payload);

        if (newStatus === "hired" || newStatus === "rejected") {
          await dispatch(
            updateInterviewStatus({ id: interview.id, status: newStatus }),
          ).unwrap();
        }

        toast.success(`Application status updated to ${newStatus}`);
      }

      dispatch(fetchEmployerInterviews({ page: 1, limit: 100 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Interview not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isHiredOrRejected =
    interview.status === "hired" ||
    interview.status === "rejected" ||
    interview.applicationStatus === "hired" ||
    interview.applicationStatus === "rejected";

  const isCompleted = interview.status === "completed";

  const canAddRounds = !isHiredOrRejected && !isCompleted;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Interviews
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                  {interview.candidate.profileImage ? (
                    <img
                      src={interview.candidate.profileImage}
                      alt={interview.candidate.fullName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {interview.candidate.fullName}
                  </h1>
                  <p className="text-indigo-100 font-medium flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4" />
                    {interview.job.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-sm border border-white/30">
                  {interview.status === "hired" ||
                  interview.status === "rejected"
                    ? "completed"
                    : interview.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Interview Rounds
                  </h2>
                  <InterviewRoundManager
                    applicationId={interview.applicationId}
                    jobId={interview.jobId}
                    candidateId={interview.candidateId}
                    employerId={employerId}
                    canAddRounds={canAddRounds}
                    onUpdate={() =>
                      dispatch(fetchEmployerInterviews({ page: 1, limit: 100 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Mail className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {interview.candidate.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {interview.candidate.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-3">
                      {(isCompleted || isHiredOrRejected) && (
                        <div className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-100 mb-2">
                          <CheckCircle className="w-5 h-5" />
                          Status: Completed
                        </div>
                      )}

                      {isHiredOrRejected ? (
                        interview.applicationStatus === "hired" ||
                        interview.status === "hired" ? (
                          <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-200">
                            <CheckCircle className="w-5 h-5" />
                            Candidate Hired
                          </div>
                        ) : (
                          <div className="w-full py-3 bg-red-100 text-red-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-200">
                            <XCircle className="w-5 h-5" />
                            Candidate Rejected
                          </div>
                        )
                      ) : (
                        <>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange("hired")}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Hire Candidate
                          </button>
                          <button
                            disabled={isUpdating}
                            onClick={() => setShowRejectionModal(true)}
                            className="w-full py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject Candidate
                          </button>
                          {!isCompleted && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange("completed")}
                              className="w-full py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Mark as Completed
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRejectionModal && (
        <RejectionModal
          candidateName={interview.candidate.fullName}
          onClose={() => setShowRejectionModal(false)}
          onSuccess={() => {
            setShowRejectionModal(false);
            navigate(-1);
          }}
          updateApplicationStatus={async (status, data) => {
            await handleStatusChange(status, data);
          }}
        />
      )}
    </div>
  );
};

export default EmployerInterviewDetailPage;
