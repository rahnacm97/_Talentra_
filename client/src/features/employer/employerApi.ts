import { api } from "../../api/api";
import type {
  IEmployer,
  FetchJobsParams,
  FetchJobsResponse,
  EmployerAnalyticsData,
} from "../../types/employer/employer.types";
import type { EmployerApplicationsPaginatedDto } from "../../types/application/application.types";
import { API_ROUTES } from "../../shared/constants/constants";

//Employer profile fetch
export const getEmployerProfileApi = async (): Promise<IEmployer> => {
  const response = await api.get(API_ROUTES.EMPLOYER.PROFILE);
  return response.data.data;
};
//Update profile
export const updateEmployerProfileApi = async (
  data: FormData,
): Promise<IEmployer> => {
  const response = await api.put(API_ROUTES.EMPLOYER.PROFILE, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
//Jobs fetch
export const fetchEmployerJobsApi = async (
  params: FetchJobsParams = {},
): Promise<FetchJobsResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER.JOBS, {
    params,
  });
  return response.data;
};
//Job post
export const postJobApi = async (job: any): Promise<any> => {
  const response = await api.post(API_ROUTES.EMPLOYER.JOBS, job);
  return response.data.job;
};
// Update job
export const updateJobApi = async (jobId: string, job: any): Promise<any> => {
  const response = await api.put(API_ROUTES.EMPLOYER.JOB(jobId), job);
  return response.data.job;
};

//Job closing
export const closeJobApi = async (jobId: string): Promise<any> => {
  const response = await api.patch(API_ROUTES.EMPLOYER.JOB_CLOSE(jobId));
  return response.data.job;
};
//Application
export const fetchEmployerApplicationsApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobTitle?: string;
}): Promise<EmployerApplicationsPaginatedDto> => {
  const response = await api.get(API_ROUTES.EMPLOYER.APPLICATIONS, {
    params,
  });
  return response.data;
};
//Updating application status
export const updateApplicationStatusApi = async (
  applicationId: string,
  data: {
    status: string;
    interviewDate?: string;
  },
): Promise<EmployerApplicationsPaginatedDto> => {
  const response = await api.patch(
    API_ROUTES.EMPLOYER.UPDATE_APPLICATION_STATUS(applicationId),
    data,
  );
  return response.data.data;
};
//Amnalytics fetch
export const fetchEmployerAnalyticsApi = async (
  timeRange: string = "30d",
): Promise<EmployerAnalyticsData> => {
  const response = await api.get(API_ROUTES.EMPLOYER.ANALYTICS, {
    params: { timeRange },
  });

  return response.data.data;
};
