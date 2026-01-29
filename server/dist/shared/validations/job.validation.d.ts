import { z } from "zod";
export declare const experienceRanges: readonly ["0", "1-2", "3-5", "6-8", "9-12", "13+"];
export type ExperienceLevel = (typeof experienceRanges)[number];
export declare const createJobSchema: z.ZodObject<{
    title: z.ZodString;
    department: z.ZodString;
    location: z.ZodString;
    type: z.ZodEnum<{
        "Full-time": "Full-time";
        "Part-time": "Part-time";
        Contract: "Contract";
        Internship: "Internship";
    }>;
    salary: z.ZodString;
    description: z.ZodString;
    requirements: z.ZodArray<z.ZodString>;
    responsibilities: z.ZodArray<z.ZodString>;
    deadline: z.ZodString;
    experience: z.ZodEnum<{
        0: "0";
        "1-2": "1-2";
        "3-5": "3-5";
        "6-8": "6-8";
        "9-12": "9-12";
        "13+": "13+";
    }>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        closed: "closed";
        active: "active";
        draft: "draft";
    }>>>;
}, z.core.$strip>;
export type CreateJobDto = z.infer<typeof createJobSchema>;
export declare const updateJobSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        "Full-time": "Full-time";
        "Part-time": "Part-time";
        Contract: "Contract";
        Internship: "Internship";
    }>>;
    salary: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    responsibilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deadline: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodEnum<{
        0: "0";
        "1-2": "1-2";
        "3-5": "3-5";
        "6-8": "6-8";
        "9-12": "9-12";
        "13+": "13+";
    }>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        closed: "closed";
        active: "active";
        draft: "draft";
    }>>>>;
}, z.core.$strip>;
export type UpdateJobDto = z.infer<typeof updateJobSchema>;
//# sourceMappingURL=job.validation.d.ts.map