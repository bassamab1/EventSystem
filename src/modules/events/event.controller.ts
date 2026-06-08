import { Request, Response } from "express";
import { EventService } from "./event.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { RSVPService } from "./rsvp.service";



export class EventController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { title, description, location, startDate } = req.body;

      const event = await EventService.createEvent({
        title,
        description,
        location,
        startDate,
        createdById: req.user.userId,
      });

      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const events = await EventService.getAllEvents();
      res.json(events);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to retrieve events" });
    }
  }

  static async getOne(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const event = await EventService.getEventById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

  static async delete(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const event = await EventService.deleteEvent(id);

    res.json({ message: "Event deleted successfully", event });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

static async updateEvent(req: Request, res: Response) {
  try {
    const eventId = req.params.id as string;
    const data = req.body;

    const updatedEvent = await EventService.updateEvent(eventId, data);

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating event" });
  }
}



static async join(req: AuthRequest, res: Response) {
  const { eventId } = req.body;

  const rsvp = await RSVPService.joinEvent(req.user.userId, eventId);

  res.json(rsvp);
}

static async leave(req: AuthRequest, res: Response) {
  const { eventId } = req.body;

  const result = await RSVPService.leaveEvent(req.user.userId, eventId);

  res.json(result);
}
}

