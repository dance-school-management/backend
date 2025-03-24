import express from "express"
import { Express } from "express-serve-static-core";
import userRouter from './routes/User';
import { AppDataSource } from "./dataSource"
import i18n, { i18nMiddleware } from './i18n'; 
import { User } from "./entity/User"

function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(i18nMiddleware.handle(i18n));
  app.use("/", userRouter);

  return app;
}

async function initializeAppDataSource(): Promise<void> {
    try {
        await AppDataSource.initialize();
    } catch(err) {
        console.log(err);
    }


}

export async function startServer(): Promise<Express> {
    await initializeAppDataSource();
    return createApp();
    
}

