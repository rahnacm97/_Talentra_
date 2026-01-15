import {
  ApplicationResponseDto,
  ApplicationsResponseDto,
  EmployerApplicationsPaginatedDto,
  EmployerApplicationResponseDto,
} from "../../dto/application/application.dto";

export interface ApplyJobPayload {
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFile?: Express.Multer.File;
  useExistingResume?: boolean;
}

export interface ICandidateApplicationService {
  apply(
    jobId: string,
    candidateId: string,
    payload: ApplyJobPayload,
  ): Promise<ApplicationResponseDto>;

  getApplicationsForCandidate(
    candidateId: string,
    filters?: {
      status?:
        | "pending"
        | "reviewed"
        | "rejected"
        | "accepted"
        | "interview"
        | "shortlisted"
        | "hired"
        | "all"
        | undefined;
      search?: string | undefined;
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: ApplicationsResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;

  getApplicationById(
    applicationId: string,
    candidateId: string,
  ): Promise<ApplicationsResponseDto>;
}

export interface IEmployerApplicationService {
  getApplicationsForEmployer(
    employerId: string,
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      jobTitle?: string;
    },
  ): Promise<EmployerApplicationsPaginatedDto>;
  updateApplicationStatus(
    employerId: string,
    applicationId: string,
    data: { status: string; interviewDate?: string; interviewLink?: string },
  ): Promise<EmployerApplicationResponseDto>;
}

export interface IApplicationUpdate {
  status: string;
  interviewDate?: string | undefined;
}
