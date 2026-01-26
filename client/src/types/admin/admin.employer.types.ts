export interface Employer {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  companySize?: string;
  description?: string;
  industry?: string;
  specializations?: string;
  businessLicense?: string;
  profileImage: string;
  cinNumber: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verified: boolean;
  blocked: boolean;
  createdAt: string;
  jobsPosted: number;
  activeJobs?: number;
  closedJobs?: number;
  totalApplications?: number;
  hiredCandidates?: number;
  profileViews?: number;
}

export interface EmployerResponseDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  companySize?: string;
  description?: string;
  industry?: string;
  profileImage: string;
  cinNumber: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  founded: string;
  specializations?: string;
  businessLicense?: string;
  verified: boolean;
  blocked: boolean;
  createdAt: string;
  jobsPosted: number;
  activeJobs?: number;
  closedJobs?: number;
  totalApplications?: number;
  hiredCandidates?: number;
  profileViews?: number;
  rejected?: boolean;
  rejectionReason?: string;
  rejectionCreatedAt?: string;
  updatedAt?: string;
}

export interface BlockEmployerDTO {
  employerId: string;
  block: boolean;
}

export interface EmployersState {
  employers: EmployerResponseDTO[];
  total: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  selectedEmployer: EmployerResponseDTO | null;
}

export interface GetAllEmployersParams {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "blocked" | "all";
  verification?: "verified" | "pending" | "all";
}

export interface GetAllEmployersResponse {
  data: EmployerResponseDTO[];
  total: number;
}
