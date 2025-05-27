import { PrismaClient, Role } from "../generated/client";
import logger from "../src/utils/winston";
import { generateFakeProfiles } from "../src/data/profilesFaker";

const prisma = new PrismaClient();
async function main() {
  const users = generateFakeProfiles(61, 70, Role.STUDENT).concat(
    generateFakeProfiles(11, 49, Role.INSTRUCTOR),
    generateFakeProfiles(1, 9, Role.COORDINATOR),
  );

  for (const user of users) {
    try {
      await prisma.profile.update({
        where: { id: user.id },
        data: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          description: user.description,
          role: user.role as Role,
          photoPath: user.photoPath,
          favouriteDanceCategories: user.favouriteDanceCategories,
          startDate: user.startDate,
        },
      });
    } catch (error: any) {
      logger.info(
        `\n Profile already exists or error occurred, skipping creation for email: ${user.email} \n error: ${error}`,
      );
    }
  }
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
