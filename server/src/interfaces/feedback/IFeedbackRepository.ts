import { IBaseRepository } from "../IBaseRepository";
import { IFeedback } from "./IFeedback";

export interface IFeedbackRepository extends IBaseRepository<IFeedback> {
  getFeaturedFeedback(): Promise<IFeedback[]>;
  getPublicFeedback(): Promise<IFeedback[]>;
  repairFeedbackData(): Promise<void>;
}
