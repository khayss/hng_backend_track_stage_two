import publicRouter from "./routes/public.routes.js";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/auth", publicRouter);
  app.use("/api", authRouter);

  app.use(errorHandler);

  return app;
}

export default createServer;
