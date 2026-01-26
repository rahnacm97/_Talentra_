import InterviewRound, {
  IInterviewRoundDocument,
} from "../../models/InterviewRound.model";
import { IInterviewRoundRepository } from "../../interfaces/interviews/IInterviewRepository";
import {
  IInterviewRound,
  IInterviewRoundQuery,
  IInterviewRoundWithDetails,
} from "../../interfaces/interviews/IInterview";
import { PipelineStage } from "mongoose";
import mongoose from "mongoose";

export class InterviewRoundRepository implements IInterviewRoundRepository {
  async create(data: Partial<IInterviewRound>): Promise<IInterviewRound> {
    const doc = await InterviewRound.create(data);
    return this.toDomain(doc);
  }

  async findById(roundId: string): Promise<IInterviewRound | null> {
    if (!mongoose.Types.ObjectId.isValid(roundId)) {
      return null;
    }
    const doc = await InterviewRound.findById(roundId).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByIdWithDetails(
    roundId: string,
  ): Promise<IInterviewRoundWithDetails | null> {
    if (!mongoose.Types.ObjectId.isValid(roundId)) {
      return null;
    }

    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(roundId) } },
      ...this.getDetailsPipeline(),
    ];

    const docs = await InterviewRound.aggregate(pipeline).exec();
    if (!docs || docs.length === 0) return null;

    return this.toDetailedDomain(docs[0]);
  }

  async findByApplicationId(
    applicationId: string,
    query: IInterviewRoundQuery = {},
  ): Promise<IInterviewRoundWithDetails[]> {
    const match: Record<string, unknown> = { applicationId };

    if (query.status && query.status !== "all") {
      match.status = query.status;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      ...this.getDetailsPipeline(),
      { $sort: { roundNumber: 1 } },
    ];

    const docs = await InterviewRound.aggregate(pipeline).exec();
    return docs.map((doc) => this.toDetailedDomain(doc));
  }

  async findByCandidateId(
    candidateId: string,
    query: IInterviewRoundQuery = {},
  ): Promise<IInterviewRoundWithDetails[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { candidateId };

    if (query.status && query.status !== "all") {
      match.status = query.status;
    }

    const sort: Record<string, 1 | -1> = query.sortBy
      ? { [query.sortBy]: query.order === "desc" ? -1 : 1 }
      : { scheduledDate: -1 };

    const pipeline: PipelineStage[] = [
      { $match: match },
      ...this.getDetailsPipeline(),
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

    pipeline.push({ $sort: sort }, { $skip: skip }, { $limit: limit });

    const docs = await InterviewRound.aggregate(pipeline).exec();
    return docs.map((doc) => this.toDetailedDomain(doc));
  }

  async findByEmployerId(
    employerId: string,
    query: IInterviewRoundQuery = {},
  ): Promise<IInterviewRoundWithDetails[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { employerId };

    if (query.status && query.status !== "all") {
      match.status = query.status;
    }

    const sort: Record<string, 1 | -1> = query.sortBy
      ? { [query.sortBy]: query.order === "desc" ? -1 : 1 }
      : { scheduledDate: -1 };

    const pipeline: PipelineStage[] = [
      { $match: match },
      ...this.getDetailsPipeline(),
    ];

    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { "job.title": searchRegex },
            { "candidate.fullName": searchRegex },
            { "candidate.email": searchRegex },
          ],
        },
      });
    }

    pipeline.push({ $sort: sort }, { $skip: skip }, { $limit: limit });

    const docs = await InterviewRound.aggregate(pipeline).exec();
    return docs.map((doc) => this.toDetailedDomain(doc));
  }

  async findByMeetingToken(
    roundId: string,
    token: string,
  ): Promise<IInterviewRound | null> {
    if (!mongoose.Types.ObjectId.isValid(roundId)) {
      return null;
    }

    const doc = await InterviewRound.findOne({
      _id: roundId,
      meetingToken: token,
    }).exec();

    return doc ? this.toDomain(doc) : null;
  }

  async updateOne(
    roundId: string,
    data: Partial<IInterviewRound>,
  ): Promise<IInterviewRound | null> {
    if (!mongoose.Types.ObjectId.isValid(roundId)) {
      return null;
    }

    const doc = await InterviewRound.findByIdAndUpdate(
      roundId,
      { $set: data },
      { new: true },
    ).exec();

    return doc ? this.toDomain(doc) : null;
  }

  async countByApplicationId(applicationId: string): Promise<number> {
    return await InterviewRound.countDocuments({ applicationId }).exec();
  }

  async countByStatus(applicationId: string, status: string): Promise<number> {
    return await InterviewRound.countDocuments({
      applicationId,
      status,
    }).exec();
  }

  async countByCandidateId(
    candidateId: string,
    filters: { status?: string; search?: string } = {},
  ): Promise<number> {
    const match: Record<string, unknown> = { candidateId };

    if (filters.status && filters.status !== "all") {
      match.status = filters.status;
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

    const result = await InterviewRound.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async countByEmployerId(
    employerId: string,
    filters: { status?: string; search?: string } = {},
  ): Promise<number> {
    const match: Record<string, unknown> = { employerId };

    if (filters.status && filters.status !== "all") {
      match.status = filters.status;
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

    const result = await InterviewRound.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }

  async deleteById(roundId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(roundId)) {
      return false;
    }
    const result = await InterviewRound.findByIdAndDelete(roundId).exec();
    return !!result;
  }

  private getDetailsPipeline(): PipelineStage[] {
    return [
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
      {
        $lookup: {
          from: "interviewfeedbacks",
          localField: "roundIdStr",
          foreignField: "roundId",
          as: "feedbacks",
        },
      },
      {
        $project: {
          _id: 1,
          applicationId: 1,
          jobId: 1,
          candidateId: 1,
          employerId: 1,
          roundNumber: 1,
          roundType: 1,
          customRoundName: 1,
          scheduledDate: 1,
          status: 1,
          meetingLink: 1,
          meetingToken: 1,
          duration: 1,
          notes: 1,
          createdAt: 1,
          updatedAt: 1,
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
            companyName: "$employer.name",
            logo: "$employer.logo",
          },
          feedbackCount: { $size: "$feedbacks" },
        },
      },
    ];
  }

  private toDomain(doc: IInterviewRoundDocument): IInterviewRound {
    return {
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      roundNumber: doc.roundNumber,
      roundType: doc.roundType,
      ...(doc.customRoundName && { customRoundName: doc.customRoundName }),
      ...(doc.scheduledDate && { scheduledDate: doc.scheduledDate }),
      status: doc.status,
      meetingLink: doc.meetingLink,
      meetingToken: doc.meetingToken,
      ...(doc.duration && { duration: doc.duration }),
      ...(doc.notes && { notes: doc.notes }),
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
    };
  }

  private toDetailedDomain(
    doc: IInterviewRoundDocument & {
      job?: { title: string; location: string; type: string };
      candidate?: {
        fullName: string;
        email: string;
        phone: string;
        profileImage?: string;
      };
      employer?: { name: string; companyName: string; logo?: string };
      feedbackCount?: number;
    },
  ): IInterviewRoundWithDetails {
    return {
      id: doc._id.toString(),
      applicationId: doc.applicationId,
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      employerId: doc.employerId,
      roundNumber: doc.roundNumber,
      roundType: doc.roundType,
      ...(doc.customRoundName && { customRoundName: doc.customRoundName }),
      ...(doc.scheduledDate && { scheduledDate: doc.scheduledDate }),
      status: doc.status,
      meetingLink: doc.meetingLink,
      meetingToken: doc.meetingToken,
      ...(doc.duration && { duration: doc.duration }),
      ...(doc.notes && { notes: doc.notes }),
      ...(doc.createdAt && { createdAt: doc.createdAt }),
      ...(doc.updatedAt && { updatedAt: doc.updatedAt }),
      job: doc.job || { title: "", location: "", type: "" },
      candidate: doc.candidate || {
        fullName: "",
        email: "",
        phone: "",
        profileImage: "",
      },
      employer: doc.employer || { name: "", companyName: "", logo: "" },
      feedbackCount: doc.feedbackCount || 0,
    };
  }
}
