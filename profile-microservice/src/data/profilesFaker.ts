import { faker } from "@faker-js/faker";
import { Profile, Role } from "../../generated/client";
import photosNames from "../../../data/profile/photos.json";

const DANCE_CATEGORIES_COUNT = 5;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

export const generateFakeProfile = (id: string, role: Role): Profile => {
  return {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    id: id,
    email: faker.internet.email(),
    startDate:
      role == "STUDENT"
        ? null 
        : new Date(faker.date
            .past({ years: 5 })
            .toISOString()
            .split("T")[0]),
    description: faker.lorem.paragraph(),
    role,
    photoPath: "uploads/" + photosNames[parseInt(id) % photosNames.length] || null,
    favouriteDanceCategories: [
      getRandomInt(DANCE_CATEGORIES_COUNT),
      getRandomInt(DANCE_CATEGORIES_COUNT),
    ],
    phone: faker.phone.number().replace("-", ""),
  };
};

export const generateFakeProfiles = (
  startId: number,
  count: number,
  role: Role,
) => {
  return Array.from({ length: count }, (_, index) => {
    const id = (startId + index).toString();
    return generateFakeProfile(id, role);
  });
  //return Array.from({ length: count }, generateFakeUser);
};
