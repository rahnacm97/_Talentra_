import { FilterQuery } from "mongoose";
import { IEmployer } from "../../../../interfaces/users/employer/IEmployer";
import { IQueryFilter } from "../../../../interfaces/common/IQueryFilter";
export declare class EmployerFilterProcessor {
    private filters;
    addFilter(filter: IQueryFilter<IEmployer>): void;
    buildQuery(): FilterQuery<IEmployer>;
}
//# sourceMappingURL=EmployerFilterProcessor.d.ts.map