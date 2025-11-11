import { IJob } from "../../jobs/IJob";
import { IEmployer } from "../employer/IEmployer";
import { AdminJob } from "../../../types/admin/admin.types";

export interface IAdminJobMapper {
  toAdminJobDto(job: IJob & { employer?: IEmployer | null }): AdminJob;

  toAdminJobDtoList(
    jobs: (IJob & { employer?: IEmployer | null })[],
  ): AdminJob[];
}
