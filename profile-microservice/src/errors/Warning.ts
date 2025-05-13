import { StatusCodes } from "http-status-codes";

export class Warning extends Error {
  title: string;
  statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.title = "Warning";
    this.statusCode = statusCode;
  }
}
