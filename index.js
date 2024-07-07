import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config/config.js";
import publicRouter from "./routes/public.routes.js";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const { PORT } = config;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", publicRouter);
app.use("/api", authRouter);

app.use(errorHandler);

startServer();

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
}
