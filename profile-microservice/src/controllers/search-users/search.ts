import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../../generated/client";

export async function getSearchUsers(
  req: Request<
    {},
    {},
    {},
    {
      query?: string;
    }
  > & { user?: any; },
  res: Response,
) {
  const { query } = req.query;
  const orConditions = [];

  if (query) {
    orConditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { surname: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } },
        { phone: { contains: query, mode: "insensitive" as const } },
      ],
    });
  }

  const foundUsers = await prisma.profile.findMany({
    where: {
      OR: orConditions,
      role: {
        in: [Role.STUDENT]
      }
    },
    take: 5,
  });

  res.status(StatusCodes.OK).json(foundUsers);
}
