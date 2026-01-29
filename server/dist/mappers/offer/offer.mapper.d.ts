import { IOfferWithJob } from "../../interfaces/offers/IOffer";
import { OfferResponseDto } from "../../dto/offer/offer.dto";
import { IOfferMapper } from "../../interfaces/offers/IOfferMapper";
export declare class OfferMapper implements IOfferMapper {
    toResponseDto(offer: IOfferWithJob): OfferResponseDto;
    toResponseDtoList(offers: IOfferWithJob[]): OfferResponseDto[];
}
//# sourceMappingURL=offer.mapper.d.ts.map