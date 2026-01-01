import { NotificationSocket } from "../../socket/notification.socket";
import { NotificationService } from "../../services/notification/notification.service";
import { NotificationRepository } from "../../repositories/notification/notification.repository";
import { NotificationMapper } from "../../mappers/notification/notification.mapper";
import { NotificationType, NOTIFICATION_MESSAGES } from "../enums/enums";
import { CreateNotificationDto } from "../../dto/notification/notification.dto";
import { formatMessage } from "./message.format";
import { SocketManager } from "../../socket/socket.manager";

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
        NotificationSocket.getInstance().emitToAdmins(notification);
      } else {
        NotificationSocket.getInstance().emitToUser(
          dto.recipientId,
          notification,
        );
      }
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  }
  // Admin: Employer submitted verification
  async notifyAdminEmployerVerificationSubmitted(
    employerId: string,
    employerName: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: "admin",
      recipientType: "Admin",
      type: NotificationType.EMPLOYER_VERIFICATION_SUBMITTED,
      title: NOTIFICATION_MESSAGES.ADMIN_VERIFICATION_REQUEST_TITLE,
      message: formatMessage(
        NOTIFICATION_MESSAGES.ADMIN_VERIFICATION_REQUEST_MESSAGE,
        {
          employerName,
        },
      ),
      data: { employerId },
    });
  }
  // Employer: Verification approved
  async notifyEmployerVerificationApproved(employerId: string): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.VERIFICATION_APPROVED,
      title: "Verification Approved",
      message: NOTIFICATION_MESSAGES.ACCOUNT_VERIFICATION,
    });
  }
  // Employer: Verification rejected
  async notifyEmployerVerificationRejected(
    employerId: string,
    reason?: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.VERIFICATION_REJECTED,
      title: "Verification Rejected",
      message: reason || NOTIFICATION_MESSAGES.VERIFICATION_REJECTED,
      data: { reason },
    });
  }
  // Employer: New application received
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
  // Candidate: Application status changed
  async notifyCandidateApplicationStatusChange(
    candidateId: string,
    status: string,
    jobTitle: string,
    jobId: string,
    applicationId: string,
    companyName: string,
  ): Promise<void> {
    const statusMessages: Record<string, { title: string; message: string }> = {
      reviewed: {
        title: NOTIFICATION_MESSAGES.APPLICATION_REVIEWED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.APPLICATION_REVIEWED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
      shortlisted: {
        title: NOTIFICATION_MESSAGES.APPLICATION_SHORTLISTED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.APPLICATION_SHORTLISTED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
      interview: {
        title: NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
      rejected: {
        title: NOTIFICATION_MESSAGES.APPLICATION_REJECTED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.APPLICATION_REJECTED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
      accepted: {
        title: NOTIFICATION_MESSAGES.APPLICATION_HIRED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.APPLICATION_HIRED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
      hired: {
        title: NOTIFICATION_MESSAGES.APPLICATION_HIRED_TITLE,
        message: formatMessage(
          NOTIFICATION_MESSAGES.APPLICATION_HIRED_MESSAGE,
          {
            jobTitle,
            companyName,
          },
        ),
      },
    };

    const notificationData = statusMessages[status] || {
      title: "Application Update",
      message: `Your application for ${jobTitle} at ${companyName} has been updated`,
    };

    const statusToTypeMap: Record<string, NotificationType> = {
      reviewed: NotificationType.APPLICATION_REVIEWED,
      shortlisted: NotificationType.APPLICATION_SHORTLISTED,
      interview: NotificationType.INTERVIEW_SCHEDULED,
      rejected: NotificationType.APPLICATION_REJECTED,
      accepted: NotificationType.NEW_APPLICATION,
      hired: NotificationType.NEW_APPLICATION,
    };

    const notificationType =
      statusToTypeMap[status] || (`application_${status}` as NotificationType);

    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: notificationType,
      title: notificationData.title,
      message: notificationData.message,
      data: { jobId, applicationId, status, companyName },
    });
  }
  // Candidate: Interview scheduled
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
      title: NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_TITLE,
      message: formatMessage(
        NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_MESSAGE,
        {
          jobTitle,
          interviewDate,
        },
      ),
      data: { interviewId, interviewDate },
    });
  }

  // Admin: New feedback submitted
  async notifyAdminNewFeedback(
    userId: string,
    userName: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: "admin",
      recipientType: "Admin",
      type: NotificationType.NEW_FEEDBACK,
      title: NOTIFICATION_MESSAGES.ADMIN_NEW_FEEDBACK_TITLE,
      message: formatMessage(NOTIFICATION_MESSAGES.ADMIN_NEW_FEEDBACK_MESSAGE, {
        userName,
      }),
      data: { userId },
    });
  }

  emitUserBlocked(userId: string, userType: "Candidate" | "Employer"): void {
    try {
      SocketManager.getInstance().getIO().to(userId).emit("user:blocked", {
        message: NOTIFICATION_MESSAGES.USER_BLOCKED,
        timestamp: new Date().toISOString(),
      });
      console.log(`User blocked notification sent to ${userType}:`, userId);
    } catch (error: unknown) {
      console.error(
        "Failed to emit user blocked event:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  emitUserUnblocked(userId: string, userType: "Candidate" | "Employer"): void {
    try {
      SocketManager.getInstance().getIO().to(userId).emit("user:unblocked", {
        message: NOTIFICATION_MESSAGES.USER_UNBLOCKED,
        timestamp: new Date().toISOString(),
      });
      console.log(`User unblocked notification sent to ${userType}:`, userId);
    } catch (error: unknown) {
      console.error(
        "Failed to emit user unblocked event:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
}
