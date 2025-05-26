// import { PrismaClient, Role } from "../generated/client";
// import logger from "../src/utils/winston";
// import coordinatorsJson from "../../data/users/coordinators.json";
// import studentsJson from "../../data/users/students.json";
// import instructorsJson from "../../data/users/instructors.json";

// const prisma = new PrismaClient();
// async function main() {
//   const users = coordinatorsJson.concat(
//     studentsJson,
//     instructorsJson,
//     generateFakeUsers(10),
//   );

//   for (const key of Object.keys(prisma)) {
//     if (key[0] == "_" || key[0] == "$" || key == "constructor") {
//       continue;
//     }
//     await (prisma as any)[key].deleteMany();
//   }

//   for (const user of users) {
//     try {
//       await auth.api.signUpEmail({
//         body: {
//           email: user.email,
//           password: user.password,
//           name: user.name,
//           //@ts-ignore
//           first_name: user.first_name,
//           surname: user.surname,
//           id: user.id,
//         },
//       });
//     } catch (error: any) {
//       logger.info(
//         ` \n User already exists or error occurred, skipping creation. for email: ${user.email} \n error: ${error}`,
//       );
//     }
//   }

//   const roles = [Role.COORDINATOR, Role.STUDENT, Role.INSTRUCTOR];
//   const usersJson = [coordinatorsJson, studentsJson, instructorsJson];

//   for (let index = 0; index < usersJson.length; index++) {
//     const users = usersJson[index];
  
//     for (const user of users) {
//       try {
//         await prisma.user.update({
//           where: { email: user.email },
//           data: {
//             role: roles[index],
//           },
//         });
//       } catch (error: any) {
//         logger.error(
//           `Error updating user role for email: ${user.email} \n error: ${error}`,
//         );
//       }
//     }
//   }
// }

// main()
//   .then(async () => {
//     console.log("Seeding completed successfully.");
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
