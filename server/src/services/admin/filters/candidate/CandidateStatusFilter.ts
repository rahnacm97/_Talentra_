import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class CandidateStatusFilter implements IQueryFilter<ICandidate> {
  constructor(private status?: "active" | "blocked") {}

  apply(query: FilterQuery<ICandidate>): void {
    if (this.status) {
      if (this.status === "active") query.blocked = false;
      if (this.status === "blocked") query.blocked = true;
    }
  }
}
