import { Router } from "express";
import authenticateUser from "../middlewares/userAuth.middleware.js";
import * as controllers from "../controllers/main.controllers.js";
import validate from "../middlewares/validator.middleware.js";
import { registerOganisationSchema } from "../utils/validation.js";

const authRouter = Router();

authRouter
  .use(authenticateUser)
  .get("/users/:id", controllers.getUserRecord)
  .get("/organisations", controllers.getAllOrganisations)
  .get("/organisations/:orgId", controllers.getOrganisationById)
  .post(
    "/organisations",
    validate({ bodySchema: registerOganisationSchema }),
    controllers.createOrganisation
  )
  .post("/organisations/:orgId/users", controllers.addUserToOrganisation);

export default authRouter;
