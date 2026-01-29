"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const experienceSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String },
    current: { type: Boolean, default: false },
});
const educationSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    gpa: { type: String },
});
const certificationSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    credentialId: { type: String },
});
const candidateSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    location: { type: String },
    title: { type: String },
    about: { type: String },
    resume: { type: String },
    profileImage: { type: String },
    skills: [{ type: String }],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
    emailVerified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    savedJobs: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Job" }],
        default: [],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Candidate", candidateSchema);
//# sourceMappingURL=Candidate.model.js.map