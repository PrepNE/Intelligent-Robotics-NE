import { mail } from "../config";
import nodemailer from "nodemailer";

export async function sendEmail({
  content,
  subject,
  toEmail,
}: {
  toEmail: string;
  subject: string;
  content: string;
}) {
  try {
    let transporter = nodemailer.createTransport({
      host: mail.host, // e.g., "smtp.gmail.com"
      port: mail.port, // e.g., 587 for TLS, 465 for SSL
      secure: mail.secure, // true for 465, false for 587
      auth: {
        user: mail.user, // e.g., process.env.MAIL_USER
        pass: mail.pass, // e.g., process.env.MAIL_PASS
      },
      tls: {
        rejectUnauthorized: false, // useful for local or dev SMTP
      },
    });

    let mailOptions = {
      from: `"${mail.senderName}" <${mail.from}>`, // e.g., "Test User" <test@example.com>
      to: toEmail,
      subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
