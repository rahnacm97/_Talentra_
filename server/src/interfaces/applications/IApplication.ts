export interface IApplication {
  id: string;
  jobId: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: Date;
  interviewDate: Date;
  status:
    | "pending"
    | "reviewed"
    | "rejected"
    | "accepted"
    | "interview"
    | "shortlisted"
    | "all";
}

export interface IApplicationWithJob extends IApplication {
  job: {
    title: string;
    location: string;
    salaryRange?: string;
    type: string;
    description: string;
    requirements: string[];
    employerId?: string;
  };
  employer: {
    name: string;
    profileImage?: string;
  };
  updatedAt: Date;
}

export interface IApplicationQuery {
  page?: number;
  limit?: number;
  status?:
    | "pending"
    | "reviewed"
    | "rejected"
    | "accepted"
    | "interview"
    | "shortlisted"
    | "all";
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface IApplicationQueryParams {
  status?: IApplicationQuery["status"];
  search?: string;
  page?: string;
  limit?: string;
}

export interface IEmployerApplicationResult {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: Date;
  status: string;
  rating?: number;
  notes?: string;

  jobTitle: string;
  location?: string;
  jobType?: string;
  salary?: string;
  description?: string;
  requirements?: string[];

  employerProfileImage?: string;
}

export interface IEmployerApplicationResponse {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: Date;
  status: string;
  rating?: number;
  notes?: string;

  jobTitle: string;
  name: string;
  jobLocation?: string;
  salaryRange?: string;
  jobType?: string;

  interviewDate: string;

  candidate?:
    | {
        profileImage?: string;
        location?: string;
        title?: string;
        about?: string;
        skills?: string[];
        experience?: Array<{
          title: string;
          company: string;
          location?: string;
          startDate: string;
          endDate?: string;
          current?: boolean;
          description?: string;
        }>;
        education?: Array<{
          degree: string;
          institution: string;
          location?: string;
          startDate: string;
          endDate: string;
          gpa?: string;
        }>;
        resume?: string;
      }
    | undefined;
  experienceYears?: number;
}

export interface EmployerApplicationAggResult
  extends IEmployerApplicationResponse {
  candidate: IEmployerApplicationResponse["candidate"];
}

export type CandidateExperience = NonNullable<
  NonNullable<IEmployerApplicationResponse["candidate"]>["experience"]
>[number];
