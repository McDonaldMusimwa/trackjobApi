import { PrismaClient } from './generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import path from 'path';
// Prefer DATABASE_URL from environment, fall back to project-local src/prisma/dev.db
const fallbackDbPath = path.join(process.cwd(), 'src', 'prisma', 'dev.db');
const dbUrl = process.env.DATABASE_URL ?? `file:${fallbackDbPath}`;
const adapter = new PrismaBetterSqlite3({
    url: dbUrl,
}, {
    timestampFormat: 'unixepoch-ms'
});
const prisma = new PrismaClient({ adapter });
export default prisma;
