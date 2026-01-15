export interface CandidateListResponse {
  data: Candidate[];
  total: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  resume?: string;
  profileImage: string;
  blocked: boolean;
  emailVerified: boolean;
  location?: string;
  title?: string;
  about?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
  activeApplications?: number;
  profileViews?: number;
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

export interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  resume: string;
  profileImage: string;
  title: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export interface CandidateState {
  candidates: Candidate[];
  total: number;
  selectedCandidate: Candidate | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}
