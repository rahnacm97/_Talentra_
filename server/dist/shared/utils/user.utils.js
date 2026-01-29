"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectUserByEmail = detectUserByEmail;
exports.detectUserByEmailForGoogle = detectUserByEmailForGoogle;
async function detectUserByEmail(email, repos) {
    for (const userType of Object.keys(repos)) {
        const repo = repos[userType];
        const user = await repo.findByEmail(email);
        if (user) {
            return { user, userType };
        }
    }
    return null;
}
async function detectUserByEmailForGoogle(email, repos) {
    const candidate = await repos.Candidate.findByEmail(email);
    if (candidate) {
        return { user: candidate, userType: "Candidate" };
    }
    const employer = await repos.Employer.findByEmail(email);
    if (employer) {
        return { user: employer, userType: "Employer" };
    }
    return null;
}
//# sourceMappingURL=user.utils.js.map