"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await auth_service_1.AuthService.register(name, email, password);
            res.status(201).json({
                message: "User registered successfully",
                user,
            });
        }
        catch (err) {
            res.status(400).json({
                message: err.message,
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
            res.status(200).json({
                message: "Login successful",
                ...result,
            });
        }
        catch (err) {
            res.status(400).json({
                message: err.message,
            });
        }
    }
}
exports.AuthController = AuthController;
