import { PrismaClient } from "@prisma/client";

const userModel = new PrismaClient().users;

export default userModel;
