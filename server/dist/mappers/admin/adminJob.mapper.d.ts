import { IAdminJobMapper } from "../../interfaces/users/admin/IAdminJobMapper";
import { AdminJob } from "../../type/admin/admin.types";
import { IJob } from "../../interfaces/jobs/IJob";
import { IEmployer } from "../../interfaces/users/employer/IEmployer";
export declare class AdminJobMapper implements IAdminJobMapper {
    private isoToDateString;
    toAdminJobDto(job: IJob & {
        employer?: IEmployer | null;
    }): AdminJob;
    toAdminJobDtoList(jobs: (IJob & {
        employer?: IEmployer | null;
    })[]): AdminJob[];
}
//# sourceMappingURL=adminJob.mapper.d.ts.map