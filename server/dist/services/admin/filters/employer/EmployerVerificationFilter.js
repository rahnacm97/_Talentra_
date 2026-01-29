"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerVerificationFilter = void 0;
class EmployerVerificationFilter {
    constructor(verification) {
        this.verification = verification;
    }
    apply(query) {
        if (this.verification) {
            if (this.verification === "verified")
                query.verified = true;
            if (this.verification === "pending")
                query.verified = false;
        }
    }
}
exports.EmployerVerificationFilter = EmployerVerificationFilter;
//# sourceMappingURL=EmployerVerificationFilter.js.map