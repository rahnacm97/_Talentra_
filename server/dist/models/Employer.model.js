"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employerSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    blocked: { type: Boolean, default: false },
    about: { type: String },
    founded: { type: String },
    cinNumber: { type: String },
    profileImage: { type: String },
    verified: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    rejectionReason: { type: String, default: null },
    rejectionCreatedAt: { type: Date },
    emailVerified: { type: Boolean, default: false },
    jobsPosted: { type: Number, default: 0 },
    location: { type: String },
    website: { type: String },
    benefits: [{ type: String }],
    socialLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
    },
    companySize: { type: String },
    industry: { type: String },
    businessLicense: { type: String },
    activeJobs: { type: Number, default: 0 },
    closedJobs: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    hiredCandidates: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    hasActiveSubscription: { type: Boolean, default: false },
    currentPlan: {
        type: String,
        enum: ["free", "professional", "enterprise"],
        default: "free",
    },
    trialEndsAt: { type: Date },
});
exports.default = (0, mongoose_1.model)("Employer", employerSchema);
//# sourceMappingURL=Employer.model.js.map