"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInterviewCancelledEmail = exports.sendInterviewRescheduledEmail = exports.sendRejectionEmail = exports.sendHiredEmail = exports.sendInterviewScheduledEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendInterviewScheduledEmail = async (data) => {
    const { to, candidateName, jobTitle, interviewDate, interviewLink, companyName, } = data;
    const date = new Date(interviewDate.replace(" ", "T"));
    const formattedDate = date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px; font-size: 28px;">
        Interview Scheduled
      </h2>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi <strong>${candidateName}</strong>,
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Great news! You've been shortlisted for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
      </p>
      
      <div style="background: #eef2ff; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #6366f1;">
        <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: bold;">
          Interview Details
        </p>
        <p style="margin: 12px 0 0; font-size: 18px; color: #1e40af;">
          ${formattedDate}
        </p>
        
        ${interviewLink
        ? `<p style="margin: 16px 0 0;">
               <strong>Meeting Link:</strong><br/>
               <a href="${interviewLink}" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">
                 Click here to join the interview
               </a>
             </p>`
        : `<p style="margin: 16px 0 0; color: #6366f1; font-style: italic;">
               The interview link will be shared with you shortly via email or chat.
             </p>`}
      </div>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We're excited to meet you and discuss how you can contribute to our team!
      </p>

      <p style="font-size: 16px; color: #374151;">
        Best regards,<br/>
        <strong>HR Team – ${companyName}</strong>
      </p>

      <hr style="border: none; border-top: 2px dashed #cbd5e1; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This is an automated message from Talentra. Please do not reply.
      </p>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"${companyName} Hiring" <${process.env.SMTP_USER}>`,
            to,
            subject: `Interview Scheduled: ${jobTitle} at ${companyName}`,
            html,
        });
        console.log("Interview email sent successfully to:", to);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Failed to send interview email:", error.message);
        }
        else {
            console.error("Unknown error occurred while sending email");
        }
    }
};
exports.sendInterviewScheduledEmail = sendInterviewScheduledEmail;
const sendHiredEmail = async (data) => {
    const { to, candidateName, jobTitle, companyName } = data;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #10b981; text-align: center; margin-bottom: 24px; font-size: 28px;">
        Congratulations! You're Hired!
      </h2>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi <strong>${candidateName}</strong>,
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We are thrilled to inform you that you have been selected for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!
      </p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #10b981;">
        <p style="margin: 0; font-size: 16px; color: #065f46; font-weight: bold;">
          Welcome to the team!
        </p>
        <p style="margin: 12px 0 0; font-size: 16px; color: #065f46;">
          Your hard work and skills really stood out, and we can't wait to see what you achieve with us.
        </p>
      </div>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        The HR team will be in touch with you shortly regarding the next steps, onboarding process, and documentation.
      </p>

      <p style="font-size: 16px; color: #374151;">
        Best regards,<br/>
        <strong>HR Team – ${companyName}</strong>
      </p>

      <hr style="border: none; border-top: 2px dashed #cbd5e1; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This is an automated message from Talentra. Please do not reply.
      </p>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"${companyName} Hiring" <${process.env.SMTP_USER}>`,
            to,
            subject: `Congratulations! You are Hired for ${jobTitle} at ${companyName}`,
            html,
        });
        console.log("Hired email sent successfully to:", to);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Failed to send hired email:", error.message);
        }
        else {
            console.error("Unknown error occurred while sending hired email");
        }
    }
};
exports.sendHiredEmail = sendHiredEmail;
const sendRejectionEmail = async (data) => {
    const { to, candidateName, jobTitle, companyName, feedback } = data;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #64748b; text-align: center; margin-bottom: 24px; font-size: 28px;">
        Application Update
      </h2>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi <strong>${candidateName}</strong>,
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for taking the time to go through our interview process.
      </p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #ef4444;">
        <p style="margin: 0; font-size: 16px; color: #991b1b; font-weight: bold;">
          Application Status
        </p>
        <p style="margin: 12px 0 0; font-size: 16px; color: #7f1d1d;">
          After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.
        </p>
      </div>

      ${feedback
        ? `<div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #3b82f6;">
               <p style="margin: 0; font-size: 16px; color: #1e40af; font-weight: bold;">
                 Feedback from Our Team
               </p>
               <p style="margin: 12px 0 0; font-size: 16px; color: #1e3a8a; line-height: 1.6;">
                 ${feedback}
               </p>
             </div>`
        : ""}

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We appreciate your interest in joining our team and encourage you to apply for future opportunities that match your skills and experience.
      </p>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We wish you all the best in your job search and future career endeavors.
      </p>

      <p style="font-size: 16px; color: #374151;">
        Best regards,<br/>
        <strong>HR Team – ${companyName}</strong>
      </p>

      <hr style="border: none; border-top: 2px dashed #cbd5e1; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This is an automated message from Talentra. Please do not reply.
      </p>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"${companyName} Hiring" <${process.env.SMTP_USER}>`,
            to,
            subject: `Application Update: ${jobTitle} at ${companyName}`,
            html,
        });
        console.log("Rejection email sent successfully to:", to);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Failed to send rejection email:", error.message);
        }
        else {
            console.error("Unknown error occurred while sending rejection email");
        }
    }
};
exports.sendRejectionEmail = sendRejectionEmail;
const sendInterviewRescheduledEmail = async (data) => {
    const { to, candidateName, jobTitle, interviewDate, interviewLink, companyName, } = data;
    const date = new Date(interviewDate);
    const formattedDate = date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fffcf0; border-radius: 16px; border: 1px solid #fde68a;">
      <h2 style="color: #b45309; text-align: center; margin-bottom: 24px; font-size: 28px;">
        Interview Rescheduled
      </h2>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi <strong>${candidateName}</strong>,
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Your interview for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been rescheduled to a new time.
      </p>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #f59e0b;">
        <p style="margin: 0; font-size: 16px; color: #92400e; font-weight: bold;">
          New Interview Details
        </p>
        <p style="margin: 12px 0 0; font-size: 18px; color: #b45309;">
          ${formattedDate}
        </p>
        
        ${interviewLink
        ? `<p style="margin: 16px 0 0;">
               <strong>Meeting Link:</strong><br/>
               <a href="${interviewLink}" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">
                 Click here to join the interview
               </a>
             </p>`
        : ""}
      </div>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We apologize for any inconvenience this may have caused and look forward to speaking with you at the new scheduled time.
      </p>

      <p style="font-size: 16px; color: #374151;">
        Best regards,<br/>
        <strong>HR Team – ${companyName}</strong>
      </p>

      <hr style="border: none; border-top: 2px dashed #fbd38d; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This is an automated message from Talentra. Please do not reply.
      </p>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"${companyName} Hiring" <${process.env.SMTP_USER}>`,
            to,
            subject: `Interview Rescheduled: ${jobTitle} at ${companyName}`,
            html,
        });
        console.log("Rescheduling email sent successfully to:", to);
    }
    catch (error) {
        console.error("Failed to send rescheduling email:", error);
    }
};
exports.sendInterviewRescheduledEmail = sendInterviewRescheduledEmail;
const sendInterviewCancelledEmail = async (data) => {
    const { to, candidateName, jobTitle, companyName } = data;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fff1f2; border-radius: 16px; border: 1px solid #fecdd3;">
      <h2 style="color: #be123c; text-align: center; margin-bottom: 24px; font-size: 28px;">
        Interview Cancelled
      </h2>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hi <strong>${candidateName}</strong>,
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        We are writing to inform you that your interview for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been cancelled.
      </p>
      
      <div style="background: #ffe4e6; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 5px solid #f43f5e;">
        <p style="margin: 0; font-size: 16px; color: #9f1239; font-weight: bold;">
          Status Update
        </p>
        <p style="margin: 12px 0 0; font-size: 16px; color: #be123c;">
          The scheduled interview session has been removed from the calendar.
        </p>
      </div>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        If this was a mistake or you have questions regarding the cancellation, please feel free to reach out to us.
      </p>

      <p style="font-size: 16px; color: #374151;">
        Best regards,<br/>
        <strong>HR Team – ${companyName}</strong>
      </p>

      <hr style="border: none; border-top: 2px dashed #fda4af; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This is an automated message from Talentra. Please do not reply.
      </p>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"${companyName} Hiring" <${process.env.SMTP_USER}>`,
            to,
            subject: `Interview Cancelled: ${jobTitle} at ${companyName}`,
            html,
        });
        console.log("Cancellation email sent successfully to:", to);
    }
    catch (error) {
        console.error("Failed to send cancellation email:", error);
    }
};
exports.sendInterviewCancelledEmail = sendInterviewCancelledEmail;
//# sourceMappingURL=email.js.map