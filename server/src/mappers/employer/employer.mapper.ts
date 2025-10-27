import { IEmployerMapper } from "../../interfaces/users/employer/IEmployerMapper";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";

export class EmployerMapper implements IEmployerMapper {
  toProfileDataDTO(employer: IEmployer): EmployerDataDTO {
    return {
      name: employer.name || "",
      email: employer.email || "",
      phone: employer.phoneNumber || "",
      location: employer.location || "",
      website: employer.website || "",
      industry: employer.industry || "",
      companySize: employer.companySize || "",
      founded: employer.founded || "",
      about: employer.about || "",
      benefits: employer.benefits || [],
      socialLinks: employer.socialLinks || {
        linkedin: "",
        twitter: "",
        facebook: "",
      },
      cinNumber: employer.cinNumber || "",
      businessLicense: employer.businessLicense || "",
      profileImage: employer.profileImage || "",
    };
  }
}
