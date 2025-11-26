import { IApplicationQuery } from "../../interfaces/applications/IApplication";

export type ApplicationMatch = {
  candidateId: string;
  status?: IApplicationQuery["status"];
};

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "rejected"
  | "accepted"
  | "interview"
  | "shortlisted"
  | "all";

export interface EmployerApplicationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  jobTitle?: string;
}

export interface GetApplicationsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobTitle?: string;
}

export type MatchFilter = Record<string, unknown>;
