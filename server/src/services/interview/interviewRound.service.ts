import { IInterviewRoundService } from "../../interfaces/interviews/IInterviewService";
import {
  IInterviewRoundRepository,
  IInterviewRepository,
} from "../../interfaces/interviews/IInterviewRepository";
import {
  IInterviewRound,
  IInterviewRoundWithDetails,
  IInterviewRoundQuery,
  InterviewRoundStatus,
  InterviewStatus,
} from "../../interfaces/interviews/IInterview";
import {
  generateMeetingLink,
  validateMeetingToken,
} from "../../shared/utils/linkGenerator";
import { logger } from "../../shared/utils/logger";
import { INotificationService } from "../../interfaces/shared/INotificationService";
import mongoose from "mongoose";

export class InterviewRoundService implements IInterviewRoundService {
  constructor(
    private readonly _repository: IInterviewRoundRepository,
    private readonly _interviewRepository: IInterviewRepository,
    private readonly _notificationService: INotificationService,
  ) {}
  // Create interview round
  async createRound(
    applicationId: string,
    roundData: {
      jobId: string;
      candidateId: string;
      employerId: string;
      roundNumber: number;
      roundType: string;
      customRoundName?: string;
      scheduledDate?: string;
      duration?: number;
      notes?: string;
    },
  ): Promise<IInterviewRoundWithDetails> {
    const roundId = new mongoose.Types.ObjectId();
    const { link, token } = generateMeetingLink(roundId.toString());

    const roundToCreate: Partial<IInterviewRound> & {
      _id: mongoose.Types.ObjectId;
    } = {
      _id: roundId,
      applicationId,
      jobId: roundData.jobId,
      candidateId: roundData.candidateId,
      employerId: roundData.employerId,
      roundNumber: roundData.roundNumber,
      roundType: roundData.roundType as IInterviewRound["roundType"],
      ...(roundData.customRoundName && {
        customRoundName: roundData.customRoundName,
      }),
      ...(roundData.scheduledDate && {
        scheduledDate: new Date(roundData.scheduledDate),
      }),
      status: "scheduled",
      meetingLink: link,
      meetingToken: token,
      duration: roundData.duration || 60,
      ...(roundData.notes && { notes: roundData.notes }),
    };

    const created = await this._repository.create(
      roundToCreate as Partial<IInterviewRound>,
    );

    logger.info("Interview round created", {
      roundId: created.id,
      applicationId,
      roundNumber: roundData.roundNumber,
    });

    const roundWithDetails = await this._repository.findByIdWithDetails(
      created.id,
    );
    if (!roundWithDetails) {
      throw new Error("Failed to fetch created round");
    }

    await this._syncParentInterview(applicationId);

    try {
      await this._notificationService.notifyCandidateInterviewScheduled(
        roundWithDetails.candidateId,
        roundWithDetails.job.title,
        roundWithDetails.scheduledDate
          ? roundWithDetails.scheduledDate.toISOString()
          : new Date().toISOString(),
        roundWithDetails.id,
        roundWithDetails.employer.companyName,
      );

      await this._notificationService.sendInterviewScheduledEmail({
        to: roundWithDetails.candidate.email,
        candidateName: roundWithDetails.candidate.fullName,
        jobTitle: roundWithDetails.job.title,
        interviewDate: roundWithDetails.scheduledDate
          ? roundWithDetails.scheduledDate.toISOString()
          : new Date().toISOString(),
        interviewLink: roundWithDetails.meetingLink,
        companyName: roundWithDetails.employer.companyName,
      });
    } catch (notifyError) {
      logger.error("Failed to notify candidate about new interview", {
        notifyError,
        roundId: roundWithDetails.id,
      });
    }

    return roundWithDetails;
  }
  //Fetch interview round
  async getRoundById(
    roundId: string,
  ): Promise<IInterviewRoundWithDetails | null> {
    return await this._repository.findByIdWithDetails(roundId);
  }

