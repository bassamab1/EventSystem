"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
class AuthService {
    static async register(name, email, password) {
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return user;
    }
    static async login(email, password) {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return { user, token };
    }
}
exports.AuthService = AuthService;
