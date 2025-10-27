export interface EmployerDataDTO {
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
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  cinNumber: string;
  businessLicense?: string;
  profileImage?: string;
}
