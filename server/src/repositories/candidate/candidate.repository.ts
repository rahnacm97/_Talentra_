import { BaseRepository } from "../base.repository";
import Candidate from "../../models/Candidate.model";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import { ProfileData } from "../../types/candidate/candidate.types";

export class CandidateRepository extends BaseRepository<ICandidate> {
  constructor() {
    super(Candidate);
  }

  async findByEmail(email: string): Promise<ICandidate | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }

  async updateBlockStatus(candidateId: string, block: boolean) {
    return this.model
      .findByIdAndUpdate(
        candidateId,
        { blocked: block, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();
  }
  async updateProfile(
    id: string,
    data: ProfileData,
  ): Promise<ICandidate | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          location: data.location,
          title: data.title,
          about: data.about,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          certifications: data.certifications,
          resume: data.resume,
          profileImage: data.profileImage,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .lean()
      .exec();
  }
}
