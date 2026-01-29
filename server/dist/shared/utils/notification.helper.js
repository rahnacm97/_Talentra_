"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationHelper = void 0;
const notification_socket_1 = require("../../socket/notification.socket");
const notification_service_1 = require("../../services/notification/notification.service");
const notification_repository_1 = require("../../repositories/notification/notification.repository");
const notification_mapper_1 = require("../../mappers/notification/notification.mapper");
const enums_1 = require("../enums/enums");
const message_format_1 = require("./message.format");
const socket_manager_1 = require("../../socket/socket.manager");
class NotificationHelper {
    constructor() {
        const _repository = new notification_repository_1.NotificationRepository();
        const _mapper = new notification_mapper_1.NotificationMapper();
        this._notificationService = new notification_service_1.NotificationService(_repository, _mapper);
    }
    static getInstance() {
        if (!NotificationHelper._instance) {
            NotificationHelper._instance = new NotificationHelper();
        }
        return NotificationHelper._instance;
    }
    async createAndEmit(dto) {
        try {
            const notification = await this._notificationService.createNotification(dto);
            if (dto.recipientType === "Admin") {
                notification_socket_1.NotificationSocket.getInstance().emitToAdmins(notification);
            }
            else {
                notification_socket_1.NotificationSocket.getInstance().emitToUser(dto.recipientId, notification);
            }
        }
        catch (error) {
            console.error("Failed to create notification:", error);
        }
    }
    // Admin: Employer submitted verification
    async notifyAdminEmployerVerificationSubmitted(employerId, employerName) {
        await this.createAndEmit({
            recipientId: "admin",
            recipientType: "Admin",
            type: enums_1.NotificationType.EMPLOYER_VERIFICATION_SUBMITTED,
            title: enums_1.NOTIFICATION_MESSAGES.ADMIN_VERIFICATION_REQUEST_TITLE,
            message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.ADMIN_VERIFICATION_REQUEST_MESSAGE, {
                employerName,
            }),
            data: { employerId },
        });
    }
    // Employer: Verification approved
    async notifyEmployerVerificationApproved(employerId) {
        await this.createAndEmit({
            recipientId: employerId,
            recipientType: "Employer",
            type: enums_1.NotificationType.VERIFICATION_APPROVED,
            title: "Verification Approved",
            message: enums_1.NOTIFICATION_MESSAGES.ACCOUNT_VERIFICATION,
        });
    }
    // Employer: Verification rejected
    async notifyEmployerVerificationRejected(employerId, reason) {
        await this.createAndEmit({
            recipientId: employerId,
            recipientType: "Employer",
            type: enums_1.NotificationType.VERIFICATION_REJECTED,
            title: "Verification Rejected",
            message: reason || enums_1.NOTIFICATION_MESSAGES.VERIFICATION_REJECTED,
            data: { reason },
        });
    }
    // Employer: New application received
    async notifyEmployerNewApplication(employerId, candidateName, jobTitle, jobId, applicationId) {
        await this.createAndEmit({
            recipientId: employerId,
            recipientType: "Employer",
            type: enums_1.NotificationType.NEW_APPLICATION,
            title: "New Job Application",
            message: `${candidateName} applied for ${jobTitle}`,
            data: { jobId, applicationId },
        });
    }
    // Candidate: Application status changed
    async notifyCandidateApplicationStatusChange(candidateId, status, jobTitle, jobId, applicationId, companyName) {
        const statusMessages = {
            reviewed: {
                title: enums_1.NOTIFICATION_MESSAGES.APPLICATION_REVIEWED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.APPLICATION_REVIEWED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
            shortlisted: {
                title: enums_1.NOTIFICATION_MESSAGES.APPLICATION_SHORTLISTED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.APPLICATION_SHORTLISTED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
            interview: {
                title: enums_1.NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
            rejected: {
                title: enums_1.NOTIFICATION_MESSAGES.APPLICATION_REJECTED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.APPLICATION_REJECTED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
            accepted: {
                title: enums_1.NOTIFICATION_MESSAGES.APPLICATION_HIRED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.APPLICATION_HIRED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
            hired: {
                title: enums_1.NOTIFICATION_MESSAGES.APPLICATION_HIRED_TITLE,
                message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.APPLICATION_HIRED_MESSAGE, {
                    jobTitle,
                    companyName,
                }),
            },
        };
        const notificationData = statusMessages[status] || {
            title: "Application Update",
            message: `Your application for ${jobTitle} at ${companyName} has been updated`,
        };
        const statusToTypeMap = {
            reviewed: enums_1.NotificationType.APPLICATION_REVIEWED,
            shortlisted: enums_1.NotificationType.APPLICATION_SHORTLISTED,
            interview: enums_1.NotificationType.INTERVIEW_SCHEDULED,
            rejected: enums_1.NotificationType.APPLICATION_REJECTED,
            accepted: enums_1.NotificationType.NEW_APPLICATION,
            hired: enums_1.NotificationType.NEW_APPLICATION,
        };
        const notificationType = statusToTypeMap[status] || `application_${status}`;
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
    async notifyCandidateInterviewScheduled(candidateId, jobTitle, interviewDate, interviewId) {
        await this.createAndEmit({
            recipientId: candidateId,
            recipientType: "Candidate",
            type: enums_1.NotificationType.INTERVIEW_SCHEDULED,
            title: enums_1.NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_TITLE,
            message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.INTERVIEW_SCHEDULED_MESSAGE, {
                jobTitle,
                interviewDate,
            }),
            data: { interviewId, interviewDate },
        });
    }
    // Admin: New feedback submitted
    async notifyAdminNewFeedback(userId, userName) {
        await this.createAndEmit({
            recipientId: "admin",
            recipientType: "Admin",
            type: enums_1.NotificationType.NEW_FEEDBACK,
            title: enums_1.NOTIFICATION_MESSAGES.ADMIN_NEW_FEEDBACK_TITLE,
            message: (0, message_format_1.formatMessage)(enums_1.NOTIFICATION_MESSAGES.ADMIN_NEW_FEEDBACK_MESSAGE, {
                userName,
            }),
            data: { userId },
        });
    }
    emitUserBlocked(userId, userType) {
        try {
            socket_manager_1.SocketManager.getInstance().getIO().to(userId).emit("user:blocked", {
                message: enums_1.NOTIFICATION_MESSAGES.USER_BLOCKED,
                timestamp: new Date().toISOString(),
            });
            console.log(`User blocked notification sent to ${userType}:`, userId);
        }
        catch (error) {
            console.error("Failed to emit user blocked event:", error instanceof Error ? error.message : "Unknown error");
        }
    }
    emitUserUnblocked(userId, userType) {
        try {
            socket_manager_1.SocketManager.getInstance().getIO().to(userId).emit("user:unblocked", {
                message: enums_1.NOTIFICATION_MESSAGES.USER_UNBLOCKED,
                timestamp: new Date().toISOString(),
            });
            console.log(`User unblocked notification sent to ${userType}:`, userId);
        }
        catch (error) {
            console.error("Failed to emit user unblocked event:", error instanceof Error ? error.message : "Unknown error");
        }
    }
}
exports.NotificationHelper = NotificationHelper;
//# sourceMappingURL=notification.helper.js.map