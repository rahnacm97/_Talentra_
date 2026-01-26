import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";

export class EmployerSearchFilter implements IQueryFilter<IEmployer> {
  constructor(private search?: string) {}

  apply(query: FilterQuery<IEmployer>): void {
    if (this.search) {
      query.$or = [
        { name: { $regex: this.search, $options: "i" } },
        { email: { $regex: this.search, $options: "i" } },
      ];
    }
  }
}
