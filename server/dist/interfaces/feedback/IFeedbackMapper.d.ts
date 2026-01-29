import { IFeedback, FeedbackResponseDTO } from "./IFeedback";
export interface IFeedbackMapper {
    toResponseDto(feedback: IFeedback): FeedbackResponseDTO;
    toResponseDtoList(feedbacks: IFeedback[]): FeedbackResponseDTO[];
}
//# sourceMappingURL=IFeedbackMapper.d.ts.map