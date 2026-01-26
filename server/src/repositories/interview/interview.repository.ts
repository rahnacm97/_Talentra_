import Interview, { IInterviewDocument } from "../../models/Interview.model";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import {
  IInterview,
  IInterviewQuery,
  IInterviewWithDetails,
} from "../../interfaces/interviews/IInterview";
import { PipelineStage } from "mongoose";
import mongoose from "mongoose";

export class InterviewRepository implements IInterviewRepository {
  async create(data: Partial<IInterview>): Promise<IInterview> {
    const doc = await Interview.create(data);
    return this.toDomain(doc);
  }

  async findByApplicationId(applicationId: string): Promise<IInterview | null> {
    const doc = await Interview.findOne({ applicationId }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(interviewId: string): Promise<IInterview | null> {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return null;
    }
    const doc = await Interview.findById(interviewId).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByIdWithDetails(
    interviewId: string,
  ): Promise<IInterviewWithDetails | null> {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return null;
    }

    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(interviewId) } },
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
      { $addFields: { candidateIdObj: { $toObjectId: "$candidateId" } } },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateIdObj",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: { path: "$candidate", preserveNullAndEmptyArrays: true } },
      { $addFields: { employerIdObj: { $toObjectId: "$employerId" } } },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
      { $addFields: { applicationIdObj: { $toObjectId: "$applicationId" } } },
      {
        $lookup: {
          from: "applications",
          localField: "applicationIdObj",
          foreignField: "_id",
          as: "application",
        },
      },
      { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          applicationId: 1,
          jobId: 1,
          candidateId: 1,
          employerId: 1,
          interviewDate: 1,
          status: 1,
          notes: 1,
          feedback: 1,
          createdAt: 1,
          updatedAt: 1,
          applicationStatus: "$application.status",
          job: {
            title: "$job.title",
            location: "$job.location",
            type: "$job.type",
          },
          candidate: {
            fullName: "$candidate.name",
            email: "$candidate.email",
            phone: "$candidate.phoneNumber",
            profileImage: "$candidate.profileImage",
          },
          employer: {
            name: "$employer.name",
            companyName: "$employer.name", // Using name since companyName field doesn't exist in model
            logo: "$employer.logo",
          },
        },
      },
    ];

    const docs = await Interview.aggregate(pipeline).exec();
    if (!docs || docs.length === 0) return null;

    const doc = docs[0];
    return {
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      interviewDate: doc.interviewDate,
      status: doc.status,
      notes: doc.notes,
      feedback: doc.feedback,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      job: doc.job || { title: "", location: "", type: "" },
      candidate: doc.candidate || {
        fullName: "",
        email: "",
        phone: "",
        profileImage: "",
      },
      employer: doc.employer || { name: "", companyName: "", logo: "" },
      applicationStatus: doc.applicationStatus,
    };
  }

  async findByEmployerId(
    employerId: string,
    query: IInterviewQuery = {},
  ): Promise<IInterviewWithDetails[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { employerId };

    if (query.status && query.status !== "all") {
      if (query.status === "scheduled") {
        match.status = { $in: ["scheduled", "rescheduled"] };
      } else if (query.status === "completed") {
        match.status = { $in: ["completed", "hired", "rejected"] };
      } else {
        match.status = query.status;
      }
    }

    const sort: Record<string, 1 | -1> = query.sortBy
      ? { [query.sortBy]: query.order === "desc" ? -1 : 1 }
      : { updatedAt: -1 };

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
      { $addFields: { candidateIdObj: { $toObjectId: "$candidateId" } } },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateIdObj",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: { path: "$candidate", preserveNullAndEmptyArrays: true } },
      { $addFields: { employerIdObj: { $toObjectId: "$employerId" } } },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
      { $addFields: { applicationIdObj: { $toObjectId: "$applicationId" } } },
      {
        $lookup: {
          from: "applications",
          localField: "applicationIdObj",
          foreignField: "_id",
          as: "application",
        },
      },
      { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },
    ];

    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { "job.title": searchRegex },
            { "candidate.name": searchRegex },
            { "candidate.email": searchRegex },
          ],
        },
      });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          applicationId: 1,
          jobId: 1,
          candidateId: 1,
          employerId: 1,
          interviewDate: 1,
          status: 1,
          notes: 1,
          feedback: 1,
          createdAt: 1,
          updatedAt: 1,
          applicationStatus: "$application.status",
          job: {
            title: "$job.title",
            location: "$job.location",
            type: "$job.type",
          },
          candidate: {
            fullName: "$candidate.name",
            email: "$candidate.email",
            phone: "$candidate.phoneNumber",
            profileImage: "$candidate.profileImage",
          },
          employer: {
            name: "$employer.name",
            companyName: "$employer.name", // Using name since companyName field doesn't exist in model
            logo: "$employer.logo",
          },
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    );

    const docs = await Interview.aggregate(pipeline).exec();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      interviewDate: doc.interviewDate,
      status: doc.status,
      notes: doc.notes,
      feedback: doc.feedback,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      job: doc.job || { title: "", location: "", type: "" },
      candidate: doc.candidate || {
        fullName: "",
        email: "",
        phone: "",
        profileImage: "",
      },
      employer: doc.employer || { name: "", companyName: "", logo: "" },
      applicationStatus: doc.applicationStatus,
    }));
  }

  async findByCandidateId(
    candidateId: string,
    query: IInterviewQuery = {},
  ): Promise<IInterviewWithDetails[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { candidateId };

    if (query.status && query.status !== "all") {
      if (query.status === "scheduled") {
        match.status = { $in: ["scheduled", "rescheduled"] };
      } else if (query.status === "completed") {
        match.status = { $in: ["completed", "hired", "rejected"] };
      } else {
        match.status = query.status;
      }
    }

    const sort: Record<string, 1 | -1> = query.sortBy
      ? { [query.sortBy]: query.order === "desc" ? -1 : 1 }
      : { updatedAt: -1 };

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
      { $addFields: { employerIdObj: { $toObjectId: "$employerId" } } },
      {
        $lookup: {
          from: "employers",
          localField: "employerIdObj",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
      { $addFields: { applicationIdObj: { $toObjectId: "$applicationId" } } },
      {
        $lookup: {
          from: "applications",
          localField: "applicationIdObj",
          foreignField: "_id",
          as: "application",
        },
      },
      { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },
      { $addFields: { candidateIdObj: { $toObjectId: "$candidateId" } } },
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

    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { "job.title": searchRegex },
            { "employer.name": searchRegex },
            { "employer.companyName": searchRegex },
          ],
        },
      });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          applicationId: 1,
          jobId: 1,
          candidateId: 1,
          employerId: 1,
          interviewDate: 1,
          status: 1,
          notes: 1,
          feedback: 1,
          createdAt: 1,
          updatedAt: 1,
          applicationStatus: "$application.status",
          job: {
            title: "$job.title",
            location: "$job.location",
            type: "$job.type",
          },
          candidate: {
            fullName: "$candidate.name",
            email: "$candidate.email",
            phone: "$candidate.phoneNumber",
            profileImage: "$candidate.profileImage",
          },
          employer: {
            name: "$employer.name",
            companyName: "$employer.name", // Using name since companyName field doesn't exist in model
            logo: "$employer.logo",
          },
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    );

    const docs = await Interview.aggregate(pipeline).exec();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      interviewDate: doc.interviewDate,
      status: doc.status,
      notes: doc.notes,
      feedback: doc.feedback,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      job: doc.job || { title: "", location: "", type: "" },
      candidate: doc.candidate || {
        fullName: "",
        email: "",
        phone: "",
        profileImage: "",
      },
      employer: doc.employer || { name: "", companyName: "", logo: "" },
      applicationStatus: doc.applicationStatus,
    }));
  }

  async countByEmployerId(
    employerId: string,
    filters: { status?: string; search?: string } = {},
  ): Promise<number> {
    const match: Record<string, unknown> = { employerId };

    if (filters.status && filters.status !== "all") {
      if (filters.status === "scheduled") {
        match.status = { $in: ["scheduled", "rescheduled"] };
      } else if (filters.status === "completed") {
        match.status = { $in: ["completed", "hired", "rejected"] };
      } else {
        match.status = filters.status;
      }
    }

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (filters.search?.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), "i");
      pipeline.push(
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
        { $addFields: { candidateIdObj: { $toObjectId: "$candidateId" } } },
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
          $match: {
            $or: [
              { "job.title": searchRegex },
              { "candidate.name": searchRegex },
              { "candidate.email": searchRegex },
            ],
          },
        },
      );
    }

    pipeline.push({ $count: "total" });

    const result = await Interview.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async countByCandidateId(
    candidateId: string,
    filters: { status?: string; search?: string } = {},
  ): Promise<number> {
    const match: Record<string, unknown> = { candidateId };

    if (filters.status && filters.status !== "all") {
      if (filters.status === "scheduled") {
        match.status = { $in: ["scheduled", "rescheduled"] };
      } else if (filters.status === "completed") {
        match.status = { $in: ["completed", "hired", "rejected"] };
      } else {
        match.status = filters.status;
      }
    }

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (filters.search?.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), "i");
      pipeline.push(
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
        { $addFields: { employerIdObj: { $toObjectId: "$employerId" } } },
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
          $match: {
            $or: [
              { "job.title": searchRegex },
              { "employer.name": searchRegex },
              { "employer.companyName": searchRegex },
            ],
          },
        },
      );
    }

    pipeline.push({ $count: "total" });

    const result = await Interview.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async updateOne(
    interviewId: string,
    data: Partial<IInterview>,
  ): Promise<IInterview | null> {
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return null;
    }

    const doc = await Interview.findByIdAndUpdate(
      interviewId,
      { $set: data },
      { new: true },
    ).exec();

    return doc ? this.toDomain(doc) : null;
  }

  async deleteByApplicationId(applicationId: string): Promise<boolean> {
    const result = await Interview.deleteOne({ applicationId }).exec();
    return result.deletedCount > 0;
  }

  private toDomain(doc: IInterviewDocument): IInterview {
    return {
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      ...(doc.interviewDate && { interviewDate: doc.interviewDate }),
      status: doc.status,
      ...(doc.notes && { notes: doc.notes }),
      ...(doc.feedback && { feedback: doc.feedback }),
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
    };
  }
}
