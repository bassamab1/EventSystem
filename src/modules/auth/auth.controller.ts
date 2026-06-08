import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await AuthService.register(name, email, password);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
}