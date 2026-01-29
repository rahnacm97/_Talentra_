"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerApplicationMapper = exports.ApplicationMapper = void 0;
class ApplicationMapper {
    toResponseDto(application) {
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
    toApplicationsResponseDto(application) {
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
            reviewedAt: application.reviewedAt?.toISOString(),
            shortlistedAt: application.shortlistedAt?.toISOString(),
            hiredAt: application.hiredAt?.toISOString(),
            rejectedAt: application.rejectedAt?.toISOString(),
        };
    }
    toResponseDtoList(applications) {
        return applications.map((app) => this.toResponseDto(app));
    }
    toApplicationsResponseDtoList(applications) {
        return applications.map((app) => this.toApplicationsResponseDto(app));
    }
}
exports.ApplicationMapper = ApplicationMapper;
class EmployerApplicationMapper {
    static calculateExperienceYears(experiences = []) {
        return experiences.reduce((total, exp) => {
            const start = new Date(exp.startDate).getFullYear();
            const end = exp.current || !exp.endDate
                ? new Date().getFullYear()
                : new Date(exp.endDate).getFullYear();
            return total + (end - start);
        }, 0);
    }
    static formatEducation(edu) {
        return edu.map((e) => {
            const item = {
                degree: e.degree,
                institution: e.institution,
                startDate: e.startDate,
            };
            if (e.location !== undefined)
                item.location = e.location;
            if (e.endDate !== undefined)
                item.endDate = e.endDate;
            if (e.gpa !== undefined)
                item.gpa = e.gpa;
            return item;
        });
    }
    static formatExperience(exp) {
        return exp.map((e) => {
            const item = {
                title: e.title,
                company: e.company,
                startDate: e.startDate,
                current: e.current ?? false,
            };
            if (e.location !== undefined)
                item.location = e.location;
            if (e.endDate !== undefined)
                item.endDate = e.endDate;
            if (e.description !== undefined)
                item.description = e.description;
            return item;
        });
    }
    toDto(app) {
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
                experience: EmployerApplicationMapper.formatExperience(candidate.experience ?? []),
                education: EmployerApplicationMapper.formatEducation(candidate.education ?? []),
                resume: candidate.resume ?? "",
                experienceYears: EmployerApplicationMapper.calculateExperienceYears(candidate.experience),
            },
        };
    }
    toDtoList(apps) {
        return apps.map((app) => this.toDto(app));
    }
}
exports.EmployerApplicationMapper = EmployerApplicationMapper;
//# sourceMappingURL=application.mapper.js.map