export interface EmployerResponseDTO {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  about: string;
  founded: string;
  blocked: boolean;
  joinDate?: string;
  jobsPosted: number;
  activeJobs?: number;
  closedJobs?: number;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  totalApplications?: number;
  hiredCandidates?: number;
  profileViews?: number;
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
  createdAt: string;
}

export interface BlockEmployerDTO {
  employerId: string;
  block: boolean;
}

export interface GetAllEmployersParams {
  page: number;
  limit: number;
  search?: string;
}

export interface GetAllEmployersResponse {
  data: EmployerResponseDTO[];
  total: number;
}
