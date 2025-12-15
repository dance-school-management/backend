import { faker } from "@faker-js/faker";
type Role = "INSTRUCTOR" | "COORDINATOR" | "STUDENT" | "ADMINISTRATOR";
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  first_name: string;
  surname: string;
  role: Role;
}

export const generateFakeUser = (id: string, role: Role): User => {
  const first_name = faker.person.firstName();
  const surname = faker.person.lastName();
  return {
    id: id, //faker.string.uuid(),
    email: faker.internet.email(),
    password: "qwertyqwerty",
    name: first_name + " " + surname,
    first_name,
    surname,
    role,
  };
};

export const generateFakeUsers = (
  startId: number,
  count: number,
  role: Role,
): User[] => {
  return Array.from({ length: count + 1 }, (_, index) => {
    const id = (startId + index).toString();
    return generateFakeUser(id, role);
  });
  //return Array.from({ length: count }, generateFakeUser);
};
