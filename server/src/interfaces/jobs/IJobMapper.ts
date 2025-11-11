import { IJob } from "./IJob";
import { JobResponseDto } from "../../dto/job/job.dto";

export interface IJobMapper {
  toResponseDto(job: IJob): JobResponseDto;
  toResponseDtoList(jobs: IJob[]): JobResponseDto[];
}
