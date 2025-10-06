import { api } from "../../api/api";
import type { ICandidate } from "../../types/candidate/candidate.types";

export const getCandidateProfileApi = async (candidateId: string): Promise<ICandidate> => {
  const response = await api.get(`/candidate/${candidateId}`);
  return response.data;
};
