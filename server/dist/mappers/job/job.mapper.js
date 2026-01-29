"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobMapper = void 0;
class JobMapper {
    toResponseDto(job) {
        const employerData = job.employer ||
            (typeof job.employerId === "object"
                ? job.employerId
                : undefined);
        const employerInfo = {
            id: employerData?._id?.toString() ??
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
    toResponseDtoList(jobs) {
        return jobs.map((job) => this.toResponseDto(job));
    }
}
exports.JobMapper = JobMapper;
//# sourceMappingURL=job.mapper.js.map