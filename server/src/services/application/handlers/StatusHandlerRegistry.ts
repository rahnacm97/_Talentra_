
import {
  IStatusHandler,
  StatusHandlerContext,
} from "../../../interfaces/applications/IStatusHandler";
import { IApplication } from "../../../interfaces/applications/IApplication";
import { logger } from "../../../shared/utils/logger";
import { IApplicationUpdate } from "../../../interfaces/applications/IApplicationService";
import {
  sendHiredEmail,
  sendInterviewScheduledEmail,
  sendRejectionEmail,
} from "../../../shared/utils/email";


export class ReviewedHandler implements IStatusHandler {
  async handle(context: StatusHandlerContext): Promise<void> {
    await context.appRepo.updateOne(context.application.id, {
      status: "reviewed",
      reviewedAt: new Date(),
    });
  }
}

export class ShortlistedHandler implements IStatusHandler {
  async handle(context: StatusHandlerContext): Promise<void> {
    await context.appRepo.updateOne(context.application.id, {
      status: "shortlisted",
      shortlistedAt: new Date(),
    });

    if (context.chatService) {
      try {
        await context.chatService.initiateChat(
          context.employerId,
          context.application.candidateId,
          context.application.jobId,
          context.application.id,

        );
        logger.info("Auto-initiated chat for shortlisted candidate", {
          applicationId: context.application.id,
        });
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        logger.error("Failed to auto-initiate chat", { error: errorMessage });
      }
    }
  }
}

export class InterviewHandler implements IStatusHandler {
  async handle(context: StatusHandlerContext): Promise<void> {

    const updateData: IApplicationUpdate = { status: "interview" };

    if (context.data.interviewDate) {
      updateData.interviewDate = new Date(context.data.interviewDate);
    }
    await context.appRepo.updateOne(context.application.id, updateData);

    if (context.interviewService) {
      try {
        await context.interviewService.createInterviewFromApplication({
          applicationId: context.application.id,
          jobId: context.application.jobId,
          candidateId: context.application.candidateId,
          employerId: context.employerId,

          ...(context.data.interviewDate && {
            interviewDate: context.data.interviewDate,
          }),
        });
        logger.info("Interview created for application", {
          applicationId: context.application.id,
        });

      } catch (e) {
        logger.error("Failed to create interview", e);
      }
    }

    if (context.data.interviewDate) {
      try {
        await sendInterviewScheduledEmail({
          to: context.application.email,
          candidateName: context.application.fullName,
          jobTitle: context.application.job.title,
          interviewDate: context.data.interviewDate,
          companyName: context.application.employer.name,
        });
      } catch (e) {
        logger.warn("Interview email failed", e);
      }
    }
  }
}

export class HiredHandler implements IStatusHandler {
  async handle(context: StatusHandlerContext): Promise<void> {

    // Check if all interview rounds are complete (if multi-round interviews exist)
    if (context.interviewRoundService) {
      try {
        const allRoundsComplete =
          await context.interviewRoundService.checkAllRoundsComplete(
            context.application.id,
          );

        if (!allRoundsComplete) {
          throw new Error(
            "Cannot hire: Not all interview rounds are completed. Please complete or cancel all rounds first.",
          );
        }
      } catch (e) {
        // If service not available or no rounds exist, continue
        logger.warn("Interview round check skipped", e);
      }
    }

    // Check if feedback is submitted for all completed rounds
    if (context.feedbackService) {
      try {
        const allFeedbackSubmitted =
          await context.feedbackService.checkAllFeedbackSubmitted(
            context.application.id,
          );

        if (!allFeedbackSubmitted) {
          throw new Error(
            "Cannot hire: Feedback required for all completed interview rounds.",
          );
        }
      } catch (e) {
        // If service not available, continue
        logger.warn("Feedback check skipped", e);
      }
    }

    await context.appRepo.updateOne(context.application.id, {
      status: "hired",
      hiredAt: new Date(),
    });

    try {
      await sendHiredEmail({
        to: context.application.email,
        candidateName: context.application.fullName,
        jobTitle: context.application.job.title,
        companyName: context.application.employer.name,
      });

      logger.info("Hired email sent for application", {
        applicationId: context.application.id,
      });
    } catch (e) {
      logger.error("Failed to send hired email", e);
    }
  }
}

export class RejectedHandler implements IStatusHandler {
  async handle(context: StatusHandlerContext): Promise<void> {

    // Require rejection reason
    if (!context.data.rejectionReason) {
      throw new Error(
        "Rejection reason is required. Please provide a reason for rejection.",
      );
    }

    await context.appRepo.updateOne(context.application.id, {
      status: "rejected",
      rejectedAt: new Date(),
      rejectionReason: context.data.rejectionReason,
      ...(context.data.rejectionFeedback && {
        rejectionFeedback: context.data.rejectionFeedback,
      }),
      rejectionFeedbackShared: !!context.data.rejectionFeedback,
    });

    // Send rejection email
    try {
      await sendRejectionEmail({
        to: context.application.email,
        candidateName: context.application.fullName,
        jobTitle: context.application.job.title,
        companyName: context.application.employer.name,
        ...(context.data.rejectionFeedback && {
          feedback: context.data.rejectionFeedback,
        }),
      });
      logger.info("Rejection email sent for application", {
        applicationId: context.application.id,
      });
    } catch (e) {
      logger.error("Failed to send rejection email", e);
    }
  }
}

export class DefaultStatusHandler implements IStatusHandler {

  async handle(context: StatusHandlerContext): Promise<void> {
    await context.appRepo.updateOne(context.application.id, {
      status: context.data.status as IApplication["status"],
    });
  }
}


export class StatusHandlerRegistry {
  private static handlers: Record<string, IStatusHandler> = {
    reviewed: new ReviewedHandler(),
    shortlisted: new ShortlistedHandler(),
    interview: new InterviewHandler(),
    hired: new HiredHandler(),
    rejected: new RejectedHandler(),
  };

  static getHandler(status: string): IStatusHandler {
    return this.handlers[status] || new DefaultStatusHandler();
  }
}
