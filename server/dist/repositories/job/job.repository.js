"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const Job_model_1 = __importDefault(require("../../models/Job.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class JobRepository {
    constructor() {
        this._SKILL_KEYWORDS = [
            "react",
            "node",
            "javascript",
            "typescript",
            "python",
            "java",
            "php",
            "aws",
            "docker",
            "mongodb",
            "postgresql",
            "mysql",
            "redis",
            "graphql",
            "next.js",
            "vue",
            "angular",
            "git",
            "ci/cd",
            "kubernetes",
            "html",
            "css",
        ];
    }
    _extractSkills(requirements) {
        const found = new Set();
        const text = requirements
            .join(" ")
            .toLowerCase()
            .replace(/[^\w\s+]/g, " ")
            .replace(/\s+/g, " ");
        for (const keyword of this._SKILL_KEYWORDS) {
            const variants = [
                keyword,
                keyword.replace(".", ""),
                keyword.replace(/\//g, ""),
                keyword.replace(/\s/g, ""),
            ];
            const regex = new RegExp(`\\b(${variants.join("|")})\\b`, "i");
            if (regex.test(text)) {
                found.add(keyword);
            }
        }
        return Array.from(found);
    }
    async create(jobData) {
        return await Job_model_1.default.create(jobData);
    }
    async findByEmployerId(employerId) {
        return await Job_model_1.default.find({ employerId }).sort({ postedDate: -1 });
    }
    async findByIdAndEmployer(jobId, employerId) {
        return await Job_model_1.default.findOne({ _id: jobId, employerId });
    }
    async update(jobId, updateData) {
        return await Job_model_1.default.findByIdAndUpdate(jobId, updateData, { new: true });
    }
    async delete(jobId) {
        return await Job_model_1.default.findByIdAndDelete(jobId);
    }
    async findPaginated(employerId, { page = 1, limit = 10, search = "", status, }) {
        const skip = (page - 1) * limit;
        const query = { employerId };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { department: { $regex: search, $options: "i" } },
            ];
        }
        if (status && status !== "all")
            query.status = status;
        const [jobs, total] = await Promise.all([
            Job_model_1.default.find(query).sort({ postedDate: -1 }).skip(skip).limit(limit).lean(),
            Job_model_1.default.countDocuments(query),
        ]);
        return { jobs, total, page, limit };
    }
    async closeJob(jobId) {
        return Job_model_1.default.findByIdAndUpdate(jobId, { status: "closed" }, { new: true });
    }
    async findPublicPaginated(params) {
        const { page, limit, search, location, type, experience, skills } = params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const pipeline = [
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
        const matchConditions = {};
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
            }
            else {
                matchConditions.experience = experience;
            }
        }
        if (skills?.length) {
            const pattern = skills
                .map((s) => `\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
                .join("|");
            matchConditions.requirements = {
                $elemMatch: {
                    $regex: pattern,
                    $options: "i",
                },
            };
        }
        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }
        const totalPipeline = [...pipeline, { $count: "total" }];
        const jobsPipeline = [
            ...pipeline,
            { $sort: { postedDate: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];
        const [totalResult, jobs] = await Promise.all([
            Job_model_1.default.aggregate(totalPipeline).exec(),
            Job_model_1.default.aggregate(jobsPipeline).exec(),
        ]);
        const jobsWithSkills = jobs.map((job) => ({
            ...job,
            extractedSkills: this._extractSkills(job.requirements ?? []),
        }));
        const formattedJobs = jobsWithSkills.map((job) => ({
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
            jobs: formattedJobs,
            total: totalResult[0]?.total ?? 0,
        };
    }
    async getAvailableSkills() {
        const escaped = this._SKILL_KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        const pattern = escaped.map((k) => `\\b${k}\\b`).join("|");
        const pipeline = [
            { $match: { deadline: { $gte: new Date() } } },
            { $unwind: "$requirements" },
            {
                $match: {
                    $expr: {
                        $regexMatch: {
                            input: { $toLower: "$requirements" },
                            regex: pattern,
                            options: "i",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    skills: { $addToSet: { $toLower: "$requirements" } },
                },
            },
        ];
        const result = await Job_model_1.default.aggregate(pipeline);
        const raw = result[0]?.skills ?? [];
        return this._SKILL_KEYWORDS
            .filter((kw) => raw.some((s) => new RegExp(`\\b${kw}\\b`, "i").test(s)))
            .sort();
    }
    async findById(id) {
        const result = await Job_model_1.default.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
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
        if (!result[0])
            return null;
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
        };
    }
    async countAll() {
        return await Job_model_1.default.countDocuments({});
    }
    async findAllAdminPaginated(params) {
        const { page, limit, search, status, type } = params;
        const skip = (page - 1) * limit;
        const pipeline = [
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
                                name: "$name",
                                profileImage: "$profileImage",
                                _id: 1,
                            },
                        },
                    ],
                    as: "employer",
                },
            },
            { $unwind: { path: "$employer", preserveNullAndEmptyArrays: true } },
        ];
        const matchConditions = {};
        if (search) {
            matchConditions.$or = [
                { title: { $regex: search, $options: "i" } },
                { "employer.name": { $regex: search, $options: "i" } },
            ];
        }
        if (status && status !== "all") {
            matchConditions.status = status;
        }
        if (type && type !== "all") {
            matchConditions.type = { $regex: `^${type}$`, $options: "i" };
        }
        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }
        const totalPipeline = [...pipeline, { $count: "total" }];
        const jobsPipeline = [
            ...pipeline,
            { $sort: { postedDate: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];
        const [totalResult, jobs] = await Promise.all([
            Job_model_1.default.aggregate(totalPipeline).exec(),
            Job_model_1.default.aggregate(jobsPipeline).exec(),
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
            jobs: formattedJobs,
            total: totalResult[0]?.total ?? 0,
        };
    }
    async incrementApplicants(jobId) {
        await Job_model_1.default.updateOne({ _id: new Object(jobId) }, { $inc: { applicants: 1 } });
    }
    async count(query = {}) {
        return await Job_model_1.default.countDocuments(query);
    }
    async aggregate(pipeline) {
        return (await Job_model_1.default.aggregate(pipeline).exec());
    }
}
exports.JobRepository = JobRepository;
//# sourceMappingURL=job.repository.js.map