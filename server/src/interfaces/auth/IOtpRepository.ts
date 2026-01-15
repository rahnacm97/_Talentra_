import { IOtp } from "./IOtp";

export interface IOtpRepository {
  createOtp(data: IOtp): Promise<IOtp>;
  findOtp(email: string, purpose: string): Promise<IOtp | null>;
  deleteOtp(email: string, purpose: string): Promise<void>;
}
