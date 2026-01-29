"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = exports.experienceRanges = void 0;
const zod_1 = require("zod");
exports.experienceRanges = [
    "0",
    "1-2",
    "3-5",
    "6-8",
    "9-12",
    "13+",
];
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    department: zod_1.z.string().min(2).max(50),
    location: zod_1.z.string().min(2).max(100),
    type: zod_1.z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    salary: zod_1.z.string(),
    description: zod_1.z.string().min(50).max(2000),
    requirements: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    responsibilities: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    deadline: zod_1.z.string().refine((d) => new Date(d) > new Date(), {
        message: "Deadline must be in the future",
    }),
    experience: zod_1.z.enum(exports.experienceRanges),
    status: zod_1.z.enum(["active", "closed", "draft"]).optional().default("active"),
});
exports.updateJobSchema = exports.createJobSchema.partial();
//# sourceMappingURL=job.validation.js.map