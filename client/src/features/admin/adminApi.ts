import { api } from "../../api/api";
import type {
  AdminLoginRequest,
  AdminAnalyticsData,
} from "../../types/admin/admin.types";
import { API_ROUTES } from "../../shared/constants/constants";
import type {
  Candidate,
  CandidateListResponse,
} from "../../types/admin/admin.candidate.types";
import type {
  EmployerResponseDTO,
  GetAllEmployersResponse,
  GetAllEmployersParams,
} from "../../types/admin/admin.employer.types";
import type {
  GetAdminJobsParams,
  AdminJobsResponse,
} from "../../types/admin/admin.jobs.types";
//Admin login
export const loginAdmin = async (data: AdminLoginRequest) => {
  const response = await api.post(API_ROUTES.ADMIN.ADMINLOGIN, data);
  return response.data;
};
//Admin logout
export const adminLogoutApi = async (refreshToken: string) => {
  const response = await api.post(API_ROUTES.ADMIN.ADMINLOGOUT, {
    refreshToken,
  });
  return response.data;
};
//Fetch all candidates
export const getAllCandidatesApi = async (
  page: number,
  limit: number,
  search: string = "",
): Promise<CandidateListResponse> => {
  const response = await api.get(API_ROUTES.ADMIN.CANDIDATES, {
    params: { page, limit, search },
  });
  return response.data.data;
};
//Block unblock candidate
export const blockUnblockCandidateApi = async (
  candidateId: string,
  block: boolean,
): Promise<{ candidate: Candidate; message: string }> => {
  const response = await api.patch(API_ROUTES.ADMIN.BLOCK_UNBLOCK_CANDIDATE, {
    candidateId,
    block,
  });
  return response.data;
};
//Single candidate
export const getCandidateByIdApi = async (
  candidateId: string,
): Promise<Candidate> => {
  const response = await api.get(
    `${API_ROUTES.ADMIN.CANDIDATES}/${candidateId}`,
  );
  return response.data.data;
};
//Fetch all employers
export const getAllEmployersApi = async (
  params: GetAllEmployersParams,
): Promise<GetAllEmployersResponse> => {
  const response = await api.get(API_ROUTES.ADMIN.EMPLOYERS, { params });
  return response.data.data;
};
//Single employer
export const getEmployerByIdApi = async (
  employerId: string,
): Promise<EmployerResponseDTO> => {
  const response = await api.get(`${API_ROUTES.ADMIN.EMPLOYERS}/${employerId}`);
  return response.data.data;
};
//Block unblock employer
export const blockUnblockEmployerApi = async (
  employerId: string,
  block: boolean,
): Promise<{ employer: EmployerResponseDTO; message: string }> => {
  const response = await api.patch(API_ROUTES.ADMIN.BLOCK_UNBLOCK_EMPLOYER, {
    employerId,
    block,
  });
  return response.data;
};
//Employer verification
export const verifyEmployerApi = async (
  employerId: string,
): Promise<{ employer: EmployerResponseDTO; message: string }> => {
  const response = await api.patch(
    `${API_ROUTES.ADMIN.VERIFY_EMPLOYER}/${employerId}/verify`,
  );
  return response.data;
};
//Rejecting  employer
export const rejectEmployerApi = async (
  employerId: string,
  reason: string,
): Promise<{ employer: EmployerResponseDTO; message: string }> => {
  const response = await api.patch(
    `${API_ROUTES.ADMIN.EMPLOYERS}/${employerId}/reject`,
    { reason },
  );
  return response.data;
};
//Fetch jobs
export const getAdminJobs = (
  params: GetAdminJobsParams,
): Promise<AdminJobsResponse> =>
  api.get(API_ROUTES.ADMIN.JOBS, { params }).then((res) => res.data);

//Fetching dashboard data
export const fetchAdminAnalyticsApi = async (
  timeRange: string = "30days",
): Promise<AdminAnalyticsData> => {
  const response = await api.get<{ data: AdminAnalyticsData }>(
    `${API_ROUTES.ADMIN.DASHBOARD_ANALYTICS}?timeRange=${timeRange}`,
  );
  return response.data.data;
};
