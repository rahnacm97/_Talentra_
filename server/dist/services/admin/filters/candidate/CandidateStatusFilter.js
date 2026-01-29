"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateStatusFilter = void 0;
class CandidateStatusFilter {
    constructor(status) {
        this.status = status;
    }
    apply(query) {
        if (this.status) {
            if (this.status === "active")
                query.blocked = false;
            if (this.status === "blocked")
                query.blocked = true;
        }
    }
}
exports.CandidateStatusFilter = CandidateStatusFilter;
//# sourceMappingURL=CandidateStatusFilter.js.map