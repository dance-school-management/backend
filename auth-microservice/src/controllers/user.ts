import { Request, Response } from "express";
import { auth } from "../utils/auth";
import prisma from "../utils/prisma";
import { createProfile } from "../grpc/profile/profile";
import { APIError } from "better-auth/api";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/winston";
import * as cookie from "cookie";
export async function registerUser(req: Request, res: Response) {
  const { email, password, name, surname } = req.body;
  let responseForProfile;
  let headersForProfile;
  try {
    const { headers, response } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        name: `${name} ${surname}`,
        email,
        password,
      },
    });
    headersForProfile = headers;
    responseForProfile = response;

    console.log("User created in auth service");
  } catch (error) {
    if (error instanceof APIError) {
      throw new UniversalError(error.statusCode, error.message, []);
    }
  }
  if (responseForProfile && headersForProfile) {
    const cookies = headersForProfile.get("set-cookie");
    const headers = headersForProfile.get("x-custom-header");
    res.header({
      "set-cookie": cookies,
      "x-custom-header": headers,
    });
    try {
      const responseProfile = await createProfile(
        responseForProfile.user.id,
        name,
        surname,
        "STUDENT",
      );
    } catch (err) {
      try {
        await auth.api.deleteUser({
          body: {
            password,
          },
          headers: {
            Cookie: cookies || "",
          },
        });
      } catch (err2) {
        console.log(err2);
        logger.error(
          `Error deleting user in auth service after profile creation error: ${err2}`,
        );
        /* empty */
      }
      throw err;
    }
    res.status(StatusCodes.OK).json(responseForProfile);
    return;
  }
}
