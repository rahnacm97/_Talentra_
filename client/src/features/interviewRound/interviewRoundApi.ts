import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type {
  InterviewRound,
  InterviewQueryParams,
} from "../../types/interview/interview.types";

//Create new interview round
export const createInterviewRoundApi = (data: Partial<InterviewRound>) => {
  return api.post(API_ROUTES.INTERVIEW_ROUNDS.BASE, data);
};

//Fetch rounds for a specific application
export const getRoundsForApplication = (applicationId: string) => {
  return api.get(API_ROUTES.INTERVIEW_ROUNDS.APPLICATION(applicationId));
};

//Fetch candidate's interview rounds
export const getCandidateRounds = (params?: InterviewQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);

  const url = `${API_ROUTES.INTERVIEW_ROUNDS.CANDIDATE}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return api.get(url);
};

//Fetch employer's interview rounds
export const getEmployerRounds = (params?: InterviewQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);

  const url = `${API_ROUTES.INTERVIEW_ROUNDS.EMPLOYER}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return api.get(url);
};

//Fetch round detail by ID
export const getRoundById = (roundId: string) => {
  return api.get(API_ROUTES.INTERVIEW_ROUNDS.BY_ID(roundId));
};

//Update round status
export const updateRoundStatusApi = (roundId: string, status: string) => {
  return api.patch(API_ROUTES.INTERVIEW_ROUNDS.STATUS(roundId), { status });
};

//Reschedule round
export const rescheduleRoundApi = (roundId: string, newDate: string) => {
  return api.patch(API_ROUTES.INTERVIEW_ROUNDS.RESCHEDULE(roundId), {
    newDate,
  });
};

//Cancel round
export const cancelRoundApi = (roundId: string, reason?: string) => {
  return api.patch(API_ROUTES.INTERVIEW_ROUNDS.CANCEL(roundId), { reason });
};

// Validate meeting access
export const validateMeetingAccess = (roundId: string, token: string) => {
  return api.get(API_ROUTES.INTERVIEW_ROUNDS.VALIDATE(roundId, token));
};

//Submit feedback for round
export const submitFeedbackApi = (roundId: string, data: any) => {
  return api.post(API_ROUTES.INTERVIEW_FEEDBACK.ROUND(roundId), data);
};

//Fetch feedback for a round
export const getFeedbackForRound = (roundId: string) => {
  return api.get(API_ROUTES.INTERVIEW_FEEDBACK.ROUND(roundId));
};

//Fetch feedback for an application
export const getFeedbackForApplication = (applicationId: string) => {
  return api.get(API_ROUTES.INTERVIEW_FEEDBACK.APPLICATION(applicationId));
};

//Fetch feedback summary for round
export const getFeedbackSummary = (roundId: string) => {
  return api.get(API_ROUTES.INTERVIEW_FEEDBACK.SUMMARY(roundId));
};

//Fetch shared feedback for candidate
export const getSharedFeedbackForRound = (roundId: string) => {
  return api.get(API_ROUTES.INTERVIEW_FEEDBACK.CANDIDATE_ROUND(roundId));
};

//Share feedback with candidate
export const shareFeedbackWithCandidateApi = (feedbackId: string) => {
  return api.patch(API_ROUTES.INTERVIEW_FEEDBACK.SHARE(feedbackId));
};

export const interviewRoundApi = {
  createRound: createInterviewRoundApi,
  getRoundsForApplication,
  getMyRounds: getCandidateRounds,
  getEmployerRounds,
  getRoundById,
  updateRoundStatus: updateRoundStatusApi,
  rescheduleRound: rescheduleRoundApi,
  cancelRound: cancelRoundApi,
  validateMeetingAccess,
};

export const interviewFeedbackApi = {
  submitFeedback: submitFeedbackApi,
  getFeedbackForRound,
  getFeedbackForApplication,
  getFeedbackSummary,
  getSharedFeedbackForRound,
  shareFeedbackWithCandidate: shareFeedbackWithCandidateApi,
};
