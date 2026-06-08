import nodemailer from "nodemailer";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  static async sendEmail(
    to: string,
    subject: string,
    text: string
  ) {
    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
  }
}