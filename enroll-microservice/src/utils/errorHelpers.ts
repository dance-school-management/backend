import { Result, ValidationError } from "express-validator";
import { ExValError } from "../errors/ExValError";
import { StatusCodes } from "http-status-codes";
import { Warning } from "../errors/Warning";

export function checkValidations(validationResult: Result<ValidationError>) {
  if (!validationResult.isEmpty()) {
    throw new ExValError(
      "Validation failed",
      StatusCodes.BAD_REQUEST,
      validationResult,
    );
  }
}

export function exErrJsonBuilder(err: ExValError): {
  title: string;
  message: string;
  validationArray: ValidationError[];
} {
  return {
    title: err.title,
    message: err.message,
    validationArray: err.validationArray,
  };
}

export function warningJsonBuilder(err: Warning): {
  title: string;
  message: string;
} {
  return {
    title: err.title,
    message: err.message,
  };
}
