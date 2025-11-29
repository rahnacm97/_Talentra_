import { IJobMapper } from "../../interfaces/jobs/IJobMapper";
import { IJob } from "../../interfaces/jobs/IJob";
import { JobResponseDto, EmployerInfoDto } from "../../dto/job/job.dto";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class JobMapper implements IJobMapper {
  toResponseDto(
    job: IJob & { employer?: IEmployer; extractedSkills?: string[] },
  ): JobResponseDto {
    const employerData =
      job.employer ||
      (typeof job.employerId === "object"
        ? (job.employerId as unknown as IEmployer)
        : undefined);

    const employerInfo: EmployerInfoDto = {
      id:
        employerData?._id?.toString() ??
        (typeof job.employerId === "string" ? job.employerId : ""),
      companyName: employerData?.name ?? "Unknown Company",
      logo: employerData?.profileImage,
      companySize: employerData?.companySize,
      industry: employerData?.industry,
      website: employerData?.website,
      about: employerData?.about,
      founded: employerData?.founded,
      benefits: employerData?.benefits,
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
      skills: job.extractedSkills || [],
    };
  }

  toResponseDtoList(
    jobs: (IJob & { employer?: IEmployer; hasApplied?: boolean })[],
  ): JobResponseDto[] {
    return jobs.map((job) => this.toResponseDto(job));
  }
}
