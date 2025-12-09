export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  interviewDate?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface InterviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InterviewQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface InterviewState {
  interviews: Interview[];
  loading: boolean;
  error: string | null;
  pagination: InterviewPagination;
}
