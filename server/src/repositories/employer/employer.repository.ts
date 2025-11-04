import { BaseRepository } from "../base.repository";
import Employer from "../../models/Employer.model";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
import { EmployerDataDTO } from "../../dto/employer/employer.dto";
import { IEmployerVerificationRepo } from "../../interfaces/users/employer/IEmployerVerifyRepo";

export class EmployerRepository
  extends BaseRepository<IEmployer>
  implements IEmployerVerificationRepo
{
  constructor() {
    super(Employer);
  }

  async findByEmail(email: string): Promise<IEmployer | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }

  async updateBlockStatus(employerId: string, block: boolean) {
    return this.model.findByIdAndUpdate(
      employerId,
      { blocked: block, updatedAt: new Date() },
      { new: true },
    );
  }

  async updateVerificationStatus(id: string, verified: boolean) {
    return this.model.findByIdAndUpdate(id, { verified }, { new: true }).lean();
  }

  async updateProfile(
    employerId: string,
    data: EmployerDataDTO,
  ): Promise<IEmployer | null> {
    return this.model
      .findByIdAndUpdate(
        employerId,
        {
          $set: {
            name: data.name,
            email: data.email,
            phoneNumber: data.phone,
            location: data.location,
            website: data.website,
            industry: data.industry,
            companySize: data.companySize,
            founded: data.founded,
            about: data.about,
            benefits: data.benefits,
            socialLinks: data.socialLinks,
            cinNumber: data.cinNumber,
            businessLicense: data.businessLicense,
            profileImage: data.profileImage,
            updatedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  async isVerified(employerId: string): Promise<boolean> {
    const employer = await this.model
      .findById(employerId)
      .select("verified")
      .lean()
      .exec();

    return employer?.verified ?? false;
  }
}
