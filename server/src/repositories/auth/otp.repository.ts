import OtpModel from "../../models/Otp.model";
import { IOtp } from "../../interfaces/auth/IOtp";

export class OtpRepository {
  async createOtp(data: IOtp): Promise<IOtp> {
    return await OtpModel.create(data);
  }

  async findOtp(email: string, purpose: string): Promise<IOtp | null> {
    return await OtpModel.findOne({ email, purpose }).sort({ createdAt: -1 });
  }

  async deleteOtp(email: string, purpose: string): Promise<void> {
    await OtpModel.deleteMany({ email, purpose });
  }
}
