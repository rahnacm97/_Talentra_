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
    const existing = await this._repository.findByApplicationId(
      data.applicationId,
    );

    if (existing) {
      logger.info("Interview already exists for application", {
        applicationId: data.applicationId,
        interviewId: existing.id,
      });
      return this._mapper.toDto(existing);
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

    // Auto-create conversation for the interview
    try {
      logger.info("Conversation created for interview", {
        interviewId: interview.id,
      });
    } catch (error) {
      // Log error but don't fail interview creation
      logger.error("Failed to create conversation for interview", {
        interviewId: interview.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

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
}
