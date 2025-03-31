import { Request, Response, NextFunction } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { auth } from "../utils/auth";
import { APIError } from "better-auth/api";

