import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authControllers.js";

const publicRouter = Router();

publicRouter.post("/register", registerUser).post("/login", loginUser);

export default publicRouter;
