import { api } from "../../api/api";
import type {
  IEmployer,
  FetchJobsParams,
  FetchJobsResponse,
  Interview,
} from "../../types/employer/employer.types";
import { API_ROUTES } from "../../shared/constants/constants";

export const getEmployerProfileApi = async (
  employerId: string,
): Promise<IEmployer> => {
  const response = await api.get(API_ROUTES.EMPLOYER.PROFILE(employerId));
  return response.data.data;
};

export const updateEmployerProfileApi = async (
  employerId: string,
  data: FormData,
): Promise<IEmployer> => {
  const response = await api.put(
    API_ROUTES.EMPLOYER.PROFILE(employerId),
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const fetchEmployerJobsApi = async (
  employerId: string,
  params: FetchJobsParams = {},
): Promise<FetchJobsResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER.JOBS(employerId), {
    params,
  });
  return response.data;
};

export const postJobApi = async (
  employerId: string,
  job: any,
): Promise<any> => {
  const response = await api.post(API_ROUTES.EMPLOYER.JOBS(employerId), job);
  return response.data.job;
};

export const updateJobApi = async (
  employerId: string,
  jobId: string,
  job: any,
): Promise<any> => {
  const response = await api.put(
    API_ROUTES.EMPLOYER.JOB(employerId, jobId),
    job,
  );
  return response.data.job;
};

export const closeJobApi = async (
  employerId: string,
  jobId: string,
): Promise<any> => {
  const response = await api.patch(
    API_ROUTES.EMPLOYER.JOB_CLOSE(employerId, jobId),
  );
  return response.data.job;
};

export const fetchInterviewsApi = async (
  employerId: string,
): Promise<Interview[]> => {
  const response = await api.get(`/employer/${employerId}/interviews`);
  return response.data;
};

export const updateInterviewStatusApi = async (
  employerId: string,
  interviewId: string,
  status: string,
): Promise<Interview> => {
  const response = await api.put(
    `/employer/${employerId}/interviews/${interviewId}`,
    { status },
  );
  return response.data;
};

import axios from "axios";
const NOTIFICATIONS_BASE = `${import.meta.env.VITE_API_URL}/notifications`;

export const fetchNotificationsApi = async (
  employerId: string,
): Promise<any> => {
  const response = await axios.get(`${NOTIFICATIONS_BASE}/${employerId}`);
  return response.data;
};

export const markNotificationAsReadApi = async (
  notificationId: string,
  employerId: string,
): Promise<any> => {
  const response = await axios.patch(
    `${NOTIFICATIONS_BASE}/${notificationId}/read`,
    { employerId },
  );
  return response.data;
};
