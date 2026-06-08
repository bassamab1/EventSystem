import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import eventRoutes from "./modules/events/event.routes";
import { EmailService } from "./services/email.service";

import prisma from "./config/prisma";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    message: "API is running",
    users,
  });
});


app.get("/send-test-email", async (req, res) => {
  try {
    await EmailService.sendEmail(
      "abbasbassam823@gmail.com",
      "Test Email",
      "Hello from backend system!"
    );

    res.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to send email",
    });
  }
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: (req as any).user,
  });
});

export default app;