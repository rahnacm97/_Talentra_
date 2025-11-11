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
}) => api.get(API_ROUTES.JOBS.PUBLIC, { params });

export const getJobById = (id: string) =>
  api.get(API_ROUTES.JOBS.PUBLIC_BY_ID(id));
