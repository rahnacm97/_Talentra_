import { InterviewResponseDto } from "../../dto/interview/interview.dto";
export interface IInterviewRepository {
    create(data: Partial<any>): Promise<InterviewResponseDto>;
    findByEmployerId(employerId: string): Promise<InterviewResponseDto[]>;
    findById(interviewId: string): Promise<InterviewResponseDto | null>;
    update(interviewId: string, data: Partial<any>): Promise<InterviewResponseDto | null>;
}
//# sourceMappingURL=IInterviewRepository.d.ts.map