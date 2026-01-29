"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobService = exports.CandidateJobService = exports.EmployerJobService = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const enums_1 = require("../../shared/enums/enums");
class EmployerJobService {
    constructor(_repository, _mapper, _employerVerifier) {
        this._repository = _repository;
        this._mapper = _mapper;
        this._employerVerifier = _employerVerifier;
    }
    parseDeadline(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.INVALID_DEADLINE);
        }
        if (date <= new Date()) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, enums_1.ERROR_MESSAGES.FUTURE_DEADLINE);
        }
        return date;
    }
    //Employer verify service
    async verifyEmployer(employerId) {
        const verified = await this._employerVerifier.isVerified(employerId);
        if (!verified) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.FORBIDDEN, enums_1.ERROR_MESSAGES.EMPLOYER_VERIFICATION_FAILED);
        }
    }
    //Employer post job
    async createJob(employerId, dto) {
        await this.verifyEmployer(employerId);
        const job = await this._repository.create({
            ...dto,
            employerId,
            deadline: this.parseDeadline(dto.deadline),
            experience: dto.experience,
        });
        return this._mapper.toResponseDto(job);
    }
    //Get employer posted jobs
    async getJobsByEmployer(employerId) {
        await this.verifyEmployer(employerId);
        const jobs = await this._repository.findByEmployerId(employerId);
        return this._mapper.toResponseDtoList(jobs);
    }
    //job updation
    async updateJob(employerId, jobId, dto) {
        await this.verifyEmployer(employerId);
        const job = await this._repository.findByIdAndEmployer(jobId, employerId);
        if (!job)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.department !== undefined)
            updateData.department = dto.department;
        if (dto.location !== undefined)
            updateData.location = dto.location;
        if (dto.type !== undefined)
            updateData.type = dto.type;
        if (dto.salary !== undefined)
            updateData.salary = dto.salary;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.requirements !== undefined)
            updateData.requirements = dto.requirements;
        if (dto.responsibilities !== undefined)
            updateData.responsibilities = dto.responsibilities;
        if (dto.status !== undefined)
            updateData.status = dto.status;
        if (dto.deadline !== undefined)
            updateData.deadline = this.parseDeadline(dto.deadline);
        if (dto.experience !== undefined)
            updateData.experience = dto.experience;
        const updated = await this._repository.update(jobId, updateData);
        return this._mapper.toResponseDto(updated);
    }
    //fetching jobs
    async getJobsPaginated(employerId, page, limit, search, status) {
        await this.verifyEmployer(employerId);
        const filterStatus = status === "all" ? undefined : status;
        const result = await this._repository.findPaginated(employerId, {
            page,
            limit,
            ...(search && { search }),
            ...(filterStatus && { status: filterStatus }),
        });
        return {
            jobs: this._mapper.toResponseDtoList(result.jobs),
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
    }
    //job closing service
    async closeJob(employerId, jobId) {
        await this.verifyEmployer(employerId);
        const job = await this._repository.findByIdAndEmployer(jobId, employerId);
        if (!job)
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
        const closed = await this._repository.closeJob(jobId);
        return this._mapper.toResponseDto(closed);
    }
}
exports.EmployerJobService = EmployerJobService;
class CandidateJobService {
    constructor(_repository, _candRepository, _mapper, _applicationRepo) {
        this._repository = _repository;
        this._candRepository = _candRepository;
        this._mapper = _mapper;
        this._applicationRepo = _applicationRepo;
    }
    //fetching jobs in candidate side
    async getPublicJobs(params) {
        const { page, limit, search, location, type, experience, skills } = params;
        const repoParams = { page, limit };
        if (search?.trim())
            repoParams.search = search.trim();
        if (location?.trim())
            repoParams.location = location.trim();
        if (type && type !== "all")
            repoParams.type = type;
        if (experience)
            repoParams.experience = experience;
        if (skills?.length)
            repoParams.skills = skills;
        const result = await this._repository.findPublicPaginated(repoParams);
        const availableSkills = await this._repository.getAvailableSkills();
        return {
            jobs: this._mapper.toResponseDtoList(result.jobs),
            total: result.total,
            page,
            limit,
            availableSkills,
        };
    }
    //fetching single job in candidate side
    async getJobById(id, candidateId) {
        const job = await this._repository.findById(id);
        if (!job) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
        }
        let hasApplied = false;
        if (candidateId) {
            const application = await this._applicationRepo.findByJobAndCandidate(id, candidateId);
            hasApplied = !!application;
        }
        else {
            console.log("No candidateId hasApplied");
        }
        const dto = this._mapper.toResponseDto(job);
        return { ...dto, hasApplied };
    }
    //Job saving
    async saveJob(candidateId, jobId) {
        const job = await this._repository.findById(jobId);
        if (!job) {
            throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.NOT_FOUND, enums_1.ERROR_MESSAGES.JOB_NOT_FOUND);
        }
        await this._candRepository.saveJob(candidateId, jobId);
    }
    //Job unsaving
    async unsaveJob(candidateId, jobId) {
        await this._candRepository.unsaveJob(candidateId, jobId);
    }
    //get all the saved jobs
    async getSavedJobs(candidateId, params) {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;
        let jobs = await this._candRepository.getSavedJobs(candidateId);
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            jobs = jobs.filter((job) => {
                const titleMatch = job.title?.toLowerCase().includes(searchLower);
                const locationMatch = job.location?.toLowerCase().includes(searchLower);
                const employer = job.employerId;
                const employerMatch = employer.companyName
                    ?.toLowerCase()
                    .includes(searchLower);
                return titleMatch || locationMatch || employerMatch;
            });
        }
        if (params?.type && params.type !== "all") {
            jobs = jobs.filter((job) => job.type === params.type);
        }
        const total = jobs.length;
        const paginatedJobs = jobs.slice(skip, skip + limit);
        return {
            jobs: this._mapper.toResponseDtoList(paginatedJobs),
            total,
            page,
            limit,
        };
    }
}
exports.CandidateJobService = CandidateJobService;
class AdminJobService {
    constructor(_repository, _adminMapper) {
        this._repository = _repository;
        this._adminMapper = _adminMapper;
    }
    //Fetching all jobs in admin side
    async getAllJobsForAdmin(params) {
        const { page, limit, search, status = "all", type } = params;
        const repoParams = {
            page,
            limit,
            status,
            type,
            ...(search ? { search } : {}),
        };
        const result = await this._repository.findAllAdminPaginated(repoParams);
        const filteredJobs = result.jobs;
        return {
            jobs: this._adminMapper.toAdminJobDtoList(filteredJobs),
            total: result.total,
            page,
            limit,
        };
    }
}
exports.AdminJobService = AdminJobService;
//# sourceMappingURL=job.service.js.map