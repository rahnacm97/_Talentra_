import { IApplication, IApplicationWithJob } from "./IApplication";
import { IEmployerApplicationRepository } from "./IApplicationRepository";
import { IInterviewService } from "../interviews/IInterviewService";
import { IChatService } from "../chat/IChatService";

export interface StatusHandlerContext {
  application: IApplicationWithJob;
  employerId: string;
  data: { status: string; interviewDate?: string };
  appRepo: IEmployerApplicationRepository;
  interviewService?: IInterviewService | undefined;
  chatService?: IChatService | undefined;
}

export interface IStatusHandler {
  handle(context: StatusHandlerContext): Promise<void>;
}
