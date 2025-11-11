export interface IApplication {
  id: string;
  jobId: string;
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  appliedAt: Date;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}
