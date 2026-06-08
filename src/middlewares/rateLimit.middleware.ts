import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

export const rateLimit = (limit: number, windowSec: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
     const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const key = `rate:join_leave:${userId}`;

      // increase counter
      const current = await redis.incr(key);

      // set expiry only first time
      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      // check limit
      if (current > limit) {
        return res.status(429).json({
          message: "Too many requests. Please slow down.",
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Rate limiter error" });
    }
  };
};