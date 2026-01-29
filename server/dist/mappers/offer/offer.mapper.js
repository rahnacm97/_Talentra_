"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferMapper = void 0;
class OfferMapper {
    toResponseDto(offer) {
        return {
            id: offer.id,
            jobId: offer.jobId,
            jobTitle: offer.job.title,
            name: offer.employer.name,
            location: offer.job.location,
            salary: offer.job.salary || "",
            jobType: offer.job.type,
            description: offer.job.description,
            requirements: offer.job.requirements,
            profileImage: offer.employer.profileImage || "",
            fullName: offer.fullName,
            email: offer.email,
            phone: offer.phone,
            resume: offer.resume,
            coverLetter: offer.coverLetter || "",
            appliedAt: offer.appliedAt.toISOString(),
            status: offer.status,
            updatedAt: offer.updatedAt.toISOString(),
            hiredAt: offer.hiredAt ? offer.hiredAt.toISOString() : undefined,
        };
    }
    toResponseDtoList(offers) {
        return offers.map((offer) => this.toResponseDto(offer));
    }
}
exports.OfferMapper = OfferMapper;
//# sourceMappingURL=offer.mapper.js.map