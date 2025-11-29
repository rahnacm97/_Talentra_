import {
  InterviewResponseDto,
  InterviewsPaginatedDto,
} from "../../dto/interview/interview.dto";
import { IInterviewQuery } from "./IInterview";

export interface IInterviewService {
  createInterviewFromApplication(data: {
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    interviewDate?: string;
  }): Promise<InterviewResponseDto>;

  getInterviewsForEmployer(
    employerId: string,
    filters?: IInterviewQuery,
  ): Promise<InterviewsPaginatedDto>;

  getInterviewsForCandidate(
    candidateId: string,
    filters?: IInterviewQuery,
  ): Promise<InterviewsPaginatedDto>;
}
