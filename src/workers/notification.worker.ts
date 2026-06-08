import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import redis from "../config/redis";
import { EmailService } from "../services/email.service";

const worker = new Worker(
  "notifications",
  async (job) => {
    const { userEmail, message } = job.data;

    console.log("🔥 Processing:", job.name);

    await EmailService.sendEmail(
      userEmail,
      "Event Update Notification",
      message
    );

    console.log("✅ Email sent to:", userEmail);
  },
  {
    connection: redis,
  }
);