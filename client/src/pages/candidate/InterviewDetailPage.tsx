import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../app/store";
import { User, Briefcase, MapPin, ArrowLeft, Clock } from "lucide-react";
import { fetchCandidateInterviews } from "../../thunks/interview.thunks";
import { fetchRoundsForApplication } from "../../thunks/interviewRound.thunk";
import RoundCard from "../../components/employer/RoundCard";

const CandidateInterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { interviews, loading: interviewsLoading } = useSelector(
    (state: RootState) => state.interview,
  );
  const { rounds, loading: roundsLoading } = useSelector(
    (state: RootState) => state.interviewRound,
  );

  const interview = interviews.find(
    (i) => i.id === id || i.applicationId === id,
  );

  useEffect(() => {
    if (!interview && !interviewsLoading) {
      dispatch(fetchCandidateInterviews({ page: 1, limit: 100 }));
    }
  }, [dispatch, interview, interviewsLoading]);

  useEffect(() => {
    if (interview?.applicationId) {
      dispatch(fetchRoundsForApplication(interview.applicationId));
    }
  }, [dispatch, interview?.applicationId]);

  if ((interviewsLoading || roundsLoading) && !interview) {
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{interview.job.title}</h1>
                  <p className="text-blue-100 font-medium flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {interview.employer.companyName || interview.employer.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                    Status
                  </p>
                  <p className="text-sm font-bold uppercase">
                    {interview.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Interview Timeline
              </h2>

              <div className="space-y-4">
                {rounds.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">
                      No interview rounds scheduled yet.
                    </p>
                  </div>
                ) : (
                  [...rounds]
                    .sort((a, b) => a.roundNumber - b.roundNumber)
                    .map((round) => (
                      <RoundCard
                        key={round.id}
                        round={round}
                        isEmployer={false}
                        onUpdate={() => {}}
                      />
                    ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Job Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{interview.job.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{interview.job.type}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">
                  Preparation Tip
                </h3>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Join the meeting at least 5 minutes early to test your camera
                  and microphone. Have a stable internet connection and find a
                  quiet place for the interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInterviewDetailPage;
