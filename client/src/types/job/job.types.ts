import type { ExperienceLevel } from "../../shared/validations/JobFormValidation";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: "active" | "closed" | "draft";
  applicants: number;
  postedDate: string;
  deadline: string;
  experience: ExperienceLevel;
}

export interface EmployerInfoDto {
  id: string;
  name: string;
  logo: string;
  companyName: string;
  profileImage?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  about?: string;
  founded?: string;
  benefits?: string[];
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
  hasApplied: boolean;
  skills: string[];
}

export interface JobResponse {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  applicants: number;
  postedDate: string;
  deadline: string;
  experience: "0" | "1-2" | "3-5" | "6-8" | "9-12" | "13+";
  employer: EmployerInfoDto;
  hasApplied: boolean;
  skills: string[];
}
