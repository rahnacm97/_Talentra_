import Application, {
  IApplicationDocument,
} from "../../models/Application.model";
import { IApplicationRepository } from "../../interfaces/applications/IApplicationRepository";
import { IApplication } from "../../interfaces/applications/IApplication";

export class ApplicationRepository implements IApplicationRepository {
  async create(data: Partial<IApplication>): Promise<IApplication> {
    const doc = await Application.create(data);
    return this.toDomain(doc);
  }

  async findByJobAndCandidate(
    jobId: string,
    candidateId: string,
  ): Promise<IApplication | null> {
    const doc = await Application.findOne({ jobId, candidateId });
    return doc ? this.toDomain(doc) : null;
  }

  async countByJobId(jobId: string): Promise<number> {
    return await Application.countDocuments({ jobId });
  }

  private toDomain(doc: IApplicationDocument): IApplication {
    return {
      id: doc._id.toString(),
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter ?? "",
      appliedAt: doc.appliedAt,
      status: doc.status,
    };
  }
}
