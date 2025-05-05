import { Result, ValidationError } from "express-validator";
import { StatusCodes } from "http-status-codes";

export class ExValError extends Error {
  validationArray: ValidationError[];
  title: string;
  statusCode: StatusCodes;
  constructor(
    message: string,
    statusCode: StatusCodes,
    validationResult: Result<ValidationError>,
  ) {
    super(message);
    this.title = "ExValError";
    this.statusCode = statusCode;
    this.validationArray = validationResult.array();
  }
}
