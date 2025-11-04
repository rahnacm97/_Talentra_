import { z } from "zod";

export const experienceRanges = [
  "0",
  "1-2",
  "3-5",
  "6-8",
  "9-12",
  "13+",
] as const;
export type ExperienceLevel = (typeof experienceRanges)[number];

export const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  department: z.string().min(2).max(50),
  location: z.string().min(2).max(100),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  salary: z.string(),
  description: z.string().min(50).max(2000),
  requirements: z.array(z.string().min(1)).min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  deadline: z.string().refine((d) => new Date(d) > new Date(), {
    message: "Deadline must be in the future",
  }),
  experience: z.enum(experienceRanges),
  status: z.enum(["active", "closed", "draft"]).optional().default("active"),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
