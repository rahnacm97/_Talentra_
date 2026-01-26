import { FilterQuery } from "mongoose";
import { ICandidate } from "../../../../interfaces/users/candidate/ICandidate";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class CandidateFilterProcessor {
  private filters: IQueryFilter<ICandidate>[] = [];

  addFilter(filter: IQueryFilter<ICandidate>): void {
    this.filters.push(filter);
  }

  buildQuery(): FilterQuery<ICandidate> {
    const query: FilterQuery<ICandidate> = {};
    for (const filter of this.filters) {
      filter.apply(query);
    }
    return query;
  }
}
