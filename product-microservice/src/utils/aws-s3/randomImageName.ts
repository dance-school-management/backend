import crypto from "crypto";

function randomImageName(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export default randomImageName;
