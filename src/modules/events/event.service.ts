import prisma from "../../config/prisma";
import { notificationQueue } from "../../queue/notification.queue";
import redis from "../../config/redis";

export class EventService {
  static async createEvent(data: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    createdById: string;
  }) {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        createdById: data.createdById,
      },
    });
  }

  static async getAllEvents() {
    const cached = await redis.get("events:all");

    if (cached) {
      console.log("REDIS");
      return JSON.parse(cached);
    }

    const events = await prisma.event.findMany();

    console.log("DATABASE");

    await redis.setex("events:all", 60, JSON.stringify(events));

    return events;
  }
   static async updateEvent(eventId: string, data: any) {
    // 1. Update event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    // 2. Get all users who joined this event
    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      include: {
        user: true,
      },
    });

    // 3. Send notification to EACH user (queue)
    for (const rsvp of rsvps) {
      await notificationQueue.add("event-updated", {
        userEmail: rsvp.user.email,
        eventTitle: updatedEvent.title,
        message: `Event "${updatedEvent.title}" has been updated!`,
      });
    }

    return updatedEvent;
  }

  static async getEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        rsvps: true,
        createdBy: true,
      },
    });
  }

  static async deleteEvent(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }
}