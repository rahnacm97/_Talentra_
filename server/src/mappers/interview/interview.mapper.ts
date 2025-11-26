import { IInterviewMapper } from "../../interfaces/interviews/IInterviewMapper";
import {
  IInterview,
  IInterviewWithDetails,
} from "../../interfaces/interviews/IInterview";
import {
  InterviewResponseDto,
  InterviewWithDetailsDto,
} from "../../dto/interview/interview.dto";

export class InterviewMapper implements IInterviewMapper {
  toDto(interview: IInterview): InterviewResponseDto {
    return {
      id: interview.id,
      applicationId: interview.applicationId,
      jobId: interview.jobId,
      candidateId: interview.candidateId,
      employerId: interview.employerId,
      ...(interview.interviewDate && {
        interviewDate: interview.interviewDate,
      }),
      status: interview.status,
      ...(interview.notes && { notes: interview.notes }),
      ...(interview.feedback && { feedback: interview.feedback }),
      ...(interview.createdAt && { createdAt: interview.createdAt }),
      ...(interview.updatedAt && { updatedAt: interview.updatedAt }),
    };
  }

  toDtoList(interviews: IInterview[]): InterviewResponseDto[] {
    return interviews.map((interview) => this.toDto(interview));
  }

  toDetailedDto(interview: IInterviewWithDetails): InterviewWithDetailsDto {
    return {
      id: interview.id,
      applicationId: interview.applicationId,
      jobId: interview.jobId,
      candidateId: interview.candidateId,
      employerId: interview.employerId,
      ...(interview.interviewDate && {
        interviewDate: interview.interviewDate,
      }),
      status: interview.status,
      ...(interview.notes && { notes: interview.notes }),
      ...(interview.feedback && { feedback: interview.feedback }),
      ...(interview.createdAt && { createdAt: interview.createdAt }),
      ...(interview.updatedAt && { updatedAt: interview.updatedAt }),
      job: interview.job,
      candidate: interview.candidate,
      employer: interview.employer,
    };
  }

  toDetailedDtoList(
    interviews: IInterviewWithDetails[],
  ): InterviewWithDetailsDto[] {
    return interviews.map((interview) => this.toDetailedDto(interview));
  }
}
