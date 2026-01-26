import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class EmployerStatusFilter implements IQueryFilter<IEmployer> {
  constructor(private status?: "active" | "blocked") {}

  apply(query: FilterQuery<IEmployer>): void {
    if (this.status) {
      if (this.status === "active") query.blocked = false;
      if (this.status === "blocked") query.blocked = true;
    }
  }
}
