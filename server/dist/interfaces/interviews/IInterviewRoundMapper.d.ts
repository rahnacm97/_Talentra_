import { IInterviewRound, IInterviewRoundWithDetails } from "./IInterviewRound";
import { RoundResponseDto, RoundWithDetailsDto } from "../../dto/interview/interviewRound.dto";
export interface IInterviewRoundMapper {
    toDto(round: IInterviewRound): RoundResponseDto;
    toDetailedDto(round: IInterviewRoundWithDetails): RoundWithDetailsDto;
    toDtoList(rounds: IInterviewRound[]): RoundResponseDto[];
    toDetailedDtoList(rounds: IInterviewRoundWithDetails[]): RoundWithDetailsDto[];
}
//# sourceMappingURL=IInterviewRoundMapper.d.ts.map