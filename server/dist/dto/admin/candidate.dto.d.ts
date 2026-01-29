export interface BlockCandidateDTO {
    candidateId: string;
    block: boolean;
}
export interface CandidateResponseDTO {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    location?: string;
    title?: string;
    about?: string;
    skills: string[];
    experience: ExperienceDTO[];
    education: EducationDTO[];
    certifications: CertificationDTO[];
    resume?: string;
    blocked: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    applicationsCount?: number;
    activeApplications?: number;
    profileViews?: number;
    profileImage?: string;
}
export interface ExperienceDTO {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
}
export interface EducationDTO {
    id: string;
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate: string;
    gpa?: string;
}
export interface CertificationDTO {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
}
//# sourceMappingURL=candidate.dto.d.ts.map