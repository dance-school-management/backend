import { ProductServer } from "../grpc/productServer";
import path from "path";
import "dotenv/config";

const PORT = process.env["PORT"];
const PROTO_PATH = path.join(__dirname, "/proto/");

export const server = new ProductServer(PROTO_PATH, PORT);