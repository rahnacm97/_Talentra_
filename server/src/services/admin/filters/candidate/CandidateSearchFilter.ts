import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class CandidateSearchFilter implements IQueryFilter<ICandidate> {
  constructor(private search?: string) {}

  apply(query: FilterQuery<ICandidate>): void {
    if (this.search) {
      query.$or = [
        { name: { $regex: this.search, $options: "i" } },
        { email: { $regex: this.search, $options: "i" } },
      ];
    }
  }
}
