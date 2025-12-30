import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type { InterviewQueryParams } from "../../types/interview/interview.types";

//Fetch candidate interviews
export const getCandidateInterviews = (params?: InterviewQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);

  const url = `${API_ROUTES.INTERVIEWS.CANDIDATE}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return api.get(url);
};
// Fetch employer intervies
export const getEmployerInterviews = (params?: InterviewQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);

  const url = `${API_ROUTES.INTERVIEWS.EMPLOYER}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return api.get(url);
};
//Updating interview status employer side
export const updateInterviewStatusApi = (id: string, status: string) => {
  return api.patch(API_ROUTES.INTERVIEWS.UPDATE_STATUS(id), { status });
};
