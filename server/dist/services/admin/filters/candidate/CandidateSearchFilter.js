"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSearchFilter = void 0;
class CandidateSearchFilter {
    constructor(search) {
        this.search = search;
    }
    apply(query) {
        if (this.search) {
            query.$or = [
                { name: { $regex: this.search, $options: "i" } },
                { email: { $regex: this.search, $options: "i" } },
            ];
        }
    }
}
exports.CandidateSearchFilter = CandidateSearchFilter;
//# sourceMappingURL=CandidateSearchFilter.js.map