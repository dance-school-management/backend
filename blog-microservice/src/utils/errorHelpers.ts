import { Result, ValidationError } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Warning } from "../errors/Warning";
import { FieldErrorArray, UniversalError } from "../errors/UniversalError";
import { Prisma } from "../../generated/client";

export function transformValidationError(
  validationResult: Result<ValidationError>,
): FieldErrorArray {
  const arr: FieldErrorArray = [];
  validationResult.array().forEach((error) => {
    if (error.type === "alternative") {
      error.nestedErrors.forEach((nestedError) => {
        arr.push({
          field: nestedError.path,
          message: nestedError.msg,
        });
      });
    } else if (error.type === "field") {
      arr.push({
        field: error.path,
        message: error.msg,
      });
    }
  });
  return arr;
}

export function checkValidations(validationResult: Result<ValidationError>) {
  if (!validationResult.isEmpty()) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "Validation Error",
      transformValidationError(validationResult),
    );
  }
}

export function warningJsonBuilder(err: Warning): {
  name: string;
  message: string;
} {
  return {
    name: err.name,
    message: err.message,
  };
}

export function getWrongFields(err: Prisma.PrismaClientKnownRequestError) {
  const fields: FieldErrorArray = [];
  if (err.meta?.target) {
    if (Array.isArray(err.meta.target)) {
      err.meta.target.forEach((field) => {
        fields.push({
          field,
          message: `Field ${field} is wrong`,
        });
      });
    }
  }
  return fields;
}

