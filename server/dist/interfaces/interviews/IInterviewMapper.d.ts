import { IInterview, IInterviewWithDetails } from "./IInterview";
import { InterviewResponseDto, InterviewWithDetailsDto } from "../../dto/interview/interview.dto";
export interface IInterviewMapper {
    toDto(interview: IInterview): InterviewResponseDto;
    toDtoList(interviews: IInterview[]): InterviewResponseDto[];
    toDetailedDto(interview: IInterviewWithDetails): InterviewWithDetailsDto;
    toDetailedDtoList(interviews: IInterviewWithDetails[]): InterviewWithDetailsDto[];
}
//# sourceMappingURL=IInterviewMapper.d.ts.map