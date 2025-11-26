import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type { ExperienceLevel } from "../../shared/validations/JobFormValidation";

export const getPublicJobs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  type?: string;
  experience?: ExperienceLevel;
  skills?: string[];
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.location) queryParams.append("location", params.location);
  if (params?.type) queryParams.append("type", params.type);
  if (params?.experience) queryParams.append("experience", params.experience);
  if (params?.skills?.length) {
    queryParams.append("skills", params.skills.join(","));
  }

  const url = `${API_ROUTES.JOBS.PUBLIC}?${queryParams.toString()}`;
  return api.get(url);
};

export const getJobById = (id: string, candidateId?: string) =>
  api.get(API_ROUTES.JOBS.PUBLIC_BY_ID(id), {
    params: candidateId ? { candidateId } : {},
  });

export const saveJob = (jobId: string) => {
  return api.post(API_ROUTES.JOBS.SAVE(jobId));
};

export const unsaveJob = (jobId: string) => {
  return api.delete(API_ROUTES.JOBS.UNSAVE(jobId));
};

export const getSavedJobs = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.type) queryParams.append("type", params.type);

  const url = `${API_ROUTES.JOBS.SAVED}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return api.get(url);
};
