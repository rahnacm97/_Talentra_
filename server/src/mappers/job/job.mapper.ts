import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IJob } from "../../interfaces/jobs/IJob";
import { JobResponseDto, EmployerInfoDto } from "../../dto/job/job.dto";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class JobMapper implements IJobMapper {
  toResponseDto(job: IJob & { employer?: IEmployer }): JobResponseDto {
    const employerInfo: EmployerInfoDto = {
      id: job.employer?._id?.toString() ?? job.employerId,
      companyName: job.employer?.name ?? "Unknown Company",
      logo: job.employer?.profileImage,
      companySize: job.employer?.companySize,
      industry: job.employer?.industry,
      website: job.employer?.website,
      about: job.employer?.about,
      founded: job.employer?.founded,
      benefits: job.employer?.benefits,
    };

    return {
      id: job._id?.toString() ?? "",
      employerId: job.employerId,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      deadline: job.deadline.toISOString().split("T")[0] || "",
      status: job.status,
      experience: job.experience || "0",
      applicants: job.applicants,
      postedDate: new Date(job.postedDate).toISOString().split("T")[0] || "",
      employer: employerInfo,
      hasApplied: job.hasApplied || false,
    };
  }

  toResponseDtoList(
    jobs: (IJob & { employer?: IEmployer; hasApplied?: boolean })[],
  ): JobResponseDto[] {
    return jobs.map((job) => this.toResponseDto(job));
  }
}
