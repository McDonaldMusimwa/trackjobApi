import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
const fallbackDbPath = path.join(process.cwd(), 'src', 'prisma', 'dev.db');
const dbUrl = process.env.DATABASE_URL ?? `file:${fallbackDbPath}`;
const adapter = new PrismaBetterSqlite3({
    url: dbUrl,
}, {
    timestampFormat: 'unixepoch-ms'
});
const prisma = new PrismaClient({ adapter });
async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
