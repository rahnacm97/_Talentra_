import { InterviewStatus } from "../../interfaces/interviews/IInterview";

export interface InterviewResponseDto {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  interviewDate?: Date;
  status: InterviewStatus;
  notes?: string;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InterviewWithDetailsDto {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  interviewDate?: Date;
  status: InterviewStatus;
  notes?: string;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
  job: {
    title: string;
    location: string;
    type: string;
  };
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  employer: {
    name: string;
    companyName: string;
    logo?: string;
  };
}

export interface InterviewsPaginatedDto {
  interviews: InterviewWithDetailsDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
