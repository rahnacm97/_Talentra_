import { api } from "../../api/api";
import type {
  ICandidate,
  ProfileData,
} from "../../types/candidate/candidate.types";
import { API_ROUTES } from "../../shared/constants";

export const getCandidateProfileApi = async (
  candidateId: string,
): Promise<ICandidate> => {
  const response = await api.get(API_ROUTES.CANDIDATE.PROFILE(candidateId));
  return response.data.data;
};

export const updateCandidateProfileApi = async (
  candidateId: string,
  data: ProfileData | FormData,
): Promise<ICandidate> => {
  const isFormData = data instanceof FormData;
  const response = await api.put(
    API_ROUTES.CANDIDATE.PROFILE(candidateId),
    data,
    {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    },
  );
  return response.data.data;
};
