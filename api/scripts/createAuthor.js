import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.error("Usage: node scripts/createAuthor.js <username> <password>");
    process.exit(1);
}

const hashed = await bcrypt.hash(password, 10);

const user = await prisma.user.upsert({
    where: { username },
    update: { role: "AUTHOR", password: hashed },
    create: { username, password: hashed, role: "AUTHOR" },
});

console.log(`Author ready: ${user.username} (id ${user.id})`);
await prisma.$disconnect();