export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  interviewDate?: string;
  status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "hired"
    | "rejected";
  roundType: string;
  roundNumber: number;
  interviewerIds: string[];
  leadInterviewerId: string;
  notes?: string;
  feedback?: string;
  applicationStatus: string;
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

export interface InterviewRound {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  roundNumber: number;
  roundType: string;
  customRoundName?: string;
  scheduledDate?: string;
  status: string;
  meetingLink: string;
  meetingToken: string;
  duration?: number;
  notes?: string;
  job?: {
    title: string;
    location: string;
    type: string;
  };
  candidate?: {
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  employer?: {
    name: string;
    companyName: string;
    logo?: string;
  };
  participantCount?: number;
  feedbackCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewRoundState {
  rounds: InterviewRound[];
  currentRound: InterviewRound | null;
  loading: boolean;
  error: string | null;
}

export interface MeetingData {
  interviewId: string;
}
