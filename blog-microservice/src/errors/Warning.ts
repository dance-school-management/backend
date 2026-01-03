import { StatusCodes } from "http-status-codes";

export class Warning extends Error {
  name: string;
  statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.name = "Warning";
    this.statusCode = statusCode;
  }
}

