import { api } from "../../api/api";
import type {
  IEmployer,
  FetchJobsParams,
  FetchJobsResponse,
  EmployerAnalyticsData,
} from "../../types/employer/employer.types";
import type { EmployerApplicationsPaginatedDto } from "../../types/application/application.types";
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

export const fetchEmployerApplicationsApi = async (
  employerId: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    jobTitle?: string;
  },
): Promise<{
  applications: EmployerApplicationsPaginatedDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await api.get(API_ROUTES.EMPLOYER.APPLICATIONS(employerId), {
    params,
  });
  return response.data;
};

export const updateApplicationStatusApi = async (
  employerId: string,
  applicationId: string,
  data: {
    status: string;
    interviewDate?: string;
  },
): Promise<EmployerApplicationsPaginatedDto> => {
  const response = await api.patch(
    API_ROUTES.EMPLOYER.UPDATE_APPLICATION_STATUS(employerId, applicationId),
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
