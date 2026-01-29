import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IJob } from "../../interfaces/jobs/IJob";
import { JobResponseDto } from "../../dto/job/job.dto";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
export declare class JobMapper implements IJobMapper {
    toResponseDto(job: IJob & {
        employer?: IEmployer;
        extractedSkills?: string[];
    }): JobResponseDto;
    toResponseDtoList(jobs: (IJob & {
        employer?: IEmployer;
        hasApplied?: boolean;
    })[]): JobResponseDto[];
}
//# sourceMappingURL=job.mapper.d.ts.map