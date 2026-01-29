import { IFeedbackMapper } from "../../interfaces/feedback/IFeedbackMapper";
import { IFeedback, FeedbackResponseDTO } from "../../interfaces/feedback/IFeedback";
export declare class FeedbackMapper implements IFeedbackMapper {
    toResponseDto(feedback: IFeedback): FeedbackResponseDTO;
    toResponseDtoList(feedbacks: IFeedback[]): FeedbackResponseDTO[];
}
//# sourceMappingURL=feedback.mapper.d.ts.map