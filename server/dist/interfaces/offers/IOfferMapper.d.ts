import { IOfferWithJob } from "./IOffer";
import { OfferResponseDto } from "../../dto/offer/offer.dto";
export interface IOfferMapper {
    toResponseDto(offer: IOfferWithJob): OfferResponseDto;
    toResponseDtoList(offers: IOfferWithJob[]): OfferResponseDto[];
}
//# sourceMappingURL=IOfferMapper.d.ts.map