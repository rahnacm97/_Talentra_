import { ExperienceLevel } from "../../interfaces/jobs/IJob";
import { IJob } from "../../interfaces/jobs/IJob";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export type IJobWithEmployer = IJob & {
  employer?: IEmployer | null;
};

export interface EmployerInfoDto {
  id: string;
  companyName: string;
  logo?: string | undefined;
  companySize?: string | undefined;
  industry?: string | undefined;
  website?: string | undefined;
  about?: string | undefined;
  founded?: string | undefined;
  benefits?: string[] | undefined;
}

export interface JobResponseDto {
  id: string;
  employerId: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline: string;
  status: string;
  experience: ExperienceLevel;
  applicants: number;
  postedDate: string;
  employer: EmployerInfoDto;
  hasApplied?: boolean;
  skills: string[];
}
