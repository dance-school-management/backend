import { PrismaClient } from "../generated/client";
import { auth } from "../src/utils/auth";
import logger from "../src/utils/winston";
import { generateFakeUsers } from "../src/data/usersFaker";
import coordinatorsJson from "../../data/users/coordinators.json";
import studentsJson from "../../data/users/students.json";
import instructorsJson from "../../data/users/instructors.json";
import administratorsJson from "../../data/users/administrators.json";

const prisma = new PrismaClient();
async function main() {
  const users = coordinatorsJson.concat(
    studentsJson,
    instructorsJson,
    administratorsJson,
    generateFakeUsers(69, 62, "STUDENT"),
    generateFakeUsers(15, 15, "INSTRUCTOR"),
    generateFakeUsers(4, 6, "COORDINATOR"),
  );

  for (const user of users) {
    try {
      await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
          //@ts-ignore
          first_name: user.first_name,
          surname: user.surname,
          id: user.id,
        },
      });
    } catch (error: any) {
      logger.info(
        ` \n User already exists or error occurred, skipping creation. for email: ${user.email} \n error: ${error}`,
      );
    }
  }

  for (const user of users) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: user.role,
        },
      });
    } catch (error: any) {
      console.log(user);
      logger.error(
        `Error updating user role for email: ${user.email} \n error: ${error}`,
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
