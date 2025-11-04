import { IJobRepository } from "../../interfaces/jobs/IJobRepository";
import Job from "../../models/Job.model";
import { IJob, ExperienceLevel } from "../../interfaces/jobs/IJob";
import { FilterQuery, PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class JobRepository implements IJobRepository {
  async create(jobData: Partial<IJob>): Promise<IJob> {
    return await Job.create(jobData);
  }

  async findByEmployerId(employerId: string): Promise<IJob[]> {
    return await Job.find({ employerId }).sort({ postedDate: -1 });
  }

  async findByIdAndEmployer(
    jobId: string,
    employerId: string,
  ): Promise<IJob | null> {
    return await Job.findOne({ _id: jobId, employerId });
  }

  async update(jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
    return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
  }

  async delete(jobId: string): Promise<IJob | null> {
    return await Job.findByIdAndDelete(jobId);
  }

  async findPaginated(
    employerId: string,
    {
      page = 1,
      limit = 10,
      search = "",
      status,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
  ) {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IJob> = { employerId };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") query.status = status;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ postedDate: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    return { jobs, total, page, limit };
  }

  async closeJob(jobId: string): Promise<IJob | null> {
    return Job.findByIdAndUpdate(jobId, { status: "closed" }, { new: true });
  }

  async findPublicPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
  }): Promise<{ jobs: (IJob & { employer?: IEmployer })[]; total: number }> {
    const { page, limit, search, location, type, experience } = params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pipeline: PipelineStage[] = [
      {
        $match: {
          deadline: { $gte: today },
        },
      },
      {
        $lookup: {
          from: "employers",
          let: { employerId: "$employerId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$employerId" }] },
              },
            },
            {
              $project: {
                name: 1,
                profileImage: 1,
                companySize: 1,
                industry: 1,
                website: 1,
                about: 1,
                founded: 1,
                benefits: 1,
              },
            },
          ],
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
    ];

    const matchConditions: Record<string, unknown> = {};
    if (search) {
      matchConditions.$or = [
        { title: { $regex: search, $options: "i" } },
        { "employer.name": { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      matchConditions.location = { $regex: location, $options: "i" };
    }

    if (type && type !== "all") {
      matchConditions.type = { $regex: `^${type}$`, $options: "i" };
    }

    if (experience) {
      if (experience === "0") {
        matchConditions.$or = [
          { experience: "0" },
          { experience: { $exists: false } },
        ];
      } else {
        matchConditions.experience = experience;
      }
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    const totalPipeline = [...pipeline, { $count: "total" }];
    const jobsPipeline = [
      ...pipeline,
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { postedDate: -1 } as const },
    ];

    const [totalResult, jobs] = await Promise.all([
      Job.aggregate(totalPipeline).exec(),
      Job.aggregate(jobsPipeline).exec(),
    ]);

    const formattedJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(),
      employerId: job.employerId.toString(),
      employer: job.employer
        ? {
            ...job.employer,
            _id: job.employer._id.toString(),
          }
        : null,
    }));

    return {
      jobs: formattedJobs as (IJob & { employer?: IEmployer })[],
      total: totalResult[0]?.total ?? 0,
    };
  }

  async findById(
    id: string,
  ): Promise<(IJob & { employer?: IEmployer }) | null> {
    const result = await Job.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "employers",
          let: { employerId: "$employerId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$employerId" }] },
              },
            },
            {
              $project: {
                name: 1,
                profileImage: 1,
                companySize: 1,
                industry: 1,
                website: 1,
                about: 1,
                founded: 1,
                benefits: 1,
              },
            },
          ],
          as: "employer",
        },
      },
      { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
    ]).exec();

    if (!result[0]) return null;

    const job = result[0];
    return {
      ...job,
      _id: job._id.toString(),
      employerId: job.employerId.toString(),
      employer: job.employer
        ? {
            ...job.employer,
            _id: job.employer._id.toString(),
          }
        : null,
    } as IJob & { employer?: IEmployer };
  }

  async countAll(): Promise<number> {
    return await Job.countDocuments({});
  }
}
