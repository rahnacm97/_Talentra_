import { IInterviewService } from "../../interfaces/interviews/IInterviewService";
import { IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewMapper } from "../../interfaces/interviews/IInterviewMapper";
import {
  InterviewResponseDto,
  InterviewsPaginatedDto,
} from "../../dto/interview/interview.dto";
import {
  IInterview,
  IInterviewQuery,
} from "../../interfaces/interviews/IInterview";
import { logger } from "../../shared/utils/logger";

export class InterviewService implements IInterviewService {
  constructor(
    private readonly _repository: IInterviewRepository,
    private readonly _mapper: IInterviewMapper,
  ) {}
  //Creating interviews
  async createInterviewFromApplication(data: {
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    interviewDate?: string;
  }): Promise<InterviewResponseDto> {
    const existingInterview = await this._repository.findByApplicationId(
      data.applicationId,
    );

    if (existingInterview) {
      throw new Error("Interview already scheduled for this application");
    }

    const interviewData: Partial<IInterview> = {
      applicationId: data.applicationId,
      jobId: data.jobId,
      candidateId: data.candidateId,
      employerId: data.employerId,
      status: "scheduled",
    };

    if (data.interviewDate) {
      interviewData.interviewDate = new Date(data.interviewDate);
    }

    const interview = await this._repository.create(interviewData);

    logger.info("Interview created", {
      interviewId: interview.id,
      applicationId: data.applicationId,
    });

    return this._mapper.toDto(interview);
  }
  //Fetching interview scheduled by employer
  async getInterviewsForEmployer(
    employerId: string,
    filters: IInterviewQuery = {},
  ): Promise<InterviewsPaginatedDto> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.max(filters.limit ?? 10, 1);

    const [interviews, total] = await Promise.all([
      this._repository.findByEmployerId(employerId, filters),
      this._repository.countByEmployerId(employerId, {
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      }),
    ]);

    return {
      interviews: this._mapper.toDetailedDtoList(interviews),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //Fetcching candidate interviews
  async getInterviewsForCandidate(
    candidateId: string,
    filters: IInterviewQuery = {},
  ): Promise<InterviewsPaginatedDto> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.max(filters.limit ?? 10, 1);

    const [interviews, total] = await Promise.all([
      this._repository.findByCandidateId(candidateId, filters),
      this._repository.countByCandidateId(candidateId, {
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      }),
    ]);

    return {
      interviews: this._mapper.toDetailedDtoList(interviews),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateInterviewStatus(
    interviewId: string,
    status: string,
    employerId: string,
  ): Promise<InterviewResponseDto> {
    const interview = await this._repository.findById(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    if (interview.employerId !== employerId) {
      throw new Error("Unauthorized: You do not own this interview");
    }

    const updated = await this._repository.updateOne(interviewId, {
      status: status as any,
    });

    if (!updated) {
      throw new Error("Failed to update interview status");
    }

    logger.info("Interview status updated", { interviewId, status });
    return this._mapper.toDto(updated);
  }
}
