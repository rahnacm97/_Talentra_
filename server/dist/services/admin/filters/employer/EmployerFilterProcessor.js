"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerFilterProcessor = void 0;
class EmployerFilterProcessor {
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
exports.EmployerFilterProcessor = EmployerFilterProcessor;
//# sourceMappingURL=EmployerFilterProcessor.js.map