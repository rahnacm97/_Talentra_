import { api } from "../../api/api";
import type {
  ICandidate,
  ProfileData,
} from "../../types/candidate/candidate.types";
import { API_ROUTES } from "../../shared/constants/constants";

//Candidate profile fetch
export const getCandidateProfileApi = async (): Promise<ICandidate> => {
  const response = await api.get(API_ROUTES.CANDIDATE.PROFILE);
  return response.data.data;
};
//Update profile
export const updateCandidateProfileApi = async (
  data: ProfileData | FormData,
): Promise<ICandidate> => {
  const isFormData = data instanceof FormData;
  const response = await api.put(API_ROUTES.CANDIDATE.PROFILE, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data.data;
};
//Applying job
export const applyJobApi = async (
  jobId: string,
  data: FormData,
): Promise<any> => {
  const response = await api.post(API_ROUTES.CANDIDATE.APPLY(jobId), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
//Fetching applications
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
//Single application
export const getApplicationByIdApi = async (applicationId: string) => {
  const response = await api.get(
    `${API_ROUTES.CANDIDATE.APPLICATIONS}/${applicationId}`,
  );
  return response.data.data;
};
