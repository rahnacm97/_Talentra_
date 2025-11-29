export interface IInterview {
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

export type InterviewStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface IInterviewQuery {
  page?: number;
  limit?: number;
  status?: InterviewStatus | "all";
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface IInterviewWithDetails extends IInterview {
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
