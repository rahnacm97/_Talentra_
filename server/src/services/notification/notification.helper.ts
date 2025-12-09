import { notificationSocket } from "../../app";
import { NotificationService } from "../notification/notification.service";
import { NotificationRepository } from "../../repositories/notification/notification.repository";
import { NotificationMapper } from "../../mappers/notification/notification.mapper";
import { NotificationType } from "../../shared/enums/enums";
import { CreateNotificationDto } from "../../dto/notification/notification.dto";

export class NotificationHelper {
  private static _instance: NotificationHelper;
  private _notificationService: NotificationService;

  private constructor() {
    const _repository = new NotificationRepository();
    const _mapper = new NotificationMapper();
    this._notificationService = new NotificationService(_repository, _mapper);
  }

  static getInstance(): NotificationHelper {
    if (!NotificationHelper._instance) {
      NotificationHelper._instance = new NotificationHelper();
    }
    return NotificationHelper._instance;
  }

  async createAndEmit(dto: CreateNotificationDto): Promise<void> {
    try {
      const notification =
        await this._notificationService.createNotification(dto);

      if (dto.recipientType === "Admin") {
        notificationSocket.emitToAdmins(notification);
      } else {
        notificationSocket.emitToUser(dto.recipientId, notification);
      }
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  }

  async notifyAdminEmployerVerificationSubmitted(
    employerId: string,
    employerName: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: "admin",
      recipientType: "Admin",
      type: NotificationType.EMPLOYER_VERIFICATION_SUBMITTED,
      title: "New Verification Request",
      message: `${employerName} submitted verification documents`,
      data: { employerId },
    });
  }

  async notifyEmployerVerificationApproved(employerId: string): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.VERIFICATION_APPROVED,
      title: "Verification Approved",
      message: "Your account has been verified successfully",
    });
  }

  async notifyEmployerVerificationRejected(
    employerId: string,
    reason?: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.VERIFICATION_REJECTED,
      title: "Verification Rejected",
      message: reason || "Your verification request was rejected",
      data: { reason },
    });
  }

  async notifyEmployerNewApplication(
    employerId: string,
    candidateName: string,
    jobTitle: string,
    jobId: string,
    applicationId: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.NEW_APPLICATION,
      title: "New Job Application",
      message: `${candidateName} applied for ${jobTitle}`,
      data: { jobId, applicationId },
    });
  }

  async notifyCandidateApplicationStatusChange(
    candidateId: string,
    status: string,
    jobTitle: string,
    jobId: string,
    applicationId: string,
  ): Promise<void> {
    const statusMessages: Record<string, { title: string; message: string }> = {
      reviewed: {
        title: "Application Reviewed",
        message: `Your application for ${jobTitle} has been reviewed`,
      },
      shortlisted: {
        title: "Application Shortlisted",
        message: `Congratulations! You've been shortlisted for ${jobTitle}`,
      },
      rejected: {
        title: "Application Update",
        message: `Your application for ${jobTitle} was not selected`,
      },
    };

    const notificationData = statusMessages[status] || {
      title: "Application Update",
      message: `Your application for ${jobTitle} has been updated`,
    };

    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: `application_${status}` as NotificationType,
      title: notificationData.title,
      message: notificationData.message,
      data: { jobId, applicationId, status },
    });
  }

  async notifyCandidateInterviewScheduled(
    candidateId: string,
    jobTitle: string,
    interviewDate: string,
    interviewId: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: "Interview Scheduled",
      message: `Interview scheduled for ${jobTitle} on ${interviewDate}`,
      data: { interviewId, interviewDate },
    });
  }

  async notifyCandidateInterviewCancelled(
    candidateId: string,
    jobTitle: string,
    interviewId: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.INTERVIEW_CANCELLED,
      title: "Interview Cancelled",
      message: `Your interview for ${jobTitle} has been cancelled`,
      data: { interviewId },
    });
  }
}
