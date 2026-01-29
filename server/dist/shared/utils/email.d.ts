interface InterviewEmailData {
    to: string;
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewLink?: string;
    companyName?: string;
}
export declare const sendInterviewScheduledEmail: (data: InterviewEmailData) => Promise<void>;
export declare const sendHiredEmail: (data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
}) => Promise<void>;
export declare const sendRejectionEmail: (data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    feedback?: string;
}) => Promise<void>;
export declare const sendInterviewRescheduledEmail: (data: InterviewEmailData) => Promise<void>;
export declare const sendInterviewCancelledEmail: (data: Omit<InterviewEmailData, "interviewDate" | "interviewLink">) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map