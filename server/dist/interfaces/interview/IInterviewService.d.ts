import { CreateInterviewDto, InterviewResponseDto } from "../../dto/interview/interview.dto";
export interface IInterviewService {
    createInterview(applicationId: string, employerId: string, data: CreateInterviewDto): Promise<InterviewResponseDto>;
    getEmployerInterviews(employerId: string): Promise<InterviewResponseDto[]>;
    updateInterview(interviewId: string, employerId: string, data: Partial<CreateInterviewDto>): Promise<InterviewResponseDto>;
}
//# sourceMappingURL=IInterviewService.d.ts.map