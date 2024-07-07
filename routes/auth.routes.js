import { Router } from "express";
import authenticateUser from "../middlewares/userAuth.js";
import {
  addUserToOrganisation,
  createOrganisation,
  getAllOrganisations,
  getOrganisationById,
  getUserRecord,
} from "../controllers/mainControllers.js";

const authRouter = Router();

authRouter
  .use(authenticateUser)
  .get("/users/:id", getUserRecord)
  .get("/organisations", getAllOrganisations)
  .get("/organisations/:orgId", getOrganisationById)
  .post("/organisations", createOrganisation)
  .post("/organisations/:orgId/users", addUserToOrganisation);

export default authRouter;
