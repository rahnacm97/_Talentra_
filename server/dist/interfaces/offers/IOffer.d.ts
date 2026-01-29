import { ApplicationStatus } from "../applications/IApplication";
export interface IOffer {
    id: string;
    jobId: string;
    candidateId: string;
    fullName: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter?: string;
    appliedAt: Date;
    status: ApplicationStatus;
    hiredAt?: Date;
    updatedAt: Date;
}
export interface IOfferWithJob extends IOffer {
    job: {
        title: string;
        location: string;
        salary?: string;
        type: string;
        description: string;
        requirements: string[];
        employerId?: string;
    };
    employer: {
        name: string;
        profileImage?: string;
    };
}
export interface IOfferQuery {
    page?: number;
    limit?: number;
    search?: string;
    jobType?: string;
    sortBy?: "salary" | "appliedAt" | "updatedAt" | "hiredAt";
    order?: "asc" | "desc";
}
//# sourceMappingURL=IOffer.d.ts.map