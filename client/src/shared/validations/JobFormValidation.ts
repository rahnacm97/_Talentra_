import { z } from "zod";

const salaryRegex =
  /^[\$₹€]?\s*\d{1,3}(k|L|,\d{3})?\s*-\s*[\$₹€]?\s*\d{1,3}(k|L|,\d{3})?$/i;

export const experienceRanges = [
  "0",
  "1-2",
  "3-5",
  "6-8",
  "9-12",
  "13+",
] as const;

export type ExperienceLevel = (typeof experienceRanges)[number];

export const jobFormSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(100, "Job title must not exceed 100 characters"),

  department: z
    .string()
    .min(2, "Department name is too short")
    .max(50, "Department name is too long"),

  location: z
    .string()
    .min(2, "Location is too short")
    .max(100, "Location is too long"),

  type: z.enum(["Full-time", "Part-time", "Contract", "Internship", "all"], {
    message: "Please select a job type",
  }),

  salary: z
    .string()
    .regex(
      salaryRegex,
      "Invalid salary format. Use: $50k - $80k or ₹40L - ₹60L",
    )
    .or(z.literal("").transform(() => null))
    .nullable(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description is too long (max 2000 chars)"),

  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty"))
    .min(1, "Add at least one requirement"),

  responsibilities: z
    .array(z.string().min(1, "Responsibility cannot be empty"))
    .min(1, "Add at least one responsibility"),

  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Deadline cannot be in the past"),

  // experience: z
  //   .enum(experienceRanges, {
  //     message: "Please select experience level",
  //   })
  //   .default("0"),

  experience: z.enum(experienceRanges).default("0"),

  status: z.enum(["active", "closed", "draft"]).optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
