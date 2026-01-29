import { IInterviewRoundMapper } from "../../interfaces/interviews/IInterviewRoundMapper";
import { IInterviewRound, IInterviewRoundWithDetails } from "../../interfaces/interviews/IInterviewRound";
import { RoundResponseDto, RoundWithDetailsDto } from "../../dto/interview/interviewRound.dto";
export declare class InterviewRoundMapper implements IInterviewRoundMapper {
    toDto(round: IInterviewRound): RoundResponseDto;
    toDetailedDto(round: IInterviewRoundWithDetails): RoundWithDetailsDto;
    toDtoList(rounds: IInterviewRound[]): RoundResponseDto[];
    toDetailedDtoList(rounds: IInterviewRoundWithDetails[]): RoundWithDetailsDto[];
}
//# sourceMappingURL=interviewRound.mapper.d.ts.map