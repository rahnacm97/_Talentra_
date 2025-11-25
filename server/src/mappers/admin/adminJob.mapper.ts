import { IAdminJobMapper } from "../../interfaces/users/admin/IAdminJobMapper";
import { AdminJob, AdminJobEmployer } from "../../type/admin/admin.types";
import { IJob } from "../../interfaces/jobs/IJob";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";

export class AdminJobMapper implements IAdminJobMapper {
  private isoToDateString(date: Date | string | null | undefined): string {
    if (!date) return "N/A";

    const d = new Date(date);
    const time = d.getTime();

    if (isNaN(time)) return "N/A";

    return d.toISOString();
  }

  toAdminJobDto(job: IJob & { employer?: IEmployer | null }): AdminJob {
    const employer: AdminJobEmployer = job.employer
      ? {
          id: job.employer._id.toString(),
          name: job.employer.name || "Unknown Company",
          profileImage: job.employer.profileImage ?? null,
        }
      : {
          id: job.employerId.toString(),
          name: "Unknown Company",
          profileImage: null,
        };

    return {
      id: job.id?.toString() ?? "",
      employerId: job.employerId?.toString() ?? "",
      title: job.title ?? "N/A",
      department: job.department ?? "N/A",
      location: job.location ?? "N/A",
      type: job.type ?? "N/A",
      salary: job.salary ?? "N/A",
      description: job.description ?? "N/A",
      requirements: job.requirements ?? "N/A",
      responsibilities: job.responsibilities ?? "N/A",
      deadline: this.isoToDateString(job.deadline),
      status: job.status ?? "N/A",
      experience: job.experience ?? "N/A",
      applicants: job.applicants ?? [],
      postedDate: this.isoToDateString(job.postedDate),
      employer,
    };
  }

  toAdminJobDtoList(
    jobs: (IJob & { employer?: IEmployer | null })[],
  ): AdminJob[] {
    return jobs.map((j) => this.toAdminJobDto(j));
  }
}
