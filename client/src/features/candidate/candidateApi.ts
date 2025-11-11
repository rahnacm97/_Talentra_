import { api } from "../../api/api";
import type {
  ICandidate,
  ProfileData,
} from "../../types/candidate/candidate.types";
import { API_ROUTES } from "../../shared/constants/constants";

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

export const applyJobApi = async (
  candidateId: string,
  jobId: string,
  data: FormData,
): Promise<any> => {
  const response = await api.post(
    API_ROUTES.CANDIDATE.APPLY(candidateId, jobId),
    data,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};
