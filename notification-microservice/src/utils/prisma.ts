import { PrismaClient } from "../../generated/client";

const prisma = new PrismaClient({ errorFormat: "minimal" });

export default prisma;
