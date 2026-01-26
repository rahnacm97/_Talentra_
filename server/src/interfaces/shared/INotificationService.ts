export interface INotificationService {
  notifyCandidateInterviewScheduled(
    candidateId: string,
    jobTitle: string,
    interviewDate: string,
    interviewId: string,
    companyName: string,
  ): Promise<void>;

  notifyCandidateInterviewRescheduled(
    candidateId: string,
    jobTitle: string,
    newDate: string,
    interviewId: string,
    companyName: string,
  ): Promise<void>;

  notifyCandidateInterviewCancelled(
    candidateId: string,
    jobTitle: string,
    interviewId: string,
    companyName: string,
  ): Promise<void>;

  notifyCandidateNewFeedback(
    candidateId: string,
    jobTitle: string,
    roundName: string,
    interviewId: string,
  ): Promise<void>;

  notifyAdminNewFeedback(userId: string, userName: string): Promise<void>;

  sendInterviewScheduledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewLink: string;
    companyName: string;
  }): Promise<void>;

  sendInterviewRescheduledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewLink?: string;
    companyName: string;
  }): Promise<void>;

  sendInterviewCancelledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
  }): Promise<void>;

  sendOtp(email: string, otp: string): Promise<void>;

  sendEmployerVerificationEmail(params: {
    to: string;
    name: string;
    companyName: string;
  }): Promise<void>;

  sendEmployerRejectionEmail(params: {
    to: string;
    name: string;
    companyName: string;
    reason: string;
    loginUrl: string;
  }): Promise<void>;

  sendHiredEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
  }): Promise<void>;

  sendRejectionEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    feedback?: string;
  }): Promise<void>;

  notifyEmployerNewApplication(
    employerId: string,
    candidateName: string,
    jobTitle: string,
    jobId: string,
    applicationId: string,
  ): Promise<void>;

  notifyCandidateApplicationStatusChange(
    candidateId: string,
    status: string,
    jobTitle: string,
    jobId: string,
    applicationId: string,
    companyName: string,
  ): Promise<void>;

  notifyEmployerVerificationApproved(employerId: string): Promise<void>;

  notifyEmployerVerificationRejected(
    employerId: string,
    reason?: string,
  ): Promise<void>;

  notifyAdminEmployerVerificationSubmitted(
    employerId: string,
    employerName: string,
  ): Promise<void>;

  emitUserBlocked(userId: string, userType: "Candidate" | "Employer"): void;

  emitUserUnblocked(userId: string, userType: "Candidate" | "Employer"): void;
}
