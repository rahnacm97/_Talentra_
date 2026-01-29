"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFilterProcessor = void 0;
class CandidateFilterProcessor {
    constructor() {
        this.filters = [];
    }
    addFilter(filter) {
        this.filters.push(filter);
    }
    buildQuery() {
        const query = {};
        for (const filter of this.filters) {
            filter.apply(query);
        }
        return query;
    }
}
exports.CandidateFilterProcessor = CandidateFilterProcessor;
//# sourceMappingURL=CandidateFilterProcessor.js.map