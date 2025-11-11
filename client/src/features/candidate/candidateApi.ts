import { api } from "../../api/api";
import type { ICandidate } from "../../types/candidate/candidate.types";
import { API_ROUTES } from "../../shared/constants";

export const getCandidateProfileApi = async (
  candidateId: string,
): Promise<ICandidate> => {
  const response = await api.get(API_ROUTES.CANDIDATE.PROFILE(candidateId));
  return response.data.data;
};
