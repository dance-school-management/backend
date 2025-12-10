import { faker } from "@faker-js/faker";
import { Profile, Role } from "../../generated/client";
import photosNames from "../../../data/profile/photos.json";

const DANCE_CATEGORIES_COUNT = 5;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Generates a valid Polish mobile phone number.
 * Polish mobile numbers have 9 digits and start with specific 2-digit prefixes (45, 50, 51, etc.)
 * followed by 7 more digits.
 * Format: xxx xxx xxx
 */
function generatePolishPhoneNumber(): string {
  // Valid Polish mobile number 2-digit prefixes (a third digit 0-9 will be appended)
  const validPrefixes = [
    '45', '50', '51', '53', '57', '60', '66', '69', '72', '73', '78', '79', '88'
  ];
  
  // Select a random prefix
  const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
  
  // Generate the third digit for the prefix (0-9)
  const thirdDigit = Math.floor(Math.random() * 10);
  
  // Generate remaining 6 digits
  const remainingDigits = Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  
  // Format: xxx xxx xxx
  const firstPart = prefix + thirdDigit;
  const secondPart = remainingDigits.substring(0, 3);
  const thirdPart = remainingDigits.substring(3, 6);
  
  return `${firstPart} ${secondPart} ${thirdPart}`;
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
        : new Date(faker.date.past({ years: 5 }).toISOString().split("T")[0]),
    description: faker.lorem.paragraph(),
    role,
    photoPath:
      "uploads/" + photosNames[parseInt(id) % photosNames.length] || null,
    favouriteDanceCategories: [
      getRandomInt(DANCE_CATEGORIES_COUNT),
      getRandomInt(DANCE_CATEGORIES_COUNT),
    ],
    phone: generatePolishPhoneNumber(),
  };
};

export const generateFakeProfiles = (
  startId: number,
  count: number,
  role: Role,
) => {
  return Array.from({ length: count + 1 }, (_, index) => {
    const id = (startId + index).toString();
    return generateFakeProfile(id, role);
  });
  //return Array.from({ length: count }, generateFakeUser);
};
