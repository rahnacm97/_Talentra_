import { api } from "../../api/api";
import type {
  IEmployer,
  FetchJobsParams,
  FetchJobsResponse,
  EmployerAnalyticsData,
} from "../../types/employer/employer.types";
import type { EmployerApplicationsPaginatedDto } from "../../types/application/application.types";
import { API_ROUTES } from "../../shared/constants/constants";

export const getEmployerProfileApi = async (): Promise<IEmployer> => {
  const response = await api.get(API_ROUTES.EMPLOYER.PROFILE);
  return response.data.data;
};

export const updateEmployerProfileApi = async (
  data: FormData,
): Promise<IEmployer> => {
  const response = await api.put(API_ROUTES.EMPLOYER.PROFILE, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const fetchEmployerJobsApi = async (
  params: FetchJobsParams = {},
): Promise<FetchJobsResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER.JOBS, {
    params,
  });
  return response.data;
};

export const postJobApi = async (job: any): Promise<any> => {
  const response = await api.post(API_ROUTES.EMPLOYER.JOBS, job);
  return response.data.job;
};

export const updateJobApi = async (jobId: string, job: any): Promise<any> => {
  const response = await api.put(API_ROUTES.EMPLOYER.JOB(jobId), job);
  return response.data.job;
};

export const closeJobApi = async (jobId: string): Promise<any> => {
  const response = await api.patch(API_ROUTES.EMPLOYER.JOB_CLOSE(jobId));
  return response.data.job;
};

export const fetchEmployerApplicationsApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobTitle?: string;
}): Promise<{
  applications: EmployerApplicationsPaginatedDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get(API_ROUTES.EMPLOYER.APPLICATIONS, {
    params,
  });
  return response.data;
};

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

export const fetchEmployerAnalyticsApi = async (
  timeRange: string = "30d",
): Promise<EmployerAnalyticsData> => {
  const response = await api.get(API_ROUTES.EMPLOYER.ANALYTICS, {
    params: { timeRange },
  });

  return response.data.data;
};
