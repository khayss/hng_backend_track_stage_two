import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middleware.js";
import { loginUserSchema, registerUserSchema } from "../utils/validation.js";

const publicRouter = Router();

publicRouter
  .post("/register", validate({ bodySchema: registerUserSchema }), registerUser)
  .post("/login", validate({ bodySchema: loginUserSchema }), loginUser);

export default publicRouter;
