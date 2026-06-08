import prisma from "../../config/prisma";
import { notificationQueue } from "../../queue/notification.queue"

export class RSVPService {
  static async joinEvent(userId: string, eventId: string) {
    // 1. Save RSVP in DB
    const rsvp = await prisma.rSVP.create({
      data: {
        userId,
        eventId,
      },
    });

    // 2. Get user + event
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    // 3. SEND JOB TO REDIS QUEUE (NOT EMAIL DIRECTLY)
    if (user?.email && event) {
      console.log("📦 Adding job to queue...");
      await notificationQueue.add("event-joined", {
        userEmail: user.email,
        eventTitle: event.title,
        message: `You successfully joined: ${event.title}`,
      });
      console.log("📦 Job added successfully");
    }

    return rsvp;
  }

  static async leaveEvent(userId: string, eventId: string) {
    const rsvp = await prisma.rSVP.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (user?.email && event) {
      await notificationQueue.add("event-left", {
        userEmail: user.email,
        eventTitle: event.title,
        message: `You left event: ${event.title}`,
      });
    }

    return rsvp;
  }
}