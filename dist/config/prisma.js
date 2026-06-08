"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure environment variables are loaded
dotenv_1.default.config();
// 1. Create a native pg Connection Pool using your environment variable
const pool = new pg_1.default.Pool({ connectionString: process.env.DATABASE_URL });
// 2. Wrap it inside the Prisma 7 Driver Adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// 3. Pass the adapter to the PrismaClient constructor
const prisma = new prisma_1.PrismaClient({ adapter });
exports.default = prisma;
