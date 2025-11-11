import nodemailer from "nodemailer";
import { INotificationService } from "../../interfaces/auth/INotificationService";
import { logger } from "../../shared/utils/logger";

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

  async sendEmployerVerificationEmail(params: {
    to: string;
    name: string;
    companyName: string;
  }): Promise<void> {
    const { to, name, companyName } = params;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f9fafb;">
        <h2 style="color: #1e40af; text-align: center;">Verification Approved</h2>
        <p style="font-size: 16px; color: #374151;">
          Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 16px; color: #374151;">
          Great news! Your employer account for <strong>${companyName}</strong> has been <strong style="color: #16a34a;">verified</strong> by our admin team.
        </p>
        <p style="font-size: 16px; color: #374151;">
          You can now:
        </p>
        <ul style="font-size: 16px; color: #374151; padding-left: 20px;">
          <li>Post unlimited job listings</li>
          <li>Receive applications from top candidates</li>
          <li>Access premium employer tools</li>
        </ul>
        <p style="font-size: 16px; color: #374151;">
          Welcome to the verified employer community!
        </p>
        <hr style="border: 1px dashed #d1d5db; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `;

    await this._transporter.sendMail({
      from: `"Talentra" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Verified Employer – ${companyName}`,
      html,
    });

    logger.info("Employer verification email sent", { to, companyName });
  }

  async sendEmployerRejectionEmail(params: {
    to: string;
    name: string;
    companyName: string;
    reason: string;
    loginUrl: string;
  }): Promise<void> {
    const { to, name, companyName, reason, loginUrl } = params;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fef2f2;">
      <h2 style="color: #dc2626; text-align: center;">Verification Rejected</h2>
      <p style="font-size: 16px; color: #374151;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 16px; color: #374151;">
        We're sorry, but your employer account for <strong>${companyName}</strong> has not been verified.
      </p>
      <div style="background: #fee2e2; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; font-weight: bold; color: #991b1b;">Reason:</p>
        <p style="margin: 8px 0 0; color: #7f1d1d;">${reason}</p>
      </div>
      <p style="font-size: 16px; color: #374151;">
        Please update your profile and resubmit for verification.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${loginUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Login to Update Profile
        </a>
      </div>
      <hr style="border: 1px dashed #fca5a5; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;

    await this._transporter.sendMail({
      from: `"Talentra" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Verification Rejected – ${companyName}`,
      html,
    });

    logger.info("Employer rejection email sent", { to, companyName });
  }
}
