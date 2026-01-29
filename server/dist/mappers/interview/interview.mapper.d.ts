import { IInterviewMapper } from "../../interfaces/interviews/IInterviewMapper";
import { IInterview, IInterviewWithDetails } from "../../interfaces/interviews/IInterview";
import { InterviewResponseDto, InterviewWithDetailsDto } from "../../dto/interview/interview.dto";
export declare class InterviewMapper implements IInterviewMapper {
    toDto(interview: IInterview): InterviewResponseDto;
    toDtoList(interviews: IInterview[]): InterviewResponseDto[];
    toDetailedDto(interview: IInterviewWithDetails): InterviewWithDetailsDto;
    toDetailedDtoList(interviews: IInterviewWithDetails[]): InterviewWithDetailsDto[];
}
//# sourceMappingURL=interview.mapper.d.ts.map