  async getRoundsForApplication(
    applicationId: string,
    query?: IInterviewRoundQuery,
  ): Promise<IInterviewRoundWithDetails[]> {
    return await this._repository.findByApplicationId(applicationId, query);
  }
  //Fetching candidate round
  async getRoundsForCandidate(
    candidateId: string,
    query: IInterviewRoundQuery = {},
  ): Promise<{
    rounds: IInterviewRoundWithDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.max(query.limit ?? 10, 1);

    const [rounds, total] = await Promise.all([
      this._repository.findByCandidateId(candidateId, query),
      this._repository.countByCandidateId(candidateId, {
        ...(query.status && { status: query.status }),
        ...(query.search && { search: query.search }),
      }),
    ]);

    return {
      rounds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //Fetch employer rounds
  async getRoundsForEmployer(
    employerId: string,
    query: IInterviewRoundQuery = {},
  ): Promise<{
    rounds: IInterviewRoundWithDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.max(query.limit ?? 10, 1);

    const [rounds, total] = await Promise.all([
      this._repository.findByEmployerId(employerId, query),
      this._repository.countByEmployerId(employerId, {
        ...(query.status && { status: query.status }),
        ...(query.search && { search: query.search }),
      }),
    ]);

    return {
      rounds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //Update status of each round
  async updateRoundStatus(
    roundId: string,
    status: string,
  ): Promise<IInterviewRound | null> {
    const updated = await this._repository.updateOne(roundId, {
      status: status as InterviewRoundStatus,
    });

    if (!updated) {
      throw new Error("Round not found or failed to update");
    }

    logger.info("Interview round status updated", { roundId, status });

    await this._syncParentInterview(updated.applicationId);

    return updated;
  }
  //Reschedule
  async rescheduleRound(
    roundId: string,
    newDate: string,
  ): Promise<IInterviewRound | null> {
    const round = await this._repository.findById(roundId);
    if (!round) {
      throw new Error("Round not found");
    }

    const updated = await this._repository.updateOne(roundId, {
      scheduledDate: new Date(newDate),
      status: "rescheduled",
    });

    if (!updated) {
      throw new Error("Failed to reschedule round");
    }

    logger.info("Interview round rescheduled", { roundId, newDate });

    await this._syncParentInterview(updated.applicationId);

    try {
      const details = await this._repository.findByIdWithDetails(roundId);
      if (details) {
        await this._notificationService.notifyCandidateInterviewRescheduled(
          details.candidateId,
          details.job.title,
          new Date(newDate).toISOString(),
          details.id,
          details.employer.companyName,
        );

        await this._notificationService.sendInterviewRescheduledEmail({
          to: details.candidate.email,
          candidateName: details.candidate.fullName,
          jobTitle: details.job.title,
          interviewDate: new Date(newDate).toISOString(),
          interviewLink: details.meetingLink,
          companyName: details.employer.companyName,
        });
      }
    } catch (notifyError) {
      logger.error("Failed to notify candidate about rescheduled interview", {
        notifyError,
        roundId,
      });
    }

    return updated;
  }
  //Cancel round
  async cancelRound(
    roundId: string,
    reason?: string,
  ): Promise<IInterviewRound | null> {
    const round = await this._repository.findById(roundId);
    if (!round) {
      throw new Error("Round not found");
    }

    const updatedWithSync = await this._repository.updateOne(roundId, {
      status: "cancelled",
      ...(reason
        ? { notes: `${round.notes || ""}\nCancellation reason: ${reason}` }
        : round.notes
          ? { notes: round.notes }
          : {}),
    });

    if (!updatedWithSync) {
      throw new Error("Failed to cancel round");
    }

    logger.info("Interview round cancelled", { roundId, reason });

    await this._syncParentInterview(updatedWithSync.applicationId);

    try {
      const details = await this._repository.findByIdWithDetails(roundId);
      if (details) {
        await this._notificationService.notifyCandidateInterviewCancelled(
          details.candidateId,
          details.job.title,
          details.id,
          details.employer.companyName,
        );

        await this._notificationService.sendInterviewCancelledEmail({
          to: details.candidate.email,
          candidateName: details.candidate.fullName,
          jobTitle: details.job.title,
          companyName: details.employer.companyName,
        });
      }
    } catch (notifyError) {
      logger.error("Failed to notify candidate about cancelled interview", {
        notifyError,
        roundId,
      });
    }

    return updatedWithSync;
  }
  //Validating meeting access
  async validateMeetingAccess(
    roundId: string,
    token: string,
  ): Promise<{ valid: boolean; round?: IInterviewRoundWithDetails }> {
    const round = await this._repository.findByMeetingToken(roundId, token);

    if (!round) {
      return { valid: false };
    }

    if (!round.scheduledDate) {
      return { valid: false };
    }

    const isValid = validateMeetingToken(
      round.meetingToken,
      token,
      round.scheduledDate,
    );

    if (!isValid) {
      return { valid: false };
    }

    const roundWithDetails =
      await this._repository.findByIdWithDetails(roundId);

    return {
      valid: true,
      ...(roundWithDetails && { round: roundWithDetails }),
    };
  }
  //Check round completes
  async checkAllRoundsComplete(applicationId: string): Promise<boolean> {
    const rounds = await this._repository.findByApplicationId(applicationId);

    if (rounds.length === 0) {
      return false;
    }

    return rounds.every(
      (round) => round.status === "completed" || round.status === "cancelled",
    );
  }
  //delete round
  async deleteRound(roundId: string): Promise<boolean> {
    const round = await this._repository.findById(roundId);
    const deleted = await this._repository.deleteById(roundId);
    if (deleted && round) {
      await this._syncParentInterview(round.applicationId);
    }
    return deleted;
  }

  private async _syncParentInterview(applicationId: string): Promise<void> {
    try {
      const interview =
        await this._interviewRepository.findByApplicationId(applicationId);
      if (!interview) return;

      const rounds = await this._repository.findByApplicationId(applicationId);
      if (rounds.length === 0) return;

      const activeRounds = rounds.filter(
        (r) => r.status === "scheduled" || r.status === "rescheduled",
      );
      const completedRounds = rounds.filter((r) => r.status === "completed");
      const cancelledRounds = rounds.filter((r) => r.status === "cancelled");

      let finalStatus = interview.status;
      let finalDate = interview.interviewDate;

      if (activeRounds.length > 0) {
        finalStatus = "scheduled";

        const sortedActive = [...activeRounds].sort((a, b) => {
          const dateA = a.scheduledDate
            ? new Date(a.scheduledDate).getTime()
            : Infinity;
          const dateB = b.scheduledDate
            ? new Date(b.scheduledDate).getTime()
            : Infinity;
          return dateA - dateB;
        });
        const earliestDate = sortedActive[0]?.scheduledDate;
        if (earliestDate) {
          finalDate = new Date(earliestDate);
        }
      } else if (
        activeRounds.length === 0 &&
        (completedRounds.length > 0 || cancelledRounds.length > 0)
      ) {
        if (interview.status === "scheduled") {
          finalStatus = "scheduled";
        }
      }

      if (interview.status === "hired" || interview.status === "rejected") {
        return;
      }

      await this._interviewRepository.updateOne(interview.id, {
        status: finalStatus as InterviewStatus,
        ...(finalDate && { interviewDate: finalDate }),
      });

      logger.info("Parent interview synced with rounds", {
        applicationId,
        status: finalStatus,
        date: finalDate,
      });
    } catch (error) {
      logger.error("Failed to sync parent interview", { applicationId, error });
    }
  }
}
