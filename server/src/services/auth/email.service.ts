import nodemailer from "nodemailer";
import { INotificationService } from "../../interfaces/auth/INotificationService";

export class EmailService implements INotificationService {
  private _transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string): Promise<void> {
    await this._transporter.sendMail({
      from: `"Talentra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <b>${otp}</b> for talentra verification. It will expire in 1 minute.</p>`,
    });
  }
}
