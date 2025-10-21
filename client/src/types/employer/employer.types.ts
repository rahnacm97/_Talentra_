export interface IEmployer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  website: string;
  industry: string;
  companySize: string;
  founded: string;
  about: string;
  benefits: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  postedJobs: PostedJob[];
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiredThisMonth: number;
  };
  blocked: boolean;
}

export interface PostedJob {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  applicants: number;
  status: string;
  description: string;
}

export interface EmployerProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  industry: string;
  companySize: string;
  founded: string;
  about: string;
  benefits: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  postedJobs: PostedJob[];
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    hiredThisMonth: number;
  };
}
