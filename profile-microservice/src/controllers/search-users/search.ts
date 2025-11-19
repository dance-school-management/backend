import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";

export async function getSearchUsers(
  req: Request<
    {},
    {},
    {},
    {
      nameQuery?: string;
      surnameQuery?: string;
      emailQuery?: string;
      phoneQuery?: string;
    }
  > & { user?: any },
  res: Response,
) {
  const { nameQuery, surnameQuery, emailQuery, phoneQuery } = req.query;

  const foundUsers = await prisma.profile.findMany({
    where: {
      name: {
        contains: nameQuery,
      },
      surname: {
        contains: surnameQuery,
      },
      email: {
        contains: emailQuery,
      },
      phone: {
        contains: phoneQuery,
      },
    }
  });

  res.status(StatusCodes.OK).json(foundUsers)
}
