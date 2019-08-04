import load from "process-env-loader";
load();

import express from "express";
import { Express } from "express-serve-static-core";
import { Server } from "http";
import RateLimit from "express-rate-limit";
import cors from "cors";

const main = async (): Promise<void> => {
  const app: Express = express();

  app.use(express.json());
  app.use(cors);
  app.use(
    new RateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000
    })
  );

  const server: Server = await app.listen((process.env.PORT as any) as number);
  console.log(`Listening on PORT: ${process.env.PORT as any}`);
};
main();
