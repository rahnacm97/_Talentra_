import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class EmployerStatusFilter implements IQueryFilter<IEmployer> {
    private status?;
    constructor(status?: "active" | "blocked" | undefined);
    apply(query: FilterQuery<IEmployer>): void;
}
//# sourceMappingURL=EmployerStatusFilter.d.ts.map