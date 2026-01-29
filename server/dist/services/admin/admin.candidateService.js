"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCandidateService = void 0;
const CandidateFilterProcessor_1 = require("./filters/candidate/CandidateFilterProcessor");
const CandidateSearchFilter_1 = require("./filters/candidate/CandidateSearchFilter");
const CandidateStatusFilter_1 = require("./filters/candidate/CandidateStatusFilter");
class AdminCandidateService {
    constructor(_candidateRepo, _candidateMapper, _notificationService) {
        this._candidateRepo = _candidateRepo;
        this._candidateMapper = _candidateMapper;
        this._notificationService = _notificationService;
    }
    //Fetching all candidates
    async getAllCandidates(page, limit, search, status) {
        const filterProcessor = new CandidateFilterProcessor_1.CandidateFilterProcessor();
        filterProcessor.addFilter(new CandidateSearchFilter_1.CandidateSearchFilter(search));
        filterProcessor.addFilter(new CandidateStatusFilter_1.CandidateStatusFilter(status));
        const query = filterProcessor.buildQuery();
        const candidates = await this._candidateRepo.findAll(query, page, limit);
        const total = await this._candidateRepo.count(query);
        return {
            data: candidates.map((c) => this._candidateMapper.toCandidateResponseDTO(c)),
            total,
        };
    }
    //Block and unblocking candidates
    async blockUnblockCandidate(data) {
        const candidateEntity = this._candidateMapper.toBlockCandidateEntity(data);
        const candidate = await this._candidateRepo.updateBlockStatus(candidateEntity.candidateId, candidateEntity.block);
        if (!candidate)
            throw new Error("Candidate not found");
        if (candidateEntity.block) {
            this._notificationService.emitUserBlocked(candidateEntity.candidateId, "Candidate");
        }
        else {
            this._notificationService.emitUserUnblocked(candidateEntity.candidateId, "Candidate");
        }
        return this._candidateMapper.toCandidateResponseDTO(candidate);
    }
    //Fetching single candidate
    async getCandidateById(id) {
        const candidate = await this._candidateRepo.findById(id);
        if (!candidate)
            return null;
        return this._candidateMapper.toCandidateResponseDTO(candidate);
    }
}
exports.AdminCandidateService = AdminCandidateService;
//# sourceMappingURL=admin.candidateService.js.map