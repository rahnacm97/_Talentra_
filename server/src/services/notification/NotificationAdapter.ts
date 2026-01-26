import { INotificationService } from "../../interfaces/shared/INotificationService";
import { EmailService } from "../auth/email.service";
import {
  sendInterviewScheduledEmail,
  sendInterviewRescheduledEmail,
  sendInterviewCancelledEmail,
  sendHiredEmail,
  sendRejectionEmail,
} from "../../shared/utils/email";
import { NotificationSocket } from "../../socket/notification.socket";
import { NotificationService } from "./notification.service";
import { NotificationRepository } from "../../repositories/notification/notification.repository";
import { NotificationMapper } from "../../mappers/notification/notification.mapper";
import {
  NotificationType,
  NOTIFICATION_MESSAGES,
} from "../../shared/enums/enums";
import { CreateNotificationDto } from "../../dto/notification/notification.dto";
import { formatMessage } from "../../shared/utils/message.format";
import { SocketManager } from "../../socket/socket.manager";

export class NotificationAdapter implements INotificationService {
  private _emailService: EmailService;
  private _notificationService: NotificationService;

  constructor() {
    this._emailService = new EmailService();

    const _repository = new NotificationRepository();
    const _mapper = new NotificationMapper();
    this._notificationService = new NotificationService(_repository, _mapper);
  }

  // Helper method to create notification in DB and emit via socket
  private async createAndEmit(dto: CreateNotificationDto): Promise<void> {
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

  async notifyEmployerVerificationApproved(employerId: string): Promise<void> {
    await this.createAndEmit({
      recipientId: employerId,
      recipientType: "Employer",
      type: NotificationType.VERIFICATION_APPROVED,
      title: "Verification Approved",
      message: NOTIFICATION_MESSAGES.ACCOUNT_VERIFICATION,
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
      message: reason || NOTIFICATION_MESSAGES.VERIFICATION_REJECTED,
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

  async notifyCandidateInterviewScheduled(
    candidateId: string,
    jobTitle: string,
    interviewDate: string,
    interviewId: string,
    companyName: string,
  ): Promise<void> {
    const formattedDate = new Date(interviewDate).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_TITLE,
      message: formatMessage(
        NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_MESSAGE,
        {
          jobTitle,
          interviewDate: formattedDate,
          companyName,
        },
      ),
      data: { interviewId, interviewDate },
    });
  }

  async notifyCandidateInterviewRescheduled(
    candidateId: string,
    jobTitle: string,
    newDate: string,
    interviewId: string,
    companyName: string,
  ): Promise<void> {
    const formattedDate = new Date(newDate).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: "Interview Rescheduled",
      message: formatMessage(
        "Your interview for {{jobTitle}} at {{companyName}} has been rescheduled to {{newDate}}.",
        {
          jobTitle,
          newDate: formattedDate,
          companyName,
        },
      ),
      data: { interviewId, newDate },
    });
  }

  async notifyCandidateInterviewCancelled(
    candidateId: string,
    jobTitle: string,
    interviewId: string,
    companyName: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.INTERVIEW_CANCELLED,
      title: NOTIFICATION_MESSAGES.INTERVIEW_CANCELLED_TITLE,
      message: formatMessage(
        NOTIFICATION_MESSAGES.INTERVIEW_CANCELLED_MESSAGE,
        {
          jobTitle,
          companyName,
        },
      ),
      data: { interviewId },
    });
  }

  async notifyCandidateNewFeedback(
    candidateId: string,
    jobTitle: string,
    roundName: string,
    interviewId: string,
  ): Promise<void> {
    await this.createAndEmit({
      recipientId: candidateId,
      recipientType: "Candidate",
      type: NotificationType.APPLICATION_REVIEWED,
      title: "New Feedback Received",
      message: `New feedback has been submitted for your ${roundName} for ${jobTitle}.`,
      data: { interviewId },
    });
  }

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

  emitUserBlocked(userId: string): void {
    try {
      SocketManager.getInstance().getIO().to(userId).emit("user:blocked", {
        message: NOTIFICATION_MESSAGES.USER_BLOCKED,
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error(
        "Failed to emit user blocked event:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  emitUserUnblocked(userId: string): void {
    try {
      SocketManager.getInstance().getIO().to(userId).emit("user:unblocked", {
        message: NOTIFICATION_MESSAGES.USER_UNBLOCKED,
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error(
        "Failed to emit user unblocked event:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  async sendInterviewScheduledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewLink: string;
    companyName: string;
  }): Promise<void> {
    await sendInterviewScheduledEmail(data);
  }

  async sendInterviewRescheduledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    interviewDate: string;
    interviewLink?: string;
    companyName: string;
  }): Promise<void> {
    await sendInterviewRescheduledEmail(data);
  }

  async sendInterviewCancelledEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
  }): Promise<void> {
    await sendInterviewCancelledEmail(data);
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    await this._emailService.sendOtp(email, otp);
  }

  async sendEmployerVerificationEmail(params: {
    to: string;
    name: string;
    companyName: string;
  }): Promise<void> {
    await this._emailService.sendEmployerVerificationEmail(params);
  }

  async sendEmployerRejectionEmail(params: {
    to: string;
    name: string;
    companyName: string;
    reason: string;
    loginUrl: string;
  }): Promise<void> {
    await this._emailService.sendEmployerRejectionEmail(params);
  }

  async sendHiredEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
  }): Promise<void> {
    await sendHiredEmail(data);
  }

  async sendRejectionEmail(data: {
    to: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    feedback?: string;
  }): Promise<void> {
    await sendRejectionEmail(data);
  }
}
