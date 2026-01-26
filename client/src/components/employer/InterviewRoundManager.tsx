import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoundsForApplication } from "../../thunks/interviewRound.thunk";
import type { AppDispatch, RootState } from "../../app/store";
import type { InterviewRound } from "../../types/interview/interview.types";
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import AddRoundModal from "./AddRoundModal";
import RoundCard from "./RoundCard";

interface Props {
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  isEmployer?: boolean;
  canAddRounds?: boolean;
  onUpdate?: () => void;
}

const InterviewRoundManager: React.FC<Props> = ({
  applicationId,
  jobId,
  candidateId,
  employerId,
  isEmployer = true,
  canAddRounds = true,
  onUpdate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { rounds, loading, error } = useSelector(
    (state: RootState) => state.interviewRound,
  );
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRoundsForApplication(applicationId));
  }, [applicationId, dispatch]);

  const handleAddRound = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleRoundAdded = () => {
    setShowAddModal(false);
    dispatch(fetchRoundsForApplication(applicationId));
    if (onUpdate) onUpdate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="text-indigo-600" /> Interview Rounds
        </h3>
        {canAddRounds && (
          <button
            onClick={handleAddRound}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <AddIcon /> Add Round
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : rounds.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">
            No interview rounds scheduled yet.
          </p>
          {canAddRounds && (
            <button
              onClick={handleAddRound}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Schedule First Round
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {[...rounds]
            .sort(
              (a: InterviewRound, b: InterviewRound) =>
                a.roundNumber - b.roundNumber,
            )
            .map((round: InterviewRound) => (
              <RoundCard
                key={round.id}
                round={round}
                isEmployer={isEmployer}
                onUpdate={() => {
                  dispatch(fetchRoundsForApplication(applicationId));
                  if (onUpdate) onUpdate();
                }}
              />
            ))}
        </div>
      )}

      {showAddModal && (
        <AddRoundModal
          applicationId={applicationId}
          jobId={jobId}
          candidateId={candidateId}
          employerId={employerId}
          nextRoundNumber={rounds.length + 1}
          onClose={handleCloseModal}
          onSuccess={handleRoundAdded}
        />
      )}
    </div>
  );
};

export default InterviewRoundManager;
