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
  status:
    | "pending"
    | "reviewed"
    | "rejected"
    | "accepted"
    | "interview"
    | "shortlisted"
    | "all";
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  interviewDate?: string;
  updatedAt?: string;
}

export interface ApplicationsPaginatedResponseDto {
  applications: ApplicationsResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  status:
    | "pending"
    | "reviewed"
    | "rejected"
    | "accepted"
    | "interview"
    | "shortlisted"
    | "all";
}

export interface ExperienceDto {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface EducationDto {
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
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
  interviewDate: string;
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
