export interface OfferResponseDto {
    id: string;
    jobId: string;
    jobTitle: string;
    name: string;
    location: string;
    salary: string;
    jobType: string;
    description: string;
    requirements: string[];
    profileImage: string;
    fullName: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter: string;
    appliedAt: string;
    status: string;
    updatedAt?: string | undefined;
    hiredAt?: string | undefined;
}
export interface OffersResponseDto {
    offers: OfferResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=offer.dto.d.ts.map