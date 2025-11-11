export interface CandidateSignupDTO {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface CandidateResponseDTO {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | undefined;
  emailVerified: boolean;
  resume?: string | undefined;
  createdAt: string;
  updatedAt: string;
  blocked: boolean;
}

export interface ProfileDataDTO {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  title: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  resume: string;
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
