import express from "express"
import { Express } from "express-serve-static-core";
import userRouter from '../routes/User';
import i18n, { i18nMiddleware } from './i18n';
import cookieParser from "cookie-parser";
import session from "express-session";
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";


function createApp(): Express {
    const app = express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        })
    );
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));
    app.use(i18nMiddleware.handle(i18n));

    app.use("/", userRouter);
    return app;
}

export async function startServer(): Promise<Express> {
    return createApp();
}
