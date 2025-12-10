"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/client");
const winston_1 = __importDefault(require("../src/utils/winston"));
const profilesFaker_1 = require("../src/data/profilesFaker");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = (0, profilesFaker_1.generateFakeProfiles)(61, 70, client_1.Role.STUDENT).concat((0, profilesFaker_1.generateFakeProfiles)(11, 19, client_1.Role.INSTRUCTOR), (0, profilesFaker_1.generateFakeProfiles)(1, 9, client_1.Role.COORDINATOR), (0, profilesFaker_1.generateFakeProfiles)(2000, 2, client_1.Role.ADMINISTRATOR));
        for (const user of users) {
            try {
                yield prisma.profile.update({
                    where: { id: user.id },
                    data: {
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        phone: user.phone,
                        description: user.description,
                        role: user.role,
                        photoPath: user.photoPath,
                        favouriteDanceCategories: user.favouriteDanceCategories,
                        startDate: user.startDate,
                    },
                });
            }
            catch (error) {
                console.log(user);
                winston_1.default.info(`\n Profile already exists or error occurred, skipping updates for email: ${user.email} \n error: ${error}`);
            }
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
