import type { ICandidate } from "../../types/candidate/candidate.types";

export type Status =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";

export type ExtendedStatus = Status | "accepted";

export type AppStatus = Status | "accepted";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: Status;
  jobType: string;
  description: string;
  requirements: string[];
  employerLogo?: string;
}

export interface ApplicationsResponseDto {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: string;
  jobTitle: string;
  name: string;
  location: string;
  salary?: string;
  jobType: string;
  description: string;
  requirements: string[];
  profileImage?: string;
  interviewDate?: string;
  status:
    | "pending"
    | "reviewed"
    | "rejected"
    | "interview"
    | "accepted"
    | "shortlisted"
    | "hired";
  updatedAt?: string;
}

export interface ApplicationResponseDto {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}

export interface CandidateState {
  profile: ICandidate | null;
  loading: boolean;
  error: string | null;
  applications: ApplicationsResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  appsLoading: boolean;
  currentApplication: ApplicationsResponseDto | null;
  currentAppLoading: boolean;
}

export interface ApplicationsPaginatedResponseDto {
  applications: ApplicationsResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExperienceDto {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface EducationDto {
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface CandidateDetailsDto {
  profileImage?: string;
  location?: string;
  title?: string;
  about?: string;
  skills?: string[];
  experience?: ExperienceDto[];
  education?: EducationDto[];
  resume?: string;
  experienceYears?: number;
}

export interface EmployerApplicationResponseDto {
  id: string;
  candidateId: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: string;
  status: string;
  rating?: number;
  notes?: string;

  jobTitle: string;
  name: string;
  jobLocation?: string;
  salaryRange?: string;
  jobType?: string;

  candidate: CandidateDetailsDto;

  interviewDate?: string;
}

export interface EmployerApplicationsPaginatedDto {
  applications: EmployerApplicationResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
