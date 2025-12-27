import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma, Role } from "../../../generated/client";
import prisma from "../../utils/prisma";

export async function getSearchUsers(
  req: Request<
    {},
    {},
    {},
    { q?: string; }
  > & { user?: any; },
  res: Response,
) {
  const { q } = req.query;

  const whereClause: Prisma.ProfileWhereInput = {
    role: {
      in: [Role.STUDENT]
    }
  };

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" as const } },
      { surname: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
      { phone: { contains: q, mode: "insensitive" as const } },
    ];
  }

  const foundUsers = await prisma.profile.findMany({
    where: whereClause,
    take: 5,
  });

  res.status(StatusCodes.OK).json(foundUsers);
}
