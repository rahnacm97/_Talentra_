import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class EmployerVerificationFilter implements IQueryFilter<IEmployer> {
    private verification?;
    constructor(verification?: "verified" | "pending" | undefined);
    apply(query: FilterQuery<IEmployer>): void;
}
//# sourceMappingURL=EmployerVerificationFilter.d.ts.map