import { IEmployer } from "./IEmployer";
import {
  EmployerDataDTO,
  EmployerAnalyticsDTO,
} from "../../../dto/employer/employer.dto";

export interface IEmployerService {
  getEmployerById(employerId: string): Promise<IEmployer | null>;
  updateProfile(
    employerId: string,
    data: EmployerDataDTO,
    businessLicenseFile?: Express.Multer.File,
    profileImageFile?: Express.Multer.File,
  ): Promise<EmployerDataDTO>;
}

export interface IEmployerAnalyticsService {
  getEmployerAnalytics(
    employerId: string,
    timeRange: string,
  ): Promise<EmployerAnalyticsDTO>;
}
