import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class EmployerVerificationFilter implements IQueryFilter<IEmployer> {
  constructor(private verification?: "verified" | "pending") {}

  apply(query: FilterQuery<IEmployer>): void {
    if (this.verification) {
      if (this.verification === "verified") query.verified = true;
      if (this.verification === "pending") query.verified = false;
    }
  }
}
