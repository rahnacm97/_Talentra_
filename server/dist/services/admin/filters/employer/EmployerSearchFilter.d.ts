import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class EmployerSearchFilter implements IQueryFilter<IEmployer> {
    private search?;
    constructor(search?: string | undefined);
    apply(query: FilterQuery<IEmployer>): void;
}
//# sourceMappingURL=EmployerSearchFilter.d.ts.map