import {
  IApplicationWithJob,
  IApplication,
} from "../../interfaces/applications/IApplication";
import {
  ApplicationResponseDto,
  ApplicationsResponseDto,
} from "../../dto/application/application.dto";
import { IApplicationMapper } from "../../interfaces/applications/IApplicationMapper";
import type { IEmployerApplicationMapper } from "../../interfaces/applications/IApplicationMapper";

export class ApplicationMapper implements IApplicationMapper {
  toResponseDto(application: IApplication): ApplicationResponseDto {
    return {
      id: application.id,
      jobId: application.jobId,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      resume: application.resume,
      coverLetter: application.coverLetter || "",
      appliedAt: application.appliedAt.toISOString(),
      status: application.status,
    };
  }

  toApplicationsResponseDto(
    application: IApplicationWithJob,
  ): ApplicationsResponseDto {
    const job = application.job || {};
    const employer = application.employer || {};

    return {
      id: application.id.toString(),
      jobId: application.jobId,
      jobTitle: job.title || "Unknown Job",
      name: employer.name || "Unknown Company",
      location: job.location || "N/A",
      salary: job.salaryRange || "",
      jobType: job.type || "Full-time",
      description: job.description || "No description.",
      requirements: job.requirements || [],
      profileImage: employer.profileImage || "",
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      resume: application.resume,
      coverLetter: application.coverLetter || "",
      appliedAt: application.appliedAt.toISOString(),
      status: application.status,
      interviewDate: application.interviewDate?.toISOString(),
      updatedAt: application.updatedAt?.toISOString(),
    };
  }

  toResponseDtoList(applications: IApplication[]): ApplicationResponseDto[] {
    return applications.map((app) => this.toResponseDto(app));
  }

  toApplicationsResponseDtoList(
    applications: IApplicationWithJob[],
  ): ApplicationsResponseDto[] {
    return applications.map((app) => this.toApplicationsResponseDto(app));
  }
}

import {
  EmployerApplicationResponseDto,
  ExperienceDto,
  EducationDto,
} from "../../dto/application/application.dto";
import { IEmployerApplicationResponse } from "../../interfaces/applications/IApplication";

export class EmployerApplicationMapper implements IEmployerApplicationMapper {
  private static calculateExperienceYears(
    experiences: ExperienceDto[] = [],
  ): number {
    return experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate).getFullYear();
      const end =
        exp.current || !exp.endDate
          ? new Date().getFullYear()
          : new Date(exp.endDate).getFullYear();
      return total + (end - start);
    }, 0);
  }

  private static formatEducation(edu: EducationDto[]): EducationDto[] {
    return edu.map((e) => {
      const item: EducationDto = {
        degree: e.degree,
        institution: e.institution,
        startDate: e.startDate,
      };

      if (e.location !== undefined) item.location = e.location;
      if (e.endDate !== undefined) item.endDate = e.endDate;
      if (e.gpa !== undefined) item.gpa = e.gpa;

      return item;
    });
  }

  private static formatExperience(exp: ExperienceDto[]): ExperienceDto[] {
    return exp.map((e) => {
      const item: ExperienceDto = {
        title: e.title,
        company: e.company,
        startDate: e.startDate,
        current: e.current ?? false,
      };

      if (e.location !== undefined) item.location = e.location;
      if (e.endDate !== undefined) item.endDate = e.endDate;
      if (e.description !== undefined) item.description = e.description;

      return item;
    });
  }

  toDto(app: IEmployerApplicationResponse): EmployerApplicationResponseDto {
    const candidate = app.candidate ?? {};

    return {
      id: app.id,
      candidateId: app.candidateId,
      jobId: app.jobId,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      resume: app.resume,
      coverLetter: app.coverLetter ?? "",
      appliedAt: app.appliedAt.toISOString(),
      status: app.status,
      rating: app.rating ?? 0,
      notes: app.notes ?? "",

      jobTitle: app.jobTitle,
      name: app.name,
      jobLocation: app.jobLocation ?? "",
      salaryRange: app.salaryRange ?? "",
      jobType: app.jobType ?? "",

      interviewDate: app.interviewDate ?? "",

      candidate: {
        profileImage: candidate.profileImage ?? "",
        location: candidate.location ?? "",
        title: candidate.title ?? "",
        about: candidate.about ?? "",
        skills: candidate.skills ?? [],
        experience: EmployerApplicationMapper.formatExperience(
          candidate.experience ?? [],
        ),
        education: EmployerApplicationMapper.formatEducation(
          candidate.education ?? [],
        ),
        resume: candidate.resume ?? "",
        experienceYears: EmployerApplicationMapper.calculateExperienceYears(
          candidate.experience,
        ),
      },
    };
  }

  toDtoList(
    apps: IEmployerApplicationResponse[],
  ): EmployerApplicationResponseDto[] {
    return apps.map((app) => this.toDto(app));
  }
}
