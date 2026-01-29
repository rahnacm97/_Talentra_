"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerStatusFilter = void 0;
class EmployerStatusFilter {
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
exports.EmployerStatusFilter = EmployerStatusFilter;
//# sourceMappingURL=EmployerStatusFilter.js.map