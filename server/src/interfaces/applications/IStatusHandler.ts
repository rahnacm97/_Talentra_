import { IApplicationWithJob } from "./IApplication";
import { IEmployerApplicationRepository } from "./IApplicationRepository";
import {
  IInterviewService,
  IInterviewRoundService,
  IInterviewFeedbackService,
} from "../interviews/IInterviewService";
import { IChatService } from "../chat/IChatService";

export interface StatusHandlerContext {
  application: IApplicationWithJob;
  employerId: string;
  data: {
    status: string;
    interviewDate?: string;
    interviewerIds?: string[];
    rejectionReason?: string;
    rejectionFeedback?: string;
  };
  appRepo: IEmployerApplicationRepository;
  interviewService?: IInterviewService | undefined;
  chatService?: IChatService | undefined;
  interviewRoundService?: IInterviewRoundService | undefined;
  feedbackService?: IInterviewFeedbackService | undefined;
}

export interface IStatusHandler {
  handle(context: StatusHandlerContext): Promise<void>;
}
