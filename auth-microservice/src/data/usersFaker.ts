import { faker } from "@faker-js/faker";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  first_name: string;
  surname: string;
}

export const generateFakeUser = (): User => {
  const first_name = faker.person.firstName();
  const surname = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: "qwertyqwerty",
    name: first_name + " " + surname,
    first_name,
    surname,
  };
};

export const generateFakeUsers = (count: number): User[] => {
  return Array.from({ length: count }, generateFakeUser);
};
