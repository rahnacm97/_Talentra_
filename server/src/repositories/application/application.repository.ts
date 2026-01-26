import Application, {
  IApplicationDocument,
} from "../../models/Application.model";
import {
  ICandidateApplicationRepository,
  IEmployerApplicationRepository,
} from "../../interfaces/applications/IApplicationRepository";
import {
  IApplication,
  IApplicationQuery,
  IApplicationWithJob,
  IEmployerApplicationResponse,
  EmployerApplicationAggResult,
  CandidateExperience,
} from "../../interfaces/applications/IApplication";
import type { MatchFilter } from "../../type/application/application.type";
import { PipelineStage } from "mongoose";
import mongoose from "mongoose";
import JobModel from "../../models/Job.model";

export class ApplicationRepository
  implements ICandidateApplicationRepository, IEmployerApplicationRepository
{
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

  async countByCandidateId(
    candidateId: string,
    filters: { status?: IApplicationQuery["status"]; search?: string } = {},
  ): Promise<number> {
    const match: MatchFilter = { candidateId };

    if (filters.status && filters.status !== "all") {
      match.status = filters.status;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $addFields: { jobIdObj: { $toObjectId: "$jobId" } } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      {
        $addFields: { employerIdObj: { $toObjectId: "$job.employerId" } },
      },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
    ];

    if (filters.search?.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [{ "job.title": searchRegex }, { "employer.name": searchRegex }],
        },
      });
    }

    pipeline.push({ $count: "total" });

    const result = await Application.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async findByCandidateIdWithJob(
    candidateId: string,
    query: IApplicationQuery & { search?: string } = {},
  ): Promise<IApplicationWithJob[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const match: MatchFilter = { candidateId };
    if (query.status && query.status !== "all") {
      match.status = query.status;
    }

    const sort: Record<string, 1 | -1> = query.sortBy
      ? { [query.sortBy]: query.order === "desc" ? -1 : 1 }
      : { appliedAt: -1 };

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $addFields: { jobIdObj: { $toObjectId: "$jobId" } } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      {
        $addFields: { employerIdObj: { $toObjectId: "$job.employerId" } },
      },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
    ];

    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [{ "job.title": searchRegex }, { "employer.name": searchRegex }],
        },
      });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          jobId: 1,
          fullName: 1,
          email: 1,
          phone: 1,
          resume: 1,
          coverLetter: 1,
          appliedAt: 1,
          interviewDate: 1,
          status: 1,
          job: {
            title: "$job.title",
            location: "$job.location",
            salaryRange: "$job.salaryRange",
            type: "$job.type",
            description: "$job.description",
            requirements: "$job.requirements",
            employerId: "$job.employerId",
          },
          employer: "$employer",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    );

    const docs = await Application.aggregate(pipeline).exec();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      jobId: doc.jobId,
      candidateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter ?? "",
      appliedAt: doc.appliedAt,
      interviewDate: doc.interviewDate,
      status: doc.status,

      job: {
        title: doc.job.title || "Unknown Job",
        location: doc.job.location || "N/A",
        salaryRange: doc.job.salaryRange || "",
        type: doc.job.type || "Full-time",
        description: doc.job.description || "No description.",
        requirements: doc.job.requirements || [],
        employerId: doc.job.employerId,
      },

      employer: doc.employer || null,
      updatedAt: doc.updatedAt,
    }));
  }

  async findOneWithJob(
    applicationId: string,
  ): Promise<IApplicationWithJob | null> {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return null;
    }
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(applicationId) } },
      { $addFields: { jobIdObj: { $toObjectId: "$jobId" } } },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      { $addFields: { employerIdObj: { $toObjectId: "$job.employerId" } } },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          jobId: 1,
          candidateId: 1,
          fullName: 1,
          email: 1,
          phone: 1,
          resume: 1,
          coverLetter: 1,
          appliedAt: 1,
          updatedAt: 1,
          interviewDate: 1,
          status: 1,
          job: {
            title: "$job.title",
            location: "$job.location",
            salaryRange: "$job.salaryRange",
            type: "$job.type",
            description: "$job.description",
            requirements: "$job.requirements",
          },
          employer: {
            name: "$employer.name",
            companyName: "$employer.name", // Using name since companyName field doesn't exist in model
            profileImage: "$employer.logo",
          },
        },
      },
    ];

    const result = await Application.aggregate(pipeline).exec();
    if (result.length === 0) return null;

    const doc = result[0];
    return {
      id: doc._id.toString(),
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter || "",
      appliedAt: doc.appliedAt,
      interviewDate: doc.interviewDate,
      updatedAt: doc.updatedAt,
      status: doc.status,
      job: doc.job || {},
      employer: doc.employer || {},
    } as IApplicationWithJob;
  }

  async findByEmployerIdWithJob(
    employerId: string,
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      jobTitle?: string;
    } = {},
  ): Promise<IEmployerApplicationResponse[]> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.max(filters.limit ?? 10, 1);
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          jobIdObj: { $toObjectId: "$jobId" },
          candidateIdObj: { $toObjectId: "$candidateId" },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
          pipeline: [{ $match: { employerId: employerId } }],
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: false } },

      {
        $lookup: {
          from: "candidates",
          localField: "candidateIdObj",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: { path: "$candidate", preserveNullAndEmptyArrays: true } },
    ];

    if (filters.status && filters.status !== "all") {
      pipeline.push({ $match: { status: filters.status } });
    }

    if (filters.search?.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { fullName: searchRegex },
            { email: searchRegex },
            { "job.title": searchRegex },
            { "candidate.title": searchRegex },
          ],
        },
      });
    }

    if (filters.jobTitle && filters.jobTitle !== "all") {
      const titleRegex = new RegExp(filters.jobTitle.trim(), "i");
      pipeline.push({
        $match: { "job.title": titleRegex },
      });
    }

    pipeline.push({
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        jobId: "$jobId",
        fullName: 1,
        email: 1,
        phone: 1,
        resume: 1,
        coverLetter: { $ifNull: ["$coverLetter", ""] },
        appliedAt: 1,
        status: 1,
        interviewDate: 1,
        rating: { $ifNull: ["$rating", 0] },
        notes: { $ifNull: ["$notes", ""] },

        jobTitle: "$job.title",
        name: "$job.employer.name",
        jobLocation: "$job.location",
        salaryRange: "$job.salaryRange",
        jobType: "$job.type",

        candidate: {
          profileImage: { $ifNull: ["$candidate.profileImage", ""] },
          location: { $ifNull: ["$candidate.location", ""] },
          title: { $ifNull: ["$candidate.title", ""] },
          about: { $ifNull: ["$candidate.about", ""] },
          skills: { $ifNull: ["$candidate.skills", []] },
          experience: { $ifNull: ["$candidate.experience", []] },
          education: { $ifNull: ["$candidate.education", []] },
          resume: { $ifNull: ["$candidate.resume", ""] },
        },
      },
    });

    const result = await Application.aggregate(pipeline)
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return result.map((doc: EmployerApplicationAggResult) => ({
      id: doc.id,
      jobId: doc.jobId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter ?? "",
      appliedAt: doc.appliedAt,
      status: doc.status,
      rating: doc.rating ?? 0,
      notes: doc.notes ?? "",

      jobTitle: doc.jobTitle,
      name: doc.name,
      jobLocation: doc.jobLocation || "",
      salaryRange: doc.salaryRange || "",
      jobType: doc.jobType || "Full-time",
      interviewDate: doc.interviewDate,
      candidate: doc.candidate
        ? {
            profileImage: doc.candidate.profileImage || "",
            location: doc.candidate?.location || "",
            title: doc.candidate?.title || "",
            about: doc.candidate?.about || "",
            skills: doc.candidate?.skills ?? [],
            experience: doc.candidate?.experience ?? [],
            education: doc.candidate?.education ?? [],
            resume: doc.candidate?.resume || "",
          }
        : undefined,

      experienceYears: doc.candidate?.experience
        ? doc.candidate?.experience.reduce(
            (total: number, exp: CandidateExperience) => {
              const start = new Date(exp.startDate).getFullYear();
              const end = exp.current
                ? new Date().getFullYear()
                : new Date(exp.endDate || Date.now()).getFullYear();
              return total + (end - start);
            },
            0,
          )
        : 0,
    }));
  }

  async countByEmployerId(
    employerId: string,
    filters: {
      search?: string;
      status?: string;
      jobTitle?: string;
    } = {},
  ): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          jobIdObj: { $toObjectId: "$jobId" },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
          pipeline: [{ $match: { employerId } }],
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: false } },
    ];

    if (filters.status && filters.status !== "all") {
      pipeline.push({ $match: { status: filters.status } });
    }

    if (filters.search?.trim()) {
      const regex = new RegExp(filters.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [{ fullName: regex }, { email: regex }, { "job.title": regex }],
        },
      });
    }

    if (filters.jobTitle && filters.jobTitle !== "all") {
      pipeline.push({
        $match: { "job.title": new RegExp(filters.jobTitle.trim(), "i") },
      });
    }

    pipeline.push({ $count: "total" });

    const result = await Application.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async updateOne(
    applicationId: string,
    data: { status?: string; notes?: string; rating?: number },
  ): Promise<IApplication | null> {
    const doc = await Application.findByIdAndUpdate(
      applicationId,
      { $set: data },
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async findByIdForEmployer(
    applicationId: string,
    employerId: string,
  ): Promise<IEmployerApplicationResponse | null> {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(applicationId) } },
      {
        $addFields: {
          jobIdObj: { $toObjectId: "$jobId" },
          candidateIdObj: { $toObjectId: "$candidateId" },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobIdObj",
          foreignField: "_id",
          as: "job",
          pipeline: [{ $match: { employerId: employerId } }],
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateIdObj",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: { path: "$candidate", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          candidateId: "$candidateId",
          jobId: "$jobId",
          fullName: 1,
          email: 1,
          phone: 1,
          resume: 1,
          coverLetter: { $ifNull: ["$coverLetter", ""] },
          appliedAt: 1,
          status: 1,
          interviewDate: 1,
          rating: { $ifNull: ["$rating", 0] },
          notes: { $ifNull: ["$notes", ""] },
          jobTitle: "$job.title",
          name: "$job.employer.name",
          jobLocation: "$job.location",
          salaryRange: "$job.salaryRange",
          jobType: "$job.type",
          candidate: {
            profileImage: { $ifNull: ["$candidate.profileImage", ""] },
            location: { $ifNull: ["$candidate.location", ""] },
            title: { $ifNull: ["$candidate.title", ""] },
            about: { $ifNull: ["$candidate.about", ""] },
            skills: { $ifNull: ["$candidate.skills", []] },
            experience: { $ifNull: ["$candidate.experience", []] },
            education: { $ifNull: ["$candidate.education", []] },
            resume: { $ifNull: ["$candidate.resume", ""] },
          },
        },
      },
    ];

    const result = await Application.aggregate(pipeline).exec();
    if (result.length === 0) return null;

    const doc = result[0] as EmployerApplicationAggResult;
    return {
      id: doc.id,
      candidateId: doc.candidateId,
      jobId: doc.jobId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter ?? "",
      appliedAt: doc.appliedAt,
      status: doc.status,
      rating: doc.rating ?? 0,
      notes: doc.notes ?? "",
      jobTitle: doc.jobTitle,
      name: doc.name,
      jobLocation: doc.jobLocation || "",
      salaryRange: doc.salaryRange || "",
      jobType: doc.jobType || "Full-time",
      interviewDate: doc.interviewDate,
      candidate: doc.candidate
        ? {
            profileImage: doc.candidate.profileImage || "",
            location: doc.candidate.location || "",
            title: doc.candidate.title || "",
            about: doc.candidate.about || "",
            skills: doc.candidate.skills ?? [],
            experience: doc.candidate.experience ?? [],
            education: doc.candidate.education ?? [],
            resume: doc.candidate.resume || "",
          }
        : undefined,
      experienceYears: doc.candidate?.experience
        ? doc.candidate.experience.reduce(
            (total: number, exp: CandidateExperience) => {
              const start = new Date(exp.startDate).getFullYear();
              const end = exp.current
                ? new Date().getFullYear()
                : new Date(exp.endDate || Date.now()).getFullYear();
              return total + (end - start);
            },
            0,
          )
        : 0,
    };
  }

  async findByIdAndEmployer(
    applicationId: string,
    employerId: string,
  ): Promise<IApplication | null> {
    const doc = await Application.findOne({ _id: applicationId });

    if (!doc) return null;

    const job = await JobModel.findOne({ _id: doc.jobId, employerId });
    if (!job) return null;

    return this.toDomain(doc);
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
      interviewDate: doc.interviewDate,
      status: doc.status,
    };
  }
}
