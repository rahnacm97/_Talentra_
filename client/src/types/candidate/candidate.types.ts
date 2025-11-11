export interface ICandidate {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  resume?: string;
  blocked: boolean;
  emailVerified: boolean;
  location?: string;
  title?: string;
  about?: string;
  skills?: string[] | null;
  experience?: Experience[] | null;
  education?: Education[] | null;
  certifications?: Certification[] | null;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
  activeApplications?: number;
  profileViews?: number;
  profileImage: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface CandidateListResponse {
  data: ICandidate[];
  total: number;
}

export interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  resume: string;
  title: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  profileImage?: string | null;
}

// export interface CandidateSignupDTO {
//   email: string;
//   password: string;
//   name: string;
//   phoneNumber: string;
// }

// export interface CandidateResponseDTO {
//   id: string;
//   email: string;
//   name: string;
//   phoneNumber?: string | null;
//   emailVerified: boolean;
//   resume?: string | null;
//   createdAt: string;
//   updatedAt: string;
//   blocked: boolean;
//   location?: string | null;
//   title?: string | null;
//   about?: string | null;
//   skills?: string[] | null;
//   experience?: Experience[] | null;
//   education?: Education[] | null;
//   certifications?: Certification[] | null;
// }
