export interface ICandidate {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  resume?: string;
  blocked: boolean;
  location: string;
  title: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  about: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}
