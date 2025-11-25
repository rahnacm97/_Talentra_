import type { EmployerInfoDto } from "../job/job.types";

export interface AdminJob {
  _id: string;
  title: string;
  name: string;
  type: string;
  applicants: number;
  isActive: boolean;
  status: "active" | "closed" | "draft";
  employer: EmployerInfoDto;
  createdAt: Date;
  description: string;
  location: string;
  requirements: [];
  responsibilities: [];
}

export interface GetAdminJobsParams {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "closed" | "all";
}

export interface AdminJobsResponse {
  jobs: AdminJob[];
  total: number;
  page: number;
  limit: number;
}
