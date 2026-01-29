import Application from "../../models/Application.model";
import { IOfferRepository } from "../../interfaces/offers/IOfferRepository";
import { IOfferWithJob, IOfferQuery } from "../../interfaces/offers/IOffer";
import { PipelineStage } from "mongoose";

export class OfferRepository implements IOfferRepository {
  async findByCandidateId(
    candidateId: string,
    query: IOfferQuery,
  ): Promise<IOfferWithJob[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      { $match: { candidateId, status: "hired" } },
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

    if (query.jobType) {
      pipeline.push({
        $match: { "job.type": query.jobType },
      });
    }

    const sortField =
      query.sortBy === "salary" ? "job.salary" : query.sortBy || "updatedAt";
    const sortOrder = query.order === "asc" ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });

    pipeline.push(
      { $skip: skip },
      { $limit: limit },
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
          status: 1,
          hiredAt: 1,
          updatedAt: 1,
          job: {
            title: "$job.title",
            location: "$job.location",
            salary: "$job.salary",
            type: "$job.type",
            description: "$job.description",
            requirements: "$job.requirements",
          },
          employer: {
            name: "$employer.name",
            profileImage: "$employer.profileImage",
          },
        },
      },
    );

    const docs = await Application.aggregate(pipeline).exec();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      jobId: doc.jobId,
      candidateId: doc.candidateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      resume: doc.resume,
      coverLetter: doc.coverLetter || "",
      appliedAt: doc.appliedAt,
      status: doc.status,
      hiredAt: doc.hiredAt,
      updatedAt: doc.updatedAt,
      job: doc.job || {},
      employer: doc.employer || {},
    }));
  }

  async countByCandidateId(
    candidateId: string,
    filters: { search?: string; jobType?: string },
  ): Promise<number> {
    const pipeline: PipelineStage[] = [
      { $match: { candidateId, status: "hired" } },
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

    if (filters.jobType) {
      pipeline.push({
        $match: { "job.type": filters.jobType },
      });
    }

    pipeline.push({ $count: "total" });

    const result = await Application.aggregate(pipeline).exec();
    return result[0]?.total ?? 0;
  }
}
