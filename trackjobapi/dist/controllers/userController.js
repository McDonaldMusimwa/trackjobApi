import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
export async function getUsers() {
    // ... you will write your Prisma Client queries here
    const allUsers = await prisma.user.findMany();
    //console.log(allUsers);
    return allUsers
}
getUsers()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
