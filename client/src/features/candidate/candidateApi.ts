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

export const getMyApplications = async (filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const url = `${API_ROUTES.CANDIDATE.APPLICATIONS}?${params.toString()}`;
  const { data } = await api.get(url);
  return data;
};

export const getApplicationByIdApi = async (applicationId: string) => {
  const response = await api.get(
    `${API_ROUTES.CANDIDATE.APPLICATIONS}/${applicationId}`,
  );
  return response.data.data;
};
