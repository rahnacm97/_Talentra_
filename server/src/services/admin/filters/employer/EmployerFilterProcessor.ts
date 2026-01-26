import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class EmployerFilterProcessor {
  private filters: IQueryFilter<IEmployer>[] = [];

  addFilter(filter: IQueryFilter<IEmployer>): void {
    this.filters.push(filter);
  }

  buildQuery(): FilterQuery<IEmployer> {
    const query: FilterQuery<IEmployer> = {};
    for (const filter of this.filters) {
      filter.apply(query);
    }
    return query;
  }
}
