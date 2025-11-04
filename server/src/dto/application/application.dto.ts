export interface ApplicationResponseDto {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}
