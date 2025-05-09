import { StatusCodes } from "http-status-codes";

type FieldError = {
  field: string;
  message: string;
};
export type FieldErrorArray = FieldError[];

export class UniversalError extends Error {
  statusCode: StatusCodes;
  errors: FieldErrorArray;
  message: string;
  constructor(
    statusCode: StatusCodes,
    message: string,
    errors: FieldErrorArray,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "UniversalError";
    this.errors = errors;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      errors: this.errors,
    };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
