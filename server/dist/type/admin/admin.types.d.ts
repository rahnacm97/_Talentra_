export interface AdminJobEmployer {
    id: string;
    name: string;
    profileImage: string | null;
}
export interface AdminJob {
    id: string;
    employerId: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    deadline: string;
    status: "active" | "closed" | "draft";
    experience: string;
    applicants: number;
    postedDate: string;
    hasApplied?: boolean;
    employer: AdminJobEmployer;
}
//# sourceMappingURL=admin.types.d.ts.map