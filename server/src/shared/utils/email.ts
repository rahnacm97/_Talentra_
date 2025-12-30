import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface InterviewEmailData {
  to: string;
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  interviewLink?: string;
  companyName?: string;
}

export const sendInterviewScheduledEmail = async (data: InterviewEmailData) => {
  const {
    to,
    candidateName,
    jobTitle,
    interviewDate,
    interviewLink,
    companyName,
  } = data;

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
        
        ${
          interviewLink
            ? `<p style="margin: 16px 0 0;">
               <strong>Meeting Link:</strong><br/>
               <a href="${interviewLink}" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">
                 Click here to join the interview
               </a>
             </p>`
            : `<p style="margin: 16px 0 0; color: #6366f1; font-style: italic;">
               The interview link will be shared with you shortly via email or chat.
             </p>`
        }
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send interview email:", error.message);
    } else {
      console.error("Unknown error occurred while sending email");
    }
  }
};

export const sendHiredEmail = async (data: {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
}) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send hired email:", error.message);
    } else {
      console.error("Unknown error occurred while sending hired email");
    }
  }
};
