import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import multer from "multer";

import { auth } from "./lib/auth";

const app = express();
const upload = multer();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.all("/api/auth/*", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());

app.get("/api/user/progress", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ message: "Hello World" });
});


interface UploadRequest extends Request {
  file?: Express.Multer.File;
  body: {
    name: string;
  };
}

app.post("/api/employees", upload.single("file"), (req: UploadRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "File is required" });
    return;
  }

  console.log(req.file.originalname, req.file.size);

  res.json({
    message: "File uploaded successfully!",
    file: req.file.filename,
    name: req.body.name,
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));
