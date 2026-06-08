import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// 1. Create a native pg Connection Pool using your environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it inside the Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

export default prisma